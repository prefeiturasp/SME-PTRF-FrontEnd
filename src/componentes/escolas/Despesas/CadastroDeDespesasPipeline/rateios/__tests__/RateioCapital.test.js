import React from "react";
import {render, screen, fireEvent, configure} from "@testing-library/react";
import {Formik, useFormikContext} from "formik";
import {RateioCapital} from "../RateioCapital";
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
        />
    ),
}));
jest.mock("react-number-format", () => ({
    NumericFormat: (p) => (
        <input
            data-qa={p["data-qa"]}
            name={p.name}
            id={p.id}
            className={p.className}
            value={p.value ?? ""}
            disabled={p.disabled}
            onChange={p.onChange}
        />
    ),
}));
jest.mock("react-text-mask", () => (p) => (
    <input
        data-qa={p["data-qa"]}
        name={p.name}
        id={p.id}
        className={p.className}
        defaultValue={p.defaultValue}
        disabled={p.disabled}
        onChange={p.onChange}
        placeholder={p.placeholder}
    />
));

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
const pre = (i) => `cadastro-edicao-despesa-rateio-${i}-cadastro-capital`;

let formikRef;
const Capture = () => {
    formikRef = useFormikContext();
    return null;
};

const rateioBase = (extra = {}) => ({
    especificacao_material_servico: "",
    acao_associacao: "",
    conta_associacao: "",
    quantidade_itens_capital: "2",
    valor_item_capital: "5",
    valor_original: "10",
    valor_rateio: "10",
    numero_processo_incorporacao_capital: "",
    nao_exibir_em_rel_bens: false,
    ...extra,
});

const renderiza = ({rateio = rateioBase(), values = {}, tabelas = {}, ui = {}, disabled = false, errors = {}} = {}) => {
    const t = {
        despesasTabelas: {
            acoes_associacao: [
                {uuid: "a1", nome: "PTRF", e_recursos_proprios: false},
                {uuid: "a2", nome: "Próprios", e_recursos_proprios: true},
            ],
        },
        especificaoes_capital: [{id: 1, descricao: "Notebook", ativa: true}, {id: 2, descricao: "Mesa", ativa: false}],
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
    const initialValues = {data_transacao: "2026-03-01", mais_de_um_tipo_despesa: "sim", rateios: [rateio], ...values};
    const result = render(
        <Formik initialValues={initialValues} initialErrors={errors} onSubmit={jest.fn()}>
            <DespesaFormPipelineProvider tabelas={t} ui={u} fluxo={{}}>
                <Capture />
                <RateioCapital rateio={rateio} index={0} disabled={disabled} />
            </DespesaFormPipelineProvider>
        </Formik>
    );
    return {t, u, ...result};
};

const flush = () => new Promise((r) => setTimeout(r, 0));

describe("RateioCapital", () => {
    beforeEach(() => visoesService.getPermissoes.mockReturnValue(true));

    it("renderiza campos e opções", () => {
        renderiza();
        expect(qa(`${pre(0)}-especificacao-material-option-1`)).toHaveTextContent("Notebook");
        expect(qa(`${pre(0)}-especificacao-material-option-2`)).toHaveClass("esconde-especificacao-material-servico");
        expect(qa(`${pre(0)}-acao-option-1`)).toHaveTextContent("PTRF");
        expect(qaAusente(`${pre(0)}-acao-option-2`)).not.toBeInTheDocument();
        expect(qa(`${pre(0)}-quantidade-de-itens`)).toHaveValue("2");
        expect(qa(`${pre(0)}-valor`)).toBeDisabled();
        expect(screen.getByRole("option", {name: "Conta 1"})).toBeInTheDocument();
        expect(screen.getByLabelText("Valor total do capital")).toBeInTheDocument();
    });

    it("trata null e objetos nos selects", () => {
        const a = renderiza({rateio: rateioBase({especificacao_material_servico: null, acao_associacao: null, conta_associacao: null})});
        expect(qa(`${pre(0)}-acao`)).toHaveValue("");
        a.unmount();
        renderiza({rateio: rateioBase({
            especificacao_material_servico: {id: 1}, acao_associacao: {uuid: "a1"}, conta_associacao: {uuid: "c1"},
        })});
        expect(qa(`${pre(0)}-especificacao-material`)).toHaveValue("1");
        expect(qa(`${pre(0)}-acao`)).toHaveValue("a1");
        expect(qa(`${pre(0)}-tipo-conta`)).toHaveValue("c1");
    });

    it("sem comprovação fiscal desabilita especificação", () => {
        renderiza({ui: {eh_despesa_com_comprovacao_fiscal: jest.fn(() => false)}});
        expect(qa(`${pre(0)}-especificacao-material`)).toBeDisabled();
        expect(qa(`${pre(0)}-especificacao-material`).className).toBe("form-control");
    });

    it("desabilita campos com disabled, estorno e sem permissão", () => {
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

    it("conta desabilitada sem data e erro quando não há contas", () => {
        const a = renderiza({values: {data_transacao: ""}});
        expect(qa(`${pre(0)}-tipo-conta`)).toBeDisabled();
        a.unmount();
        renderiza({tabelas: {filterContas: jest.fn(() => [])}});
        expect(qa("cadastro-edicao-despesa-rateio-0-cadastro-custeio-erro-conta-associacao")).toBeInTheDocument();
    });

    it("aplica classes de inválido em PUT para valores vazios", () => {
        renderiza({rateio: rateioBase({
            quantidade_itens_capital: "0", valor_item_capital: "0", valor_rateio: "0", valor_original: "0",
            conta_associacao: "",
        })});
        expect(qa(`${pre(0)}-quantidade-de-itens`).className).toMatch(/is_invalid/);
        expect(qa(`${pre(0)}-valor-unitario`).className).toMatch(/despesa_incompleta/);
        expect(qa(`${pre(0)}-valor-realizado`).className).toMatch(/input-valor-realizado-vazio/);
        expect(qa(`${pre(0)}-valor`).className).toMatch(/is_invalid/);
    });

    it("alterar quantidade zera valor unitário quando não há mais de um tipo (valor do rateio usa o unitário anterior)", async () => {
        renderiza({values: {mais_de_um_tipo_despesa: "nao"}});
        fireEvent.change(qa(`${pre(0)}-quantidade-de-itens`), {
            target: {name: "rateios[0].quantidade_itens_capital", value: "3"},
        });
        await flush();
        expect(formikRef.values.rateios[0].valor_item_capital).toBe(0);
        // handleChangeData lê rateio.valor_item_capital ainda não atualizado (5): 3 * 5
        expect(formikRef.values.rateios[0].valor_rateio).toBe(15);
        expect(formikRef.values.rateios[0].valor_original).toBe(15);
    });

    it("alterar quantidade para 1 não zera valor unitário", async () => {
        renderiza({values: {mais_de_um_tipo_despesa: "nao"}});
        fireEvent.change(qa(`${pre(0)}-quantidade-de-itens`), {
            target: {name: "rateios[0].quantidade_itens_capital", value: "1"},
        });
        await flush();
        expect(formikRef.values.rateios[0].valor_item_capital).toBe("5");
        expect(formikRef.values.rateios[0].valor_rateio).toBe(5);
    });

    it("alterar valor unitário recalcula valor do rateio", async () => {
        renderiza();
        fireEvent.change(qa(`${pre(0)}-valor-unitario`), {
            target: {name: "rateios[0].valor_item_capital", value: "7,50"},
        });
        await flush();
        expect(formikRef.values.rateios[0].valor_rateio).toBe(15);
        expect(formikRef.values.rateios[0].valor_original).toBe(15);
    });

    it("alterar valor realizado e selects", async () => {
        renderiza();
        fireEvent.change(qa(`${pre(0)}-valor-realizado`), {target: {name: "rateios[0].valor_rateio", value: "9"}});
        fireEvent.change(qa(`${pre(0)}-acao`), {target: {name: "rateios[0].acao_associacao", value: "a1"}});
        fireEvent.change(qa(`${pre(0)}-especificacao-material`), {target: {name: "rateios[0].especificacao_material_servico", value: "1"}});
        fireEvent.change(qa(`${pre(0)}-tipo-conta`), {target: {name: "rateios[0].conta_associacao", value: "c1"}});
        fireEvent.change(qa(`${pre(0)}-numero-do-processo-incorporacao`), {target: {name: "rateios[0].numero_processo_incorporacao_capital", value: "1"}});
        await flush();
        expect(formikRef.values.rateios[0].valor_rateio).toBe("9");
        expect(formikRef.values.rateios[0].acao_associacao).toBe("a1");
        expect(formikRef.values.rateios[0].especificacao_material_servico).toBe("1");
        expect(formikRef.values.rateios[0].conta_associacao).toBe("c1");
    });

    it("checkbox 'não exibir na relação de bens' atualiza o rateio", async () => {
        renderiza();
        const checkbox = screen.getByRole("checkbox");
        fireEvent.click(checkbox);
        await flush();
        expect(formikRef.values.rateios[0].nao_exibir_em_rel_bens).toBe(true);
    });

    it("processo de incorporação fica desabilitado quando não exibir em relação de bens", () => {
        renderiza({rateio: rateioBase({nao_exibir_em_rel_bens: true})});
        expect(qa(`${pre(0)}-numero-do-processo-incorporacao`)).toBeDisabled();
    });

    it("rótulos mudam com retenção de imposto", () => {
        renderiza({ui: {eh_despesa_com_retencao_imposto: jest.fn(() => true)}});
        expect(screen.getByLabelText("Valor líquido total do capital")).toBeInTheDocument();
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
