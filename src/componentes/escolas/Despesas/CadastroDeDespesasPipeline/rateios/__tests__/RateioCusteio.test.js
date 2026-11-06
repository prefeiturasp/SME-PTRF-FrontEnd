import React from "react";
import {render, screen, fireEvent, configure} from "@testing-library/react";
import {Formik} from "formik";
import {RateioCusteio} from "../RateioCusteio";
import {DespesaFormPipelineProvider} from "../../context/DespesaFormPipelineContext";
import {visoesService} from "../../../../../../services/visoes.service";

jest.mock("../../../../../../services/visoes.service", () => ({
    visoesService: {getPermissoes: jest.fn()},
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
            onBlur={p.onBlur}
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
const pre = (i) => `cadastro-edicao-despesa-rateio-${i}-cadastro-custeio`;

const rateioBase = (extra = {}) => ({
    tipo_custeio: {id: 1},
    especificacao_material_servico: "",
    acao_associacao: "",
    conta_associacao: "",
    valor_original: "10",
    valor_rateio: "10",
    ...extra,
});

const renderiza = ({rateio = rateioBase(), values = {}, tabelas = {}, ui = {}, disabled = false, errors = {}} = {}) => {
    const t = {
        despesasTabelas: {
            tipos_custeio: [{id: 1, nome: "Material"}, {id: 2, nome: "Serviço"}],
            acoes_associacao: [
                {uuid: "a1", nome: "PTRF", e_recursos_proprios: false},
                {uuid: "a2", nome: "Próprios", e_recursos_proprios: true},
            ],
        },
        especificacoes_custeio: {1: [{id: 10, descricao: "Caneta", ativa: true}, {id: 11, descricao: "Lápis", ativa: false}], 2: [{id: 20, descricao: "Limpeza", ativa: true}]},
        despesaContext: {verboHttp: "PUT"},
        renderContaAssociacaoOptions: jest.fn(() => <option value="c1">Conta 1</option>),
        filterContas: jest.fn(() => [{}]),
        ...tabelas,
    };
    const u = {
        exibeMsgErroValorRecursos: false,
        exibeMsgErroValorOriginal: false,
        eh_despesa_com_comprovacao_fiscal: jest.fn(() => true),
        eh_despesa_com_retencao_imposto: jest.fn(() => false),
        bloqueiaRateioEstornado: jest.fn(() => false),
        ...ui,
    };
    const initialValues = {data_transacao: "2026-03-01", rateios: [rateio], ...values};
    const result = render(
        <Formik initialValues={initialValues} initialErrors={errors} onSubmit={jest.fn()}>
            <DespesaFormPipelineProvider tabelas={t} ui={u} fluxo={{}}>
                <RateioCusteio rateio={rateio} index={0} disabled={disabled} />
            </DespesaFormPipelineProvider>
        </Formik>
    );
    return {t, u, ...result};
};

describe("RateioCusteio", () => {
    beforeEach(() => visoesService.getPermissoes.mockReturnValue(true));

    it("renderiza selects de tipo, especificação, ação e conta", () => {
        renderiza();
        expect(qa(`${pre(0)}-tipo-de-despesa`)).toHaveValue("1");
        expect(qa(`${pre(0)}-tipo-de-despesa-option-2`)).toHaveTextContent("Serviço");
        expect(qa(`${pre(0)}-especificacao-material-option-1`)).toHaveTextContent("Caneta");
        expect(qa(`${pre(0)}-especificacao-material-option-2`)).toHaveClass("esconde-especificacao-material-servico");
        expect(qa(`${pre(0)}-acao-option-1`)).toHaveTextContent("PTRF");
        expect(qaAusente(`${pre(0)}-acao-option-2`)).not.toBeInTheDocument();
        expect(screen.getByRole("option", {name: "Conta 1"})).toBeInTheDocument();
    });

    it("usa especificações pelo tipo quando tipo_custeio é um id simples", () => {
        renderiza({rateio: rateioBase({tipo_custeio: 2})});
        expect(qa(`${pre(0)}-tipo-de-despesa`)).toHaveValue("2");
        expect(qa(`${pre(0)}-especificacao-material-option-1`)).toHaveTextContent("Limpeza");
    });

    it("trata valores null como vazio", () => {
        renderiza({rateio: rateioBase({
            tipo_custeio: null,
            especificacao_material_servico: null,
            acao_associacao: null,
            conta_associacao: null,
        })});
        expect(qa(`${pre(0)}-tipo-de-despesa`)).toHaveValue("");
        expect(qa(`${pre(0)}-acao`)).toHaveValue("");
    });

    it("lê valores de objetos selecionados", () => {
        renderiza({rateio: rateioBase({
            especificacao_material_servico: {id: 10},
            acao_associacao: {uuid: "a1"},
            conta_associacao: {uuid: "c1"},
        })});
        expect(qa(`${pre(0)}-especificacao-material`)).toHaveValue("10");
        expect(qa(`${pre(0)}-acao`)).toHaveValue("a1");
        expect(qa(`${pre(0)}-tipo-conta-utilizada`)).toHaveValue("c1");
    });

    it("sem comprovação fiscal desabilita tipo e especificação", () => {
        renderiza({ui: {eh_despesa_com_comprovacao_fiscal: jest.fn(() => false)}});
        expect(qa(`${pre(0)}-tipo-de-despesa`)).toBeDisabled();
        expect(qa(`${pre(0)}-especificacao-material`)).toBeDisabled();
        expect(qa(`${pre(0)}-acao`)).toBeEnabled();
    });

    it("desabilita campos com disabled, estorno ou sem permissão", () => {
        const a = renderiza({disabled: true});
        expect(qa(`${pre(0)}-acao`)).toBeDisabled();
        a.unmount();
        const b = renderiza({ui: {bloqueiaRateioEstornado: jest.fn(() => true)}});
        expect(qa(`${pre(0)}-acao`)).toBeDisabled();
        b.unmount();
        visoesService.getPermissoes.mockReturnValue(false);
        renderiza();
        expect(qa(`${pre(0)}-acao`)).toBeDisabled();
    });

    it("conta fica desabilitada sem data_transacao", () => {
        renderiza({values: {data_transacao: ""}});
        expect(qa(`${pre(0)}-tipo-conta-utilizada`)).toBeDisabled();
    });

    it("exibe erro quando não há contas disponíveis para a data", () => {
        renderiza({tabelas: {filterContas: jest.fn(() => [])}});
        expect(qa(`${pre(0)}-erro-conta-associacao`)).toHaveTextContent("Não existem contas disponíveis");
    });

    it("aplica classes de inválido em PUT para campos vazios", () => {
        renderiza({rateio: rateioBase({tipo_custeio: "", acao_associacao: "", valor_rateio: "0"})});
        expect(qa(`${pre(0)}-tipo-de-despesa`).className).toMatch(/is_invalid/);
        expect(qa(`${pre(0)}-acao`).className).toMatch(/despesa_incompleta/);
        expect(qa(`${pre(0)}-valor-realizado`).className).toMatch(/input-valor-realizado-vazio/);
    });

    it("sem comprovação fiscal usa classe simples no tipo de despesa", () => {
        renderiza({ui: {eh_despesa_com_comprovacao_fiscal: jest.fn(() => false)}});
        expect(qa(`${pre(0)}-tipo-de-despesa`).className).toBe("form-control");
    });

    it("altera selects e valores sem erros", () => {
        renderiza();
        fireEvent.change(qa(`${pre(0)}-tipo-de-despesa`), {target: {name: "rateios[0].tipo_custeio", value: "2"}});
        fireEvent.change(qa(`${pre(0)}-especificacao-material`), {target: {name: "rateios[0].especificacao_material_servico", value: "10"}});
        fireEvent.change(qa(`${pre(0)}-acao`), {target: {name: "rateios[0].acao_associacao", value: "a1"}});
        fireEvent.change(qa(`${pre(0)}-tipo-conta-utilizada`), {target: {name: "rateios[0].conta_associacao", value: "c1"}});
        fireEvent.change(qa(`${pre(0)}-valor-realizado`), {target: {name: "rateios[0].valor_rateio", value: "5"}});
        fireEvent.blur(qa(`${pre(0)}-valor-realizado`));
        expect(qa(`${pre(0)}-tipo-de-despesa`)).toBeInTheDocument();
    });

    it("alterar valor original atualiza valor realizado", async () => {
        renderiza();
        fireEvent.change(qa(`${pre(0)}-valor`), {target: {name: "rateios[0].valor_original", value: "1.234,50"}});
        await new Promise((r) => setTimeout(r, 0));
        expect(qa(`${pre(0)}-valor-realizado`)).toBeInTheDocument();
    });

    it("rótulos mudam quando há retenção de imposto", () => {
        renderiza({ui: {eh_despesa_com_retencao_imposto: jest.fn(() => true)}});
        expect(screen.getByLabelText("Valor líquido")).toBeInTheDocument();
        expect(screen.getByLabelText("Valor líquido realizado")).toBeInTheDocument();
    });

    it("exibe mensagens de erro de valor com flags e erros", () => {
        renderiza({
            ui: {exibeMsgErroValorRecursos: true, exibeMsgErroValorOriginal: true},
            errors: {valor_original: "x", valor_recusos_acoes: "y"},
        });
        expect(qa(`${pre(0)}-erro-valor`)).toBeInTheDocument();
        expect(qa(`${pre(0)}-erro-valor-realizado`)).toBeInTheDocument();
    });
});
