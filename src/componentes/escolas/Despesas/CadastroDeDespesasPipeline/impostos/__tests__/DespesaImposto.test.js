import React from "react";
import {render, screen, fireEvent, configure} from "@testing-library/react";
import {Formik} from "formik";
import {DespesaImposto} from "../DespesaImposto";
import {DespesaFormPipelineProvider} from "../../context/DespesaFormPipelineContext";
import {visoesService} from "../../../../../../services/visoes.service";

jest.mock("../../../../../../services/visoes.service", () => ({
    visoesService: {getPermissoes: jest.fn()},
}));
jest.mock("@fortawesome/react-fontawesome", () => ({FontAwesomeIcon: () => <span />}));
jest.mock("@fortawesome/free-solid-svg-icons", () => ({faTimesCircle: {}}));
jest.mock("../../../../../Globais/DatePickerField", () => ({
    DatePickerField: (p) => (
        <div data-qa={p.dataQa} data-disabled={String(p.disabled)}>
            <button type="button" data-testid="date-change" onClick={() => p.onChange(p.name, "2026-04-01")} />
            <button type="button" data-testid="date-close" onClick={p.onCalendarClose} />
        </div>
    ),
}));
jest.mock("../../../../../Globais/ReactNumberFormatInput", () => ({
    ReactNumberFormatInput: (p) => (
        <input
            data-qa={p["data-qa"]}
            name={p.name}
            id={p.id}
            className={p.className}
            value={p.value ?? ""}
            disabled={p.disabled}
            onChange={(e) => p.onChangeEvent(e)}
        />
    ),
}));

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
const pre = (i) => `cadastro-edicao-despesa-imposto-${i}`;

const impostoBase = (extra = {}, rateioExtra = {}) => ({
    tipo_documento: "",
    numero_documento: "",
    tipo_transacao: "",
    documento_transacao: "",
    data_transacao: "2026-03-20",
    rateios: [{
        tipo_custeio: {id: 1},
        especificacao_material_servico: "",
        acao_associacao: "",
        conta_associacao: "",
        valor_original: "10",
        valor_rateio: "10",
        ...rateioExtra,
    }],
    ...extra,
});

const renderiza = ({imposto = impostoBase(), index = 0, tabelas = {}, ui = {}, fluxo = {}, disabled = false, remove = jest.fn()} = {}) => {
    const t = {
        tipos_documento_com_recolhimento_imposto: jest.fn(() => [{id: 5, nome: "DARF"}]),
        numeroDocumentoImpostoReadOnly: jest.fn(() => false),
        aux: {onHandleChangeApenasNumero: jest.fn(), exibeDocumentoTransacaoImposto: jest.fn()},
        preenche_tipo_despesa_custeio: jest.fn(() => ({id: 1, nome: "Material"})),
        especificacoes_custeio: {1: [{id: 10, descricao: "Imposto A", ativa: true}, {id: 11, descricao: "Imposto B", ativa: false}]},
        despesasTabelas: {tipos_transacao: [{id: 2, nome: "Cheque"}]},
        despesaContext: {verboHttp: "PUT"},
        acoes_custeio: jest.fn(() => [{uuid: "a1", nome: "PTRF"}]),
        renderContaAssociacaoOptions: jest.fn(() => <option value="c1">Conta 1</option>),
        filterContas: jest.fn(() => [{}]),
        limparSelecaoContasDesabilitadas: jest.fn(),
        ...tabelas,
    };
    const u = {
        eh_despesa_com_retencao_imposto: jest.fn(() => true),
        cssEscondeDocumentoTransacaoImposto: {0: ""},
        labelDocumentoTransacaoImposto: {0: "cheque"},
        setCssEscondeDocumentoTransacaoImposto: jest.fn(),
        setLabelDocumentoTransacaoImposto: jest.fn(),
        readOnlyCamposImposto: {},
        formErrorsImposto: {},
        ...ui,
    };
    const f = {
        setValorRateioRealizadoImposto: jest.fn(),
        onCalendarCloseDataPagamentoImposto: jest.fn(),
        ...fluxo,
    };
    const result = render(
        <Formik initialValues={{data_transacao: "2026-03-01", despesas_impostos: [imposto]}} onSubmit={jest.fn()}>
            <DespesaFormPipelineProvider tabelas={t} ui={u} fluxo={f}>
                <DespesaImposto disabled={disabled} index={index} despesa_imposto={imposto} remove={remove} />
            </DespesaFormPipelineProvider>
        </Formik>
    );
    return {t, u, f, remove, ...result};
};

describe("DespesaImposto", () => {
    beforeEach(() => visoesService.getPermissoes.mockImplementation(() => true));

    it("não renderiza o formulário sem retenção de imposto", () => {
        renderiza({ui: {eh_despesa_com_retencao_imposto: jest.fn(() => false)}});
        expect(screen.queryByText(/Imposto retido/)).not.toBeInTheDocument();
    });

    it("renderiza título e campos", () => {
        renderiza();
        expect(screen.getByText("Imposto retido 1")).toBeInTheDocument();
        expect(qa(`${pre(0)}-tipo-documento-option-1`)).toHaveTextContent("DARF");
        expect(qa(`${pre(0)}-tipo-de-despesa`)).toBeDisabled();
        expect(qa(`${pre(0)}-especificacao-do-imposto-option-0`)).toHaveTextContent("Selecione uma especificação");
        expect(qa(`${pre(0)}-forma-de-pagamento-option-1`)).toHaveTextContent("Cheque");
        expect(qa(`${pre(0)}-acao-option-1`)).toHaveTextContent("PTRF");
        expect(screen.getByRole("option", {name: "Conta 1"})).toBeInTheDocument();
        expect(qaAusente(`${pre(0)}-btn-remover`)).not.toBeInTheDocument();
    });

    it("lista especificações pelo id quando tipo_custeio é simples", () => {
        renderiza({imposto: impostoBase({}, {tipo_custeio: 1})});
        expect(qa(`${pre(0)}-especificacao-do-imposto-option-1`)).toHaveTextContent("Imposto A");
        expect(qa(`${pre(0)}-especificacao-do-imposto-option-2`)).toHaveClass("esconde-especificacao-material-servico");
    });

    it("trata campos null", () => {
        renderiza({imposto: impostoBase({
            tipo_documento: null, numero_documento: null, tipo_transacao: null, data_transacao: null,
        }, {
            especificacao_material_servico: null, acao_associacao: null, conta_associacao: null,
        })});
        expect(qa(`${pre(0)}-tipo-documento`)).toHaveValue("");
        expect(qa(`${pre(0)}-numero-do-documento`)).toHaveValue("");
        expect(qa(`${pre(0)}-forma-de-pagamento`)).toHaveValue("");
        expect(qa(`${pre(0)}-tipo-de-conta`)).toBeDisabled();
    });

    it("lê valores de objetos", () => {
        renderiza({imposto: impostoBase({}, {
            tipo_custeio: 1, especificacao_material_servico: {id: 10}, acao_associacao: {uuid: "a1"}, conta_associacao: {uuid: "c1"},
        })});
        expect(qa(`${pre(0)}-especificacao-do-imposto`)).toHaveValue("10");
        expect(qa(`${pre(0)}-acao`)).toHaveValue("a1");
        expect(qa(`${pre(0)}-tipo-de-conta`)).toHaveValue("c1");
    });

    describe("remoção", () => {
        it("exibe botão remover a partir do segundo imposto e chama remove(index)", () => {
            const {remove} = renderiza({index: 1});
            const btn = qa(`${pre(1)}-btn-remover`);
            expect(screen.getByText("Imposto retido 2")).toBeInTheDocument();
            fireEvent.click(btn);
            expect(remove).toHaveBeenCalledWith(1);
        });

        it("desabilita remover sem permissão de deletar, disabled ou readOnly", () => {
            visoesService.getPermissoes.mockImplementation((p) => !(p && p[0] === "delete_despesa"));
            const a = renderiza({index: 1});
            expect(qa(`${pre(1)}-btn-remover`)).toBeDisabled();
            a.unmount();
            visoesService.getPermissoes.mockImplementation(() => true);
            renderiza({index: 1, ui: {readOnlyCamposImposto: {1: true}}});
            expect(qa(`${pre(1)}-btn-remover`)).toBeDisabled();
            expect(qa(`${pre(1)}-btn-remover`)).toHaveClass("desabilita-link-remover-despesa");
        });
    });

    describe("estado desabilitado", () => {
        it("desabilita campos com disabled", () => {
            renderiza({disabled: true});
            expect(qa(`${pre(0)}-tipo-documento`)).toBeDisabled();
            expect(qa(`${pre(0)}-valor-do-imposto`)).toBeDisabled();
        });

        it("readOnlyCamposImposto desabilita campos de texto/seleção mas não os valores", () => {
            renderiza({ui: {readOnlyCamposImposto: {0: true}}});
            expect(qa(`${pre(0)}-tipo-documento`)).toBeDisabled();
            expect(qa(`${pre(0)}-valor-do-imposto`)).toBeEnabled();
        });

        it("número do documento fica read only conforme função de apoio", () => {
            renderiza({tabelas: {numeroDocumentoImpostoReadOnly: jest.fn(() => true)}});
            expect(qa(`${pre(0)}-numero-do-documento`)).toBeDisabled();
            expect(qa(`${pre(0)}-numero-do-documento`)).toHaveAttribute("placeholder", "");
        });

        it("sem permissão desabilita tudo", () => {
            visoesService.getPermissoes.mockImplementation(() => false);
            renderiza();
            expect(qa(`${pre(0)}-acao`)).toBeDisabled();
        });
    });

    describe("interações", () => {
        it("número do documento usa onHandleChangeApenasNumero", () => {
            const {t} = renderiza();
            fireEvent.change(qa(`${pre(0)}-numero-do-documento`), {target: {value: "1"}});
            expect(t.aux.onHandleChangeApenasNumero).toHaveBeenCalledWith(expect.anything(), expect.any(Function), "despesas_impostos[0].numero_documento");
        });

        it("forma de pagamento chama exibeDocumentoTransacaoImposto", () => {
            const {t, u} = renderiza();
            fireEvent.change(qa(`${pre(0)}-forma-de-pagamento`), {
                target: {name: "despesas_impostos[0].tipo_transacao", value: "2"},
            });
            expect(t.aux.exibeDocumentoTransacaoImposto).toHaveBeenCalledWith(
                "2", u.setLabelDocumentoTransacaoImposto, u.labelDocumentoTransacaoImposto,
                u.setCssEscondeDocumentoTransacaoImposto, u.cssEscondeDocumentoTransacaoImposto, t.despesasTabelas, 0
            );
        });

        it("valor do imposto aciona setValorRateioRealizadoImposto", () => {
            const {f} = renderiza();
            fireEvent.change(qa(`${pre(0)}-valor-do-imposto`), {
                target: {name: "despesas_impostos[0].rateios[0].valor_original", value: "20"},
            });
            expect(f.setValorRateioRealizadoImposto).toHaveBeenCalledWith(expect.any(Function), "20", 0);
        });

        it("altera demais selects e inputs", () => {
            renderiza();
            fireEvent.change(qa(`${pre(0)}-tipo-documento`), {target: {name: "despesas_impostos[0].tipo_documento", value: "5"}});
            fireEvent.change(qa(`${pre(0)}-especificacao-do-imposto`), {target: {name: "despesas_impostos[0].rateios[0].especificacao_material_servico", value: "10"}});
            fireEvent.change(qa(`${pre(0)}-acao`), {target: {name: "despesas_impostos[0].rateios[0].acao_associacao", value: "a1"}});
            fireEvent.change(qa(`${pre(0)}-tipo-de-conta`), {target: {name: "despesas_impostos[0].rateios[0].conta_associacao", value: "c1"}});
            fireEvent.change(qa(`${pre(0)}-numero-do-documento-de-transacao`), {target: {name: "despesas_impostos[0].documento_transacao", value: "9"}});
            fireEvent.change(qa(`${pre(0)}-valor-realizado-do-imposto`), {target: {name: "despesas_impostos[0].rateios[0].valor_rateio", value: "3"}});
            fireEvent.blur(qa(`${pre(0)}-valor-realizado-do-imposto`));
            expect(qa(`${pre(0)}-valor-realizado-do-imposto`)).toBeInTheDocument();
        });

        it("data do pagamento: alterar e fechar calendário", () => {
            const {t, f} = renderiza();
            fireEvent.click(screen.getByTestId("date-change"));
            fireEvent.click(screen.getByTestId("date-close"));
            expect(t.limparSelecaoContasDesabilitadas).toHaveBeenCalledWith(expect.any(Function), expect.any(Object), true);
            expect(f.onCalendarCloseDataPagamentoImposto).toHaveBeenCalledWith(expect.any(Object), expect.any(Function), 0);
        });
    });

    describe("mensagens e estilos", () => {
        it("exibe erro da data do imposto", () => {
            renderiza({ui: {formErrorsImposto: {0: {despesa_imposto_data_transacao: "Data inválida"}}}});
            expect(screen.getByText("Data inválida")).toBeInTheDocument();
        });

        it("exibe aviso quando não há contas para a data", () => {
            renderiza({tabelas: {filterContas: jest.fn(() => [])}});
            expect(screen.getByText("Não existem contas disponíveis para a data do pagamento")).toBeInTheDocument();
        });

        it("valor realizado zerado em PUT é inválido", () => {
            renderiza({imposto: impostoBase({}, {valor_rateio: "0"})});
            const el = qa(`${pre(0)}-valor-realizado-do-imposto`);
            expect(el.className).toMatch(/is_invalid/);
            expect(el.className).toMatch(/input-valor-realizado-vazio/);
        });

        it("valor realizado preenchido", () => {
            renderiza();
            expect(qa(`${pre(0)}-valor-realizado-do-imposto`).className).toMatch(/input-valor-realizado-preenchido/);
        });

        it("esconde documento de transação conforme css do imposto", () => {
            renderiza({ui: {cssEscondeDocumentoTransacaoImposto: {0: "escondeItem"}}});
            expect(qa(`${pre(0)}-numero-do-documento-de-transacao`).parentElement).toHaveClass("escondeItem");
        });
    });
});
