import React from "react";
import {render, screen, fireEvent, configure} from "@testing-library/react";
import {Formik} from "formik";
import {MemoryRouter} from "react-router-dom";
import {RateiosSection} from "../RateiosSection";
import {DespesaFormPipelineProvider} from "../../context/DespesaFormPipelineContext";
import {visoesService} from "../../../../../../services/visoes.service";

jest.mock("../../../../../../services/visoes.service", () => ({
    visoesService: {getPermissoes: jest.fn(), featureFlagAtiva: jest.fn()},
}));
jest.mock("../../../../../../services/auth.service", () => ({ASSOCIACAO_UUID: "UUID"}));
jest.mock("../../../Tags", () => ({Tags: () => <div data-testid="tags" />}));
jest.mock("../../rateios/RateioCusteio", () => ({RateioCusteio: () => <div data-testid="rateio-custeio" />}));
jest.mock("../../rateios/RateioCapital", () => ({RateioCapital: () => <div data-testid="rateio-capital" />}));
jest.mock("../../modals/ExibeMotivosPagamentoAntecipadoNoForm", () => () => <div />);
jest.mock("@fortawesome/react-fontawesome", () => ({FontAwesomeIcon: () => <span />}));
jest.mock("@fortawesome/free-solid-svg-icons", () => ({faTimesCircle: {}}));

let propsModal;
jest.mock("../../modals/ModalDeletarRateioComEstorno", () => ({
    ModalDeletarRateioComEstorno: (p) => {
        propsModal = p;
        return <div data-testid="modal-estorno" />;
    },
}));

const rateio = (extra = {}) => ({aplicacao_recurso: "CUSTEIO", ...extra});

const renderiza = ({rateios = [rateio()], values = {}, tabelas = {}, ui = {}, fluxo = {}} = {}) => {
    const t = {
        despesaContext: {verboHttp: "PUT"},
        despesasTabelas: {tipos_aplicacao_recurso: [{id: "CUSTEIO", nome: "Custeio"}, {id: "CAPITAL", nome: "Capital"}]},
        aux: {
            origemAnaliseLancamento: jest.fn(() => false),
            setaValoresCusteioCapital: jest.fn(),
            limpaTipoDespesaCusteio: jest.fn(),
            limpaCamposExclusivosAplicacaoRecurso: jest.fn(),
            handleAvisoCapital: jest.fn(),
        },
        parametroLocation: {},
        veioDeSituacaoPatrimonial: false,
        ...tabelas,
    };
    const u = {
        readOnlyCampos: false,
        setShowAvisoCapital: jest.fn(),
        showDeletarRateioComEstorno: false,
        setShowDeletarRateioComEstorno: jest.fn(),
        bloqueiaLinkCadastrarEstorno: jest.fn(() => false),
        bloqueiaRateioEstornado: jest.fn(() => false),
        bloqueiaCamposDespesa: jest.fn(() => false),
        ...ui,
    };
    const f = {removeRateio: jest.fn(), ...fluxo};
    const result = render(
        <MemoryRouter>
            <Formik
                initialValues={{mais_de_um_tipo_despesa: "sim", despesa_anterior_ao_uso_do_sistema_editavel: true, rateios, ...values}}
                onSubmit={jest.fn()}
            >
                <DespesaFormPipelineProvider tabelas={t} ui={u} fluxo={f}>
                    <RateiosSection />
                </DespesaFormPipelineProvider>
            </Formik>
        </MemoryRouter>
    );
    return {t, u, f, ...result};
};

// Os componentes expõem data-qa (usado pela equipe de QA) em campos cujo <label> não aponta para o id.
const comDataQa = (consulta, id) => {
    configure({testIdAttribute: "data-qa"});
    try {
        return screen[consulta](id);
    } finally {
        configure({testIdAttribute: "data-testid"});
    }
};
const qa = (id) => comDataQa("getByTestId", id);
const qaAusente = (id) => comDataQa("queryByTestId", id);

describe("RateiosSection - interações", () => {
    beforeEach(() => {
        visoesService.getPermissoes.mockReturnValue(true);
        visoesService.featureFlagAtiva.mockReturnValue(false);
    });

    it("alterar 'mais de um tipo de despesa' recalcula valores", () => {
        const {t} = renderiza();
        fireEvent.change(qa("cadastro-edicao-despesa-gasto-tem-rateios"), {target: {name: "mais_de_um_tipo_despesa", value: "nao"}});
        expect(t.aux.setaValoresCusteioCapital).toHaveBeenCalledWith("nao", expect.any(Object), expect.any(Function));
    });

    it("renderiza RateioCusteio ou RateioCapital conforme aplicação", () => {
        renderiza({rateios: [rateio(), rateio({aplicacao_recurso: "CAPITAL"}), rateio({aplicacao_recurso: ""})]});
        expect(screen.getAllByTestId("rateio-custeio")).toHaveLength(1);
        expect(screen.getAllByTestId("rateio-capital")).toHaveLength(1);
    });

    it("botão adicionar despesa parcial aparece só quando mais_de_um_tipo_despesa é 'sim' e adiciona rateio", () => {
        renderiza();
        expect(screen.getAllByText(/^Despesa \d/)).toHaveLength(1);
        fireEvent.click(screen.getByRole("button", {name: "+ Adicionar despesa parcial"}));
        expect(screen.getAllByText(/^Despesa \d/)).toHaveLength(2);
        expect(qa("cadastro-edicao-despesa-rateio-1-btn-remover-despesa")).toBeInTheDocument();
    });

    it("não exibe adicionar despesa parcial com 'nao'", () => {
        renderiza({values: {mais_de_um_tipo_despesa: "nao"}});
        expect(screen.queryByRole("button", {name: "+ Adicionar despesa parcial"})).not.toBeInTheDocument();
    });

    it("desabilita adicionar sem permissão ou com campos bloqueados", () => {
        renderiza({ui: {bloqueiaCamposDespesa: jest.fn(() => true)}});
        expect(screen.getByRole("button", {name: "+ Adicionar despesa parcial"})).toBeDisabled();
    });

    it("remover despesa delega para removeRateio", () => {
        const rateios = [rateio(), rateio({uuid: "r2"})];
        const {f} = renderiza({rateios});
        fireEvent.click(qa("cadastro-edicao-despesa-rateio-1-btn-remover-despesa"));
        expect(f.removeRateio).toHaveBeenCalledWith(expect.any(Function), 1, expect.objectContaining({uuid: "r2"}));
    });

    it("botão remover fica desabilitado sem permissão de deletar", () => {
        visoesService.getPermissoes.mockImplementation((p) => !(p && p[0] === "delete_despesa"));
        renderiza({rateios: [rateio(), rateio()]});
        expect(qa("cadastro-edicao-despesa-rateio-1-btn-remover-despesa")).toBeDisabled();
    });

    describe("estorno", () => {
        it("exibe 'Cadastrar estorno' para rateio salvo sem estorno", () => {
            renderiza({rateios: [rateio({uuid: "r1"})]});
            const link = qa("cadastro-edicao-despesa-rateio-0-cadastrar-estorno");
            expect(link).toHaveTextContent("Cadastrar estorno");
            expect(link).toHaveAttribute("href", "/cadastro-de-credito/");
        });

        it("exibe 'Acessar estorno' e mensagem de bloqueio quando há estorno", () => {
            renderiza({rateios: [rateio({uuid: "r1", estorno: {uuid: "e1"}})]});
            const link = qa("cadastro-edicao-despesa-rateio-0-acessar-estorno");
            expect(link).toHaveAttribute("href", "/edicao-de-receita/e1");
            expect(qa("cadastro-edicao-despesa-rateio-0-mensagem-edicao-bloqueada")).toBeInTheDocument();
        });

        it("desabilita link quando bloqueiaLinkCadastrarEstorno", () => {
            renderiza({
                rateios: [rateio({uuid: "r1"})],
                ui: {bloqueiaLinkCadastrarEstorno: jest.fn(() => true)},
            });
            expect(qa("cadastro-edicao-despesa-rateio-0-cadastrar-estorno")).toHaveClass("desabilita-link-estorno");
        });

        it("não exibe links na análise de lançamento sem a feature flag", () => {
            renderiza({
                rateios: [rateio({uuid: "r1"})],
                tabelas: {aux: {origemAnaliseLancamento: jest.fn(() => true), setaValoresCusteioCapital: jest.fn()}},
            });
            expect(qaAusente("cadastro-edicao-despesa-rateio-0-cadastrar-estorno")).not.toBeInTheDocument();
        });

        it("exibe links na análise de lançamento com a feature flag de estorno", () => {
            visoesService.featureFlagAtiva.mockReturnValue(true);
            renderiza({
                rateios: [rateio({uuid: "r1"})],
                tabelas: {aux: {origemAnaliseLancamento: jest.fn(() => true), setaValoresCusteioCapital: jest.fn()}},
            });
            expect(qa("cadastro-edicao-despesa-rateio-0-cadastrar-estorno")).toBeInTheDocument();
        });

        it("modal de exclusão com estorno remove o rateio e fecha o modal", () => {
            const {u} = renderiza({rateios: [rateio(), rateio()]});
            propsModal.onDeletarRateio();
            expect(u.setShowDeletarRateioComEstorno).toHaveBeenCalledWith(false);
            propsModal.handleClose();
            expect(u.setShowDeletarRateioComEstorno).toHaveBeenCalledTimes(2);
        });
    });
});
