import React from "react";
import {render, screen, fireEvent, waitFor, configure} from "@testing-library/react";
import {Formik} from "formik";
import {DocumentoSection} from "../DocumentoSection";
import {DespesaFormPipelineProvider} from "../../context/DespesaFormPipelineContext";
import {visoesService} from "../../../../../../services/visoes.service";

jest.mock("../../../../../../services/visoes.service", () => ({
    visoesService: {getPermissoes: jest.fn(), featureFlagAtiva: jest.fn()},
}));
jest.mock("../../../ComprovacaoFiscal", () => ({
    ComprovacaoFiscal: (p) => <div data-testid="comprovacao-fiscal" data-disabled={String(p.disabled)} />,
}));
jest.mock("react-text-mask", () => (p) => (
    <input
        data-testid="masked"
        id={p.id}
        name={p.name}
        disabled={p.disabled}
        value={p.value || ""}
        onChange={p.onChange}
        onBlur={p.onBlur}
        onClick={p.onClick}
        placeholder={p.placeholder}
    />
));
jest.mock("../../../../../Globais/DatePickerField", () => ({
    DatePickerField: (p) => (
        <div data-testid={`date-${p.name}`} data-disabled={String(p.disabled)}>
            <button type="button" data-testid={`date-change-${p.name}`} onClick={() => p.onChange(p.name, "2026-03-10")} />
            <button type="button" data-testid={`date-close-${p.name}`} onClick={p.onCalendarClose} />
        </div>
    ),
}));
jest.mock("../../../../../Globais/ReactNumberFormatInput", () => ({
    ReactNumberFormatInput: (p) => (
        <input
            data-testid={`currency-${p.name}`}
            name={p.name}
            id={p.id}
            value={p.value ?? ""}
            readOnly={p.readOnly}
            disabled={p.disabled}
            onChange={(e) => p.onChangeEvent(e)}
        />
    ),
}));

const initial = (extra = {}) => ({
    cpf_cnpj_fornecedor: "",
    nome_fornecedor: "",
    tipo_documento: {id: 1},
    data_documento: "2026-03-01",
    data_transacao: "2026-03-02",
    numero_documento: "",
    tipo_transacao: {id: 2},
    documento_transacao: "",
    valor_original: "100,00",
    valor_total: "100,00",
    valor_recursos_proprios: "10,00",
    valor_recusos_acoes: "90,00",
    numero_boletim_de_ocorrencia: "",
    despesa_anterior_ao_uso_do_sistema_editavel: true,
    ...extra,
});

const renderiza = ({values = initial(), tabelas = {}, ui = {}, fluxo = {}} = {}) => {
    const t = {
        despesaContext: {verboHttp: "POST"},
        despesasTabelas: {
            tipos_documento: [
                {id: 1, nome: "NF", pode_reter_imposto: false, documento_comprobatorio_de_despesa: true},
                {id: 2, nome: "Recibo", pode_reter_imposto: true, documento_comprobatorio_de_despesa: false},
            ],
            tipos_transacao: [{id: 2, nome: "Cheque"}],
        },
        aux: {
            onHandleChangeApenasNumero: jest.fn(),
            exibeDocumentoTransacao: jest.fn(),
            documentoTransacaoObrigatorio: jest.fn(() => false),
        },
        verbo_http: "POST",
        limparSelecaoContasDesabilitadas: jest.fn(),
        ...tabelas,
    };
    const u = {
        readOnlyCampos: false,
        setFormErrors: jest.fn(),
        formErrors: {},
        numeroDocumentoReadOnly: false,
        setCssEscondeDocumentoTransacao: jest.fn(),
        setLabelDocumentoTransacao: jest.fn(),
        cssEscondeDocumentoTransacao: "",
        labelDocumentoTransacao: "cheque",
        exibeMsgErroValorOriginal: false,
        exibeMsgErroValorRecursos: false,
        eh_despesa_com_comprovacao_fiscal: jest.fn(() => true),
        eh_despesa_reconhecida: jest.fn(() => true),
        limpa_campos_sem_comprovacao_fiscal: jest.fn(),
        ...ui,
    };
    const f = {
        validacoesPersonalizadas: jest.fn(async () => ({})),
        onCalendarCloseDataPagamento: jest.fn(),
        onCalendarCloseDataDoDocumento: jest.fn(),
        ...fluxo,
    };
    const utils = render(
        <Formik initialValues={values} onSubmit={jest.fn()} initialErrors={{}}>
            <DespesaFormPipelineProvider tabelas={t} ui={u} fluxo={f}>
                <DocumentoSection />
            </DespesaFormPipelineProvider>
        </Formik>
    );
    return {t, u, f, ...utils};
};

describe("DocumentoSection", () => {
    beforeEach(() => {
        visoesService.getPermissoes.mockReturnValue(true);
        visoesService.featureFlagAtiva.mockReturnValue(false);
    });

    it("renderiza os campos principais", () => {
        renderiza();
        expect(screen.getByTestId("comprovacao-fiscal")).toBeInTheDocument();
        expect(screen.getByLabelText("CNPJ ou CPF do fornecedor")).toBeEnabled();
        expect(screen.getByLabelText("Razão social do fornecedor")).toBeEnabled();
        expect(screen.getByLabelText("Tipo de documento")).toHaveValue("1");
        expect(screen.getByLabelText("Forma de pagamento")).toHaveValue("2");
        expect(screen.getByText("Valor do recurso próprio")).toBeInTheDocument();
        expect(screen.getByText("Valor do PTRF")).toBeInTheDocument();
        expect(screen.queryByLabelText(/Boletim de/)).not.toBeInTheDocument();
    });

    it("usa rótulos da feature flag PREMIO_EXCELENCIA", () => {
        visoesService.featureFlagAtiva.mockReturnValue(true);
        renderiza();
        expect(screen.getByText("Valor de outros recursos")).toBeInTheDocument();
        expect(screen.getByText("Valor do recurso selecionado")).toBeInTheDocument();
    });

    it("exibe select com valor vazio quando tipos são null", () => {
        renderiza({values: initial({tipo_documento: null, tipo_transacao: null})});
        expect(screen.getByLabelText("Tipo de documento")).toHaveValue("");
        expect(screen.getByLabelText("Forma de pagamento")).toHaveValue("");
    });

    it("desabilita campos sem permissão, em modo somente leitura ou sem comprovação fiscal", () => {
        visoesService.getPermissoes.mockReturnValue(false);
        renderiza();
        expect(screen.getByLabelText("Razão social do fornecedor")).toBeDisabled();
        expect(screen.getByLabelText("Forma de pagamento")).toBeDisabled();
        expect(screen.getByTestId("date-data_transacao")).toHaveAttribute("data-disabled", "true");
    });

    it("desabilita campos de fornecedor quando não há comprovação fiscal", () => {
        renderiza({ui: {eh_despesa_com_comprovacao_fiscal: jest.fn(() => false)}});
        expect(screen.getByLabelText("Razão social do fornecedor")).toBeDisabled();
        expect(screen.getByLabelText("Tipo de documento")).toBeDisabled();
        expect(screen.getByLabelText("Forma de pagamento")).toBeEnabled();
    });

    it("desabilita número do documento quando numeroDocumentoReadOnly", () => {
        renderiza({ui: {numeroDocumentoReadOnly: true}});
        expect(screen.getByLabelText("Número do documento")).toBeDisabled();
    });

    it("desabilita campos com readOnlyCampos e quando despesa não é editável", () => {
        renderiza({ui: {readOnlyCampos: true}});
        expect(screen.getByLabelText("Razão social do fornecedor")).toBeDisabled();
    });

    it("aplica classes de despesa incompleta/inválida em PUT", () => {
        renderiza({
            values: initial({nome_fornecedor: "", valor_total: "0,00"}),
            tabelas: {despesaContext: {verboHttp: "PUT"}, verbo_http: "PUT"},
        });
        expect(screen.getByLabelText("Razão social do fornecedor").className).toMatch(/is_invalid/);
        expect(screen.getByLabelText("Razão social do fornecedor").className).toMatch(/despesa_incompleta/);
    });

    it("onChange do tipo de documento desmarca retem_imposto quando não pode reter", () => {
        renderiza({values: initial({retem_imposto: true})});
        const select = screen.getByLabelText("Tipo de documento");
        fireEvent.change(select, {target: {value: "1"}});
        fireEvent.change(select, {target: {value: "2"}});
        expect(select).toBeInTheDocument();
    });

    it("onChange da forma de pagamento chama exibeDocumentoTransacao", () => {
        const {t, u} = renderiza();
        fireEvent.change(screen.getByLabelText("Forma de pagamento"), {target: {value: "2"}});
        expect(t.aux.exibeDocumentoTransacao).toHaveBeenCalledWith("2", u.setCssEscondeDocumentoTransacao, u.setLabelDocumentoTransacao, t.despesasTabelas);
    });

    it("número do documento usa onHandleChangeApenasNumero", () => {
        const {t} = renderiza();
        fireEvent.change(screen.getByLabelText("Número do documento"), {target: {value: "12"}});
        expect(t.aux.onHandleChangeApenasNumero).toHaveBeenCalledWith(expect.anything(), expect.any(Function), "numero_documento");
    });

    it("CNPJ: click limpa erro e blur valida", async () => {
        const {u, f} = renderiza();
        const input = screen.getByLabelText("CNPJ ou CPF do fornecedor");
        fireEvent.click(input);
        expect(u.setFormErrors).toHaveBeenCalledWith({cpf_cnpj_fornecedor: ""});
        fireEvent.blur(input);
        await waitFor(() => expect(u.setFormErrors).toHaveBeenCalledWith({}));
        expect(f.validacoesPersonalizadas).toHaveBeenCalled();
    });

    it("blur do CNPJ ignora resposta nula da validação", async () => {
        const {u, f} = renderiza({fluxo: {validacoesPersonalizadas: jest.fn(async () => null)}});
        u.setFormErrors.mockClear();
        fireEvent.blur(screen.getByLabelText("CNPJ ou CPF do fornecedor"));
        await waitFor(() => expect(f.validacoesPersonalizadas).toHaveBeenCalled());
        expect(u.setFormErrors).not.toHaveBeenCalled();
    });

    it("exibe erros de formErrors", () => {
        renderiza({ui: {formErrors: {
            cpf_cnpj_fornecedor: "CPF inválido",
            data_documento: "erro doc",
            data_transacao: "erro trans",
        }}});
        expect(screen.getByText("CPF inválido")).toBeInTheDocument();
        expect(screen.getByText("erro doc")).toBeInTheDocument();
        expect(screen.getByText("erro trans")).toBeInTheDocument();
    });

    it("exibe mensagens de erro de valor quando há erros do Formik e flags habilitadas", async () => {
        render(
            <Formik
                initialValues={initial()}
                initialErrors={{valor_original: "x", valor_recusos_acoes: "y"}}
                onSubmit={jest.fn()}
            >
                <DespesaFormPipelineProvider
                    tabelas={{despesaContext: {verboHttp: "POST"}, despesasTabelas: {tipos_documento: [], tipos_transacao: []}, aux: {documentoTransacaoObrigatorio: jest.fn()}, limparSelecaoContasDesabilitadas: jest.fn()}}
                    ui={{formErrors: {}, exibeMsgErroValorOriginal: true, exibeMsgErroValorRecursos: true, eh_despesa_com_comprovacao_fiscal: () => true, eh_despesa_reconhecida: () => true, setFormErrors: jest.fn()}}
                    fluxo={{validacoesPersonalizadas: jest.fn()}}
                >
                    <DocumentoSection />
                </DespesaFormPipelineProvider>
            </Formik>
        );
        expect(screen.getByText(/A soma dos valores originais do rateio/)).toBeInTheDocument();
        expect(screen.getByText(/A soma dos valores do rateio/)).toBeInTheDocument();
    });

    it("data do documento: fechar calendário chama callback do fluxo", async () => {
        const {f} = renderiza();
        fireEvent.click(screen.getByTestId("date-close-data_documento"));
        await waitFor(() => expect(f.onCalendarCloseDataDoDocumento).toHaveBeenCalledWith(
            expect.objectContaining({data_documento: "2026-03-01"}), expect.any(Function), "data_documento"
        ));
    });

    it("data do pagamento: alterar e fechar valida, limpa contas e dispara callback", async () => {
        const {t, u, f} = renderiza();
        fireEvent.click(screen.getByTestId("date-change-data_transacao"));
        fireEvent.click(screen.getByTestId("date-close-data_transacao"));
        await waitFor(() => expect(f.onCalendarCloseDataPagamento).toHaveBeenCalled());
        const valores = f.onCalendarCloseDataPagamento.mock.calls[0][0];
        expect(valores.data_transacao).toBe("2026-03-10");
        expect(t.limparSelecaoContasDesabilitadas).toHaveBeenCalledWith(expect.any(Function), valores);
        expect(f.validacoesPersonalizadas).toHaveBeenCalledWith(valores, expect.any(Function), "despesa_principal");
        expect(u.setFormErrors).toHaveBeenCalledWith({});
    });

    it("data do pagamento: não define erros quando validação retorna null", async () => {
        const {u, f} = renderiza({fluxo: {validacoesPersonalizadas: jest.fn(async () => null)}});
        fireEvent.click(screen.getByTestId("date-close-data_transacao"));
        await waitFor(() => expect(f.onCalendarCloseDataPagamento).toHaveBeenCalled());
        expect(u.setFormErrors).not.toHaveBeenCalled();
    });

    it("exibe boletim de ocorrência quando não há comprovação fiscal e despesa não reconhecida", async () => {
        const {t, u, f} = renderiza({ui: {
            eh_despesa_com_comprovacao_fiscal: jest.fn(() => false),
            eh_despesa_reconhecida: jest.fn(() => false),
            formErrors: {numero_boletim_de_ocorrencia: "obrigatório"},
        }});
        configure({testIdAttribute: "data-qa"});
        const input = screen.getByTestId("cadastro-edicao-despesa-numero-boletim-de-ocorrencia");
        configure({testIdAttribute: "data-testid"});
        fireEvent.change(input, {target: {value: "55"}});
        expect(t.aux.onHandleChangeApenasNumero).toHaveBeenCalledWith(expect.anything(), expect.any(Function), "numero_boletim_de_ocorrencia");
        fireEvent.click(input);
        expect(u.setFormErrors).toHaveBeenCalledWith({numero_boletim_de_ocorrencia: ""});
        fireEvent.blur(input);
        await waitFor(() => expect(f.validacoesPersonalizadas).toHaveBeenCalled());
        expect(screen.getByText("obrigatório")).toBeInTheDocument();
    });

    it("alterar valor original sincroniza valor realizado", () => {
        renderiza();
        fireEvent.change(screen.getByTestId("currency-valor_original"), {target: {name: "valor_original", value: "200,00"}});
        expect(screen.getByTestId("currency-valor_original")).toBeInTheDocument();
    });

    it("valor do PTRF é calculado e somente leitura", () => {
        renderiza();
        const ptrf = screen.getByTestId("currency-valor_recusos_acoes");
        expect(ptrf).toHaveAttribute("readonly");
        expect(ptrf).toHaveValue("90");
    });
});
