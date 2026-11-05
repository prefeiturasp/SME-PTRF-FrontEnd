import React from "react";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {Formik} from "formik";
import * as Sentry from "@sentry/react";
import {AcoesSection} from "../AcoesSection";
import {DespesaFormPipelineProvider} from "../../context/DespesaFormPipelineContext";
import {visoesService} from "../../../../../../services/visoes.service";

jest.mock("../../../../../../services/visoes.service", () => ({
    visoesService: {getPermissoes: jest.fn()},
}));
jest.mock("../../../../../../services/auth.service", () => ({ASSOCIACAO_UUID: "UUID"}));
jest.mock("@sentry/react", () => ({
    withScope: jest.fn(),
    captureException: jest.fn(),
}));

const modais = {};
const mockModal = (nome, handlers) => (p) => {
    modais[nome] = p;
    return <div data-testid={nome} data-show={String(p.show)} />;
};
jest.mock("../../../../../../utils/Modais", () => ({
    SaldoInsuficiente: (p) => mockModal("saldo-insuficiente")(p),
    SaldoInsuficienteConta: (p) => mockModal("saldo-insuficiente-conta")(p),
    ChecarDespesaExistente: (p) => mockModal("checar-despesa-existente")(p),
    TipoAplicacaoRecursoNaoAceito: (p) => mockModal("tipo-aplicacao")(p),
    ExcluirImposto: (p) => mockModal("excluir-imposto")(p),
}));
jest.mock("../../modals/ModalDespesaJaConferida", () => ({
    ModalDespesaConferida: (p) => mockModal("conferida")(p),
}));
jest.mock("../../modals/ModalDespesaIncompleta", () => ({
    ModalDespesaIncompleta: (p) => mockModal("incompleta")(p),
}));
jest.mock("../../modals/ModalMotivosPagamentoAntecipado", () => ({
    __esModule: true,
    default: (p) => mockModal("motivos")(p),
}));

const renderiza = ({values = {}, tabelas = {}, ui = {}, fluxo = {}, podeHabilitar = true, errors = {}} = {}) => {
    const t = {
        despesaContext: {idDespesa: "d1", verboHttp: "PUT"},
        aux: {
            mostraBotaoDeletar: jest.fn(() => true),
            onShowDeleteModal: jest.fn(),
            ehOperacaoExclusao: jest.fn(() => false),
        },
        parametroLocation: {},
        veioDeSituacaoPatrimonial: false,
        ...tabelas,
    };
    const u = {
        exibeMsgErroValorOriginal: false,
        exibeMsgErroValorRecursos: false,
        readOnlyBtnAcao: false,
        setShowDelete: jest.fn(),
        setShowTextoModalDelete: jest.fn(),
        btnSubmitDisable: false,
        desabilitaBtnSalvar: jest.fn(),
        habilitaBtnSalvar: jest.fn(),
        eh_despesa_reconhecida: jest.fn(() => true),
        setShowExcluirImposto: jest.fn(),
        showExcluirImposto: false,
        ...ui,
    };
    const f = {
        houveAlteracoes: jest.fn(() => false),
        onShowModal: jest.fn(),
        onCancelarTrue: jest.fn(),
        saldosInsuficientesDaAcao: {},
        saldosInsuficientesDaConta: {},
        mensagensAceitaCusteioCapital: [],
        cancelarExclusaoImposto: jest.fn(),
        listaDemotivosPagamentoAntecipado: [],
        selectMotivosPagamentoAntecipado: [],
        setSelectMotivosPagamentoAntecipado: jest.fn(),
        checkBoxOutrosMotivosPagamentoAntecipado: false,
        txtOutrosMotivosPagamentoAntecipado: "",
        handleChangeCheckBoxOutrosMotivosPagamentoAntecipado: jest.fn(),
        handleChangeTxtOutrosMotivosPagamentoAntecipado: jest.fn(),
        modalState: "close",
        setModalState: jest.fn(),
        serviceIniciaEncadeamentoDosModais: jest.fn(async () => {}),
        serviceSubmitModais: jest.fn(),
        ...fluxo,
    };
    const initialValues = {despesa_anterior_ao_uso_do_sistema_editavel: true, numero_documento: "9", ...values};
    render(
        <Formik initialValues={initialValues} initialErrors={errors} onSubmit={jest.fn()}>
            <DespesaFormPipelineProvider tabelas={t} ui={u} fluxo={f}>
                <AcoesSection podeHabilitar={podeHabilitar} />
            </DespesaFormPipelineProvider>
        </Formik>
    );
    return {t, u, f};
};

describe("AcoesSection", () => {
    beforeEach(() => {
        visoesService.getPermissoes.mockReturnValue(true);
        Sentry.withScope.mockImplementation((cb) => cb({setTag: jest.fn(), setContext: jest.fn()}));
        Object.keys(modais).forEach((k) => delete modais[k]);
    });

    describe("botões", () => {
        it("Voltar sem alterações chama onCancelarTrue", () => {
            const {f} = renderiza();
            fireEvent.click(screen.getByRole("button", {name: "Voltar"}));
            expect(f.onCancelarTrue).toHaveBeenCalled();
            expect(f.onShowModal).not.toHaveBeenCalled();
        });

        it("Voltar com alterações abre o modal de confirmação", () => {
            const {f} = renderiza({fluxo: {houveAlteracoes: jest.fn(() => true)}});
            fireEvent.click(screen.getByRole("button", {name: "Voltar"}));
            expect(f.onShowModal).toHaveBeenCalled();
        });

        it("não exibe botões quando vem de situação patrimonial", () => {
            renderiza({tabelas: {veioDeSituacaoPatrimonial: true}});
            expect(screen.queryByRole("button", {name: "Voltar"})).not.toBeInTheDocument();
            expect(screen.queryByRole("button", {name: "Salvar"})).not.toBeInTheDocument();
        });

        it("Deletar abre modal de exclusão", () => {
            const {t, u} = renderiza();
            fireEvent.click(screen.getByRole("button", {name: "Deletar"}));
            expect(t.aux.onShowDeleteModal).toHaveBeenCalledWith(u.setShowDelete, u.setShowTextoModalDelete, expect.objectContaining({numero_documento: "9"}));
        });

        it("Deletar fica desabilitado sem podeHabilitar", () => {
            renderiza({podeHabilitar: false});
            expect(screen.getByRole("button", {name: "Deletar"})).toBeDisabled();
        });

        it("oculta Deletar quando mostraBotaoDeletar é falso", () => {
            renderiza({tabelas: {aux: {mostraBotaoDeletar: () => false, ehOperacaoExclusao: () => false}}});
            expect(screen.queryByRole("button", {name: "Deletar"})).not.toBeInTheDocument();
        });

        it("oculta Salvar em operação de exclusão", () => {
            renderiza({tabelas: {aux: {mostraBotaoDeletar: () => false, ehOperacaoExclusao: () => true}}});
            expect(screen.queryByRole("button", {name: "Salvar"})).not.toBeInTheDocument();
        });
    });

    describe("Salvar", () => {
        it("inicia o encadeamento de modais", async () => {
            const {u, f} = renderiza();
            fireEvent.click(screen.getByRole("button", {name: "Salvar"}));
            await waitFor(() => expect(f.serviceIniciaEncadeamentoDosModais).toHaveBeenCalled());
            expect(u.desabilitaBtnSalvar).toHaveBeenCalled();
            const [values, errors, setFieldValue, extras] = f.serviceIniciaEncadeamentoDosModais.mock.calls[0];
            expect(values.numero_documento).toBe("9");
            expect(errors).toEqual({});
            expect(setFieldValue).toEqual(expect.any(Function));
            expect(extras).toEqual({resetForm: expect.any(Function)});
        });

        it("reporta ao Sentry e reabilita o botão em caso de erro", async () => {
            const err = new Error("falhou");
            const {u} = renderiza({fluxo: {serviceIniciaEncadeamentoDosModais: jest.fn(async () => { throw err; })}});
            fireEvent.click(screen.getByRole("button", {name: "Salvar"}));
            await waitFor(() => expect(u.habilitaBtnSalvar).toHaveBeenCalled());
            expect(Sentry.captureException).toHaveBeenCalledWith(err);
        });

        it("fica desabilitado com btnSubmitDisable, readOnlyBtnAcao, sem permissão ou não editável", () => {
            renderiza({ui: {btnSubmitDisable: true}});
            expect(screen.getByRole("button", {name: "Salvar"})).toBeDisabled();
        });

        it("despesa não reconhecida exige boletim de ocorrência", () => {
            renderiza({ui: {eh_despesa_reconhecida: jest.fn(() => false)}});
            expect(screen.getByRole("button", {name: "Salvar"})).toBeDisabled();
        });

        it("despesa não reconhecida com boletim habilita salvar", () => {
            renderiza({
                ui: {eh_despesa_reconhecida: jest.fn(() => false)},
                values: {numero_boletim_de_ocorrencia: "1"},
            });
            expect(screen.getByRole("button", {name: "Salvar"})).toBeEnabled();
        });

        it("fica desabilitado sem permissão", () => {
            visoesService.getPermissoes.mockReturnValue(false);
            renderiza();
            expect(screen.getByRole("button", {name: "Salvar"})).toBeDisabled();
        });
    });

    describe("mensagens de erro", () => {
        it("exibe erros de valor quando habilitados", () => {
            renderiza({
                ui: {exibeMsgErroValorOriginal: true, exibeMsgErroValorRecursos: true},
                errors: {valor_recusos_acoes: "erro recursos", valor_original: "erro original"},
            });
            expect(screen.getByText("erro recursos")).toBeInTheDocument();
            expect(screen.getByText("erro original")).toBeInTheDocument();
        });

        it("oculta erros quando flags estão desabilitadas", () => {
            renderiza({errors: {valor_recusos_acoes: "erro recursos"}});
            expect(screen.queryByText("erro recursos")).not.toBeInTheDocument();
        });
    });

    describe("modais", () => {
        it("exibe cada modal conforme modalState", () => {
            const casos = [
                ["saldo-insuficiente-conta", "saldo-insuficiente-conta"],
                ["acao-nao-aceita-tipo-de-aplicacao", "tipo-aplicacao"],
                ["saldo-insuficiente-acao", "saldo-insuficiente"],
                ["despesa-ja-demonstrada", "conferida"],
                ["despesa-ja-cadastrada", "checar-despesa-existente"],
                ["pagamento-antecipado", "motivos"],
                ["despesa-imcompleta", "incompleta"],
            ];
            casos.forEach(([estado, testid]) => {
                document.body.innerHTML = "";
                renderiza({fluxo: {modalState: estado}});
                expect(screen.getByTestId(testid)).toHaveAttribute("data-show", "true");
            });
        });

        it("handleClose dos modais fecha e reabilita botão", () => {
            const {u, f} = renderiza();
            const chaves = ["saldo-insuficiente-conta", "tipo-aplicacao", "saldo-insuficiente", "conferida", "checar-despesa-existente", "motivos", "incompleta"];
            chaves.forEach((k) => {
                f.setModalState.mockClear();
                u.habilitaBtnSalvar.mockClear();
                modais[k].handleClose();
                expect(f.setModalState).toHaveBeenCalledWith("close");
                expect(u.habilitaBtnSalvar).toHaveBeenCalled();
            });
        });

        it("confirmações disparam serviceSubmitModais com a mensagem correta", () => {
            const {f} = renderiza();
            modais["saldo-insuficiente-conta"].onSaldoInsuficienteContaTrue();
            modais["tipo-aplicacao"].onSalvarTipoRecursoNaoAceito();
            modais["saldo-insuficiente"].onSaldoInsuficienteTrue();
            modais["conferida"].onSalvarDespesaConferida();
            modais["checar-despesa-existente"].onSalvarDespesaCadastradaTrue();
            modais["motivos"].onSalvarMotivosAntecipadosTrue();
            modais["incompleta"].onSalvarDespesaIncompleta();
            expect(f.serviceSubmitModais.mock.calls.map((c) => c[3])).toEqual([
                "saldo_insuficiente_conta_validado",
                "acao_nao_aceita_tipo_de_aplicacao_validado",
                "saldo_insuficiente_acao_validado",
                "despesa_ja_demonstrada_validado",
                "despesa_ja_cadastrada_validado",
                "pagamento_antecipado_validado",
                "despesa_incompleta_validado",
            ]);
        });

        it("ExcluirImposto repassa show e callbacks", () => {
            const {u, f} = renderiza({ui: {showExcluirImposto: true}});
            expect(screen.getByTestId("excluir-imposto")).toHaveAttribute("data-show", "true");
            modais["excluir-imposto"].handleClose();
            expect(u.setShowExcluirImposto).toHaveBeenCalledWith(false);
            modais["excluir-imposto"].cancelarExclusaoImposto();
            expect(f.cancelarExclusaoImposto).toHaveBeenCalledWith(expect.any(Function));
        });
    });
});
