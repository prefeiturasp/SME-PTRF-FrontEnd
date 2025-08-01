import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CadastroFormFormik } from "../CadastroFormFormik";

// Mock dos serviços
jest.mock("../../../../../services/visoes.service");

import * as visoesService from "../../../../../services/visoes.service";

// Mock dos componentes
jest.mock("../../../../Globais/DatePickerField", () => ({
  DatePickerField: ({ value, onChange, onCalendarClose, ...props }) => (
    <input
      data-testid="date-picker"
      value={value}
      onChange={(e) => {
        onChange(props.name, e.target.value);
        if (onCalendarClose) {
          onCalendarClose();
        }
      }}
      {...props}
    />
  ),
}));

jest.mock("../../../../Globais/ReactNumberFormatInput", () => ({
  ReactNumberFormatInput: ({ value, onChangeEvent, ...props }) => (
    <input
      data-testid="currency-input"
      value={value}
      onChange={onChangeEvent}
      {...props}
    />
  ),
}));

jest.mock("../../../../../utils/ValidacoesAdicionaisFormularios", () => ({
  cpfMaskContitional: jest.fn().mockReturnValue([/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]),
  trataNumericos: jest.fn().mockReturnValue(100),
  calculaValorRecursoAcoes: jest.fn().mockReturnValue(100),
}));

jest.mock("react-text-mask", () => ({
  __esModule: true,
  default: ({ value, onChange, ...props }) => (
    <input
      data-testid="masked-input"
      value={value}
      onChange={onChange}
      {...props}
    />
  ),
}));

jest.mock("../../ComprovacaoFiscal", () => ({
  ComprovacaoFiscal: ({ formikProps, ...props }) => (
    <div data-testid="comprovacao-fiscal">
      <input
        data-testid="data-documento"
        value={formikProps.values.data_documento || ""}
        onChange={formikProps.handleChange}
        name="data_documento"
      />
    </div>
  ),
}));

jest.mock("../../Tags", () => ({
  Tags: ({ formikProps, ...props }) => (
    <div data-testid="tags">
      <input
        data-testid="tags-input"
        value={formikProps.values.tags || ""}
        onChange={formikProps.handleChange}
        name="tags"
      />
    </div>
  ),
}));

jest.mock("../CadastroFormCusteio", () => ({
  CadastroFormCusteio: ({ formikProps, ...props }) => (
    <div data-testid="cadastro-form-custeio">
      <input
        data-testid="custeio-input"
        value={formikProps.values.rateios?.[0]?.valor_original || ""}
        onChange={formikProps.handleChange}
        name="rateios[0].valor_original"
      />
    </div>
  ),
}));

jest.mock("../CadastroFormCapital", () => ({
  CadastroFormCapital: ({ formikProps, ...props }) => (
    <div data-testid="cadastro-form-capital">
      <input
        data-testid="capital-input"
        value={formikProps.values.rateios?.[0]?.valor_original || ""}
        onChange={formikProps.handleChange}
        name="rateios[0].valor_original"
      />
    </div>
  ),
}));

jest.mock("../CadastroFormDespesaImposto", () => ({
  CadastroFormDespesaImposto: ({ formikProps, ...props }) => (
    <div data-testid="cadastro-form-despesa-imposto">
      <input
        data-testid="imposto-input"
        value={formikProps.values.despesas_impostos?.[0]?.valor_original || ""}
        onChange={formikProps.handleChange}
        name="despesas_impostos[0].valor_original"
      />
    </div>
  ),
}));

jest.mock("../../RetemImposto", () => ({
  RetemImposto: ({ formikProps, ...props }) => (
    <div data-testid="retem-imposto">
      <input
        data-testid="retem-imposto-input"
        value={formikProps.values.retem_imposto || ""}
        onChange={formikProps.handleChange}
        name="retem_imposto"
      />
    </div>
  ),
}));

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, ...props }) => (
    <span data-testid="font-awesome-icon" {...props}>
      {icon.iconName}
    </span>
  ),
}));

jest.mock("@fortawesome/free-solid-svg-icons", () => ({
  faTimesCircle: { iconName: "times-circle" },
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(visoesService.visoesService, 'getPermissoes').mockReturnValue(true);
  jest.spyOn(visoesService.visoesService, 'featureFlagAtiva').mockReturnValue(true);
  
  // Mock localStorage
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(() => 'test-association-uuid'),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    },
    writable: true,
  });
});

const mockInitialValues = () => ({
  uuid: "test-uuid",
  numero_documento: "",
  data_documento: "",
  cpf_cnpj_fornecedor: "",
  nome_fornecedor: "",
  tipo_documento: null,
  tipo_transacao: null,
  valor_total: 0,
  valor_original: 0,
  status: "DRAFT",
  qtde_erros_form_despesa: 0,
  despesa_anterior_ao_uso_do_sistema_editavel: true,
  rateios: [
    {
      uuid: "rateio-uuid",
      aplicacao_recurso: "CUSTEIO",
      tipo_custeio: { id: 1, nome: "Tipo Custeio 1" },
      especificacao_material_servico: null,
      acao_associacao: null,
      conta_associacao: null,
      valor_original: 100,
      valor_rateio: 100,
    }
  ],
  despesas_impostos: [],
  tags: [],
  retem_imposto: false,
});

const mockDespesaContext = {
  verboHttp: "POST",
  uuid: "test-uuid",
};

const mockDespesasTabelas = {
  tipos_documento: [
    { id: 1, nome: "Nota Fiscal", documento_comprobatorio_de_despesa: true },
    { id: 2, nome: "Recibo", documento_comprobatorio_de_despesa: false },
  ],
  tipos_custeio: [
    { id: 1, nome: "Tipo Custeio 1" },
    { id: 2, nome: "Tipo Custeio 2" },
  ],
};

const renderComponent = (props = {}) => {
  const defaultProps = {
    initialValues: mockInitialValues,
    onSubmit: jest.fn(),
    validateFormDespesas: jest.fn(),
    despesaContext: mockDespesaContext,
    readOnlyCampos: false,
    setFormErrors: jest.fn(),
    validacoesPersonalizadas: jest.fn().mockResolvedValue({}),
    formErrors: {},
    despesasTabelas: mockDespesasTabelas,
    numeroDocumentoReadOnly: jest.fn().mockReturnValue(false),
    aux: {
      onHandleChangeApenasNumero: jest.fn(),
      documentoTransacaoObrigatorio: jest.fn(() => false),
      exibeDocumentoTransacao: jest.fn(),
      setaValorRealizado: jest.fn(),
      mostraBotaoDeletar: jest.fn(() => false),
      ehOperacaoExclusao: jest.fn(() => false),
      origemAnaliseLancamento: jest.fn(() => false),
      setaValoresCusteioCapital: jest.fn(),
      setValoresRateiosOriginal: jest.fn(),
      limpaTipoDespesaCusteio: jest.fn(),
      handleAvisoCapital: jest.fn(),
      onShowDeleteModal: jest.fn(),
    },
    setCssEscondeDocumentoTransacao: jest.fn(),
    setLabelDocumentoTransacao: jest.fn(),
    verbo_http: "POST",
    cssEscondeDocumentoTransacao: "",
    labelDocumentoTransacao: "",
    exibeMsgErroValorOriginal: jest.fn(),
    exibeMsgErroValorRecursos: jest.fn(),
    removeRateio: jest.fn(),
    setShowAvisoCapital: jest.fn(),
    especificacoes_custeio: [],
    especificaoes_capital: [],
    showDeletarRateioComEstorno: false,
    setShowDeletarRateioComEstorno: jest.fn(),
    houveAlteracoes: jest.fn(() => false),
    onShowModal: jest.fn(),
    onCancelarTrue: jest.fn(),
    readOnlyBtnAcao: false,
    setShowDelete: jest.fn(),
    setShowTextoModalDelete: jest.fn(),
    btnSubmitDisable: false,
    desabilitaBtnSalvar: jest.fn(),
    habilitaBtnSalvar: jest.fn(),
    saldosInsuficientesDaAcao: [],
    saldosInsuficientesDaConta: [],
    mensagensAceitaCusteioCapital: [],
    eh_despesa_com_comprovacao_fiscal: jest.fn().mockReturnValue(true),
    eh_despesa_reconhecida: jest.fn().mockReturnValue(false),
    limpa_campos_sem_comprovacao_fiscal: jest.fn(),
    showRetencaoImposto: false,
    eh_despesa_com_retencao_imposto: jest.fn().mockReturnValue(false),
    tipos_documento_com_recolhimento_imposto: jest.fn().mockReturnValue([]),
    numeroDocumentoImpostoReadOnly: jest.fn().mockReturnValue(false),
    preenche_tipo_despesa_custeio: jest.fn().mockReturnValue({ id: 1, nome: "Tipo Custeio 1" }),
    setCssEscondeDocumentoTransacaoImposto: jest.fn(),
    setLabelDocumentoTransacaoImposto: jest.fn(),
    cssEscondeDocumentoTransacaoImposto: "",
    labelDocumentoTransacaoImposto: "",
    acoes_custeio: jest.fn().mockReturnValue([]),
    setValorRateioRealizadoImposto: jest.fn(),
    readOnlyCamposImposto: [false],
    setShowExcluirImposto: jest.fn(),
    showExcluirImposto: false,
    cancelarExclusaoImposto: jest.fn(),
    mostraModalExcluirImposto: jest.fn(),
    listaDemotivosPagamentoAntecipado: [],
    selectMotivosPagamentoAntecipado: [],
    setSelectMotivosPagamentoAntecipado: jest.fn(),
    checkBoxOutrosMotivosPagamentoAntecipado: false,
    txtOutrosMotivosPagamentoAntecipado: "",
    handleChangeCheckBoxOutrosMotivosPagamentoAntecipado: jest.fn(),
    handleChangeTxtOutrosMotivosPagamentoAntecipado: jest.fn(),
    bloqueiaLinkCadastrarEstorno: jest.fn(() => false),
    bloqueiaRateioEstornado: jest.fn(() => false),
    modalState: {},
    setModalState: jest.fn(),
    serviceIniciaEncadeamentoDosModais: jest.fn(),
    serviceSubmitModais: jest.fn(),
    formErrorsImposto: {},
    disableBtnAdicionarImposto: false,
    onCalendarCloseDataPagamento: jest.fn(),
    onCalendarCloseDataPagamentoImposto: jest.fn(),
    parametroLocation: {},
    bloqueiaCamposDespesa: jest.fn(() => false),
    onCalendarCloseDataDoDocumento: jest.fn(),
    renderContaAssociacaoOptions: jest.fn(),
    filterContas: jest.fn(),
    limparSelecaoContasDesabilitadas: jest.fn(),
    veioDeSituacaoPatrimonial: false,
  };

  return render(
    <MemoryRouter>
      <CadastroFormFormik {...defaultProps} {...props} />
    </MemoryRouter>
  );
};

describe("Componente CadastroFormFormik", () => {
  it("deve renderizar o componente com formulário básico", () => {
    // Força o valor inicial do rateio para CUSTEIO
    const initialValuesWithCusteio = () => ({
      ...mockInitialValues(),
      rateios: [{
        ...mockInitialValues().rateios[0],
        aplicacao_recurso: "CUSTEIO"
      }],
    });
    renderComponent({ initialValues: initialValuesWithCusteio });
    expect(screen.getByTestId("comprovacao-fiscal")).toBeInTheDocument();
    expect(screen.getByTestId("cadastro-form-custeio")).toBeInTheDocument();
  });

  it("deve renderizar campos de fornecedor quando eh_despesa_com_comprovacao_fiscal retorna true", () => {
    renderComponent();
    
    expect(screen.getByLabelText("CNPJ ou CPF do fornecedor")).toBeInTheDocument();
    expect(screen.getByLabelText("Razão social do fornecedor")).toBeInTheDocument();
  });

  it("deve renderizar campo de tipo de documento", () => {
    renderComponent();
    const tipoDocumentoSelect = screen.getByLabelText("Tipo de documento");
    expect(tipoDocumentoSelect).toBeInTheDocument();
    // Verifica se a opção existe dentro do select correto
    const options = Array.from(tipoDocumentoSelect.options).map(o => o.textContent);
    expect(options).toContain("Selecione o tipo");
  });

  it("deve renderizar campo de data do documento", () => {
    renderComponent();
    expect(screen.getByLabelText("Data do documento")).toBeInTheDocument();
    const datePickers = screen.getAllByTestId("date-picker");
    expect(datePickers.length).toBeGreaterThan(0);
  });

  it("deve renderizar campo de número do documento", () => {
    renderComponent();
    
    const numeroDocumentoInput = screen.getByLabelText("Número do documento");
    expect(numeroDocumentoInput).toBeInTheDocument();
    expect(numeroDocumentoInput).toHaveValue("");
  });

  it("deve renderizar campo de valor total", () => {
    renderComponent();
    expect(screen.getByLabelText("Valor total do documento")).toBeInTheDocument();
    const currencyInputs = screen.getAllByTestId("currency-input");
    expect(currencyInputs.length).toBeGreaterThan(0);
  });

  it("deve renderizar componente de tags", () => {
    renderComponent();
    
    expect(screen.getByTestId("tags")).toBeInTheDocument();
  });

  it("deve renderizar componente de retenção de imposto quando showRetencaoImposto for true", () => {
    renderComponent({ showRetencaoImposto: true });
    
    expect(screen.getByTestId("retem-imposto")).toBeInTheDocument();
  });

  it("deve renderizar componente de capital quando especificaoes_capital tem itens", () => {
    const initialValuesWithCapital = () => ({
      ...mockInitialValues(),
      rateios: [{
        ...mockInitialValues().rateios[0],
        aplicacao_recurso: "CAPITAL"
      }],
    });
    renderComponent({ 
      initialValues: initialValuesWithCapital,
      especificaoes_capital: [{ id: 1, nome: "Especificação Capital" }] 
    });
    expect(screen.getByTestId("cadastro-form-capital")).toBeInTheDocument();
  });

  it("deve desabilitar campos quando readOnlyCampos for true", () => {
    renderComponent({ readOnlyCampos: true });
    
    const cpfInput = screen.getByLabelText("CNPJ ou CPF do fornecedor");
    const nomeInput = screen.getByLabelText("Razão social do fornecedor");
    
    expect(cpfInput).toBeDisabled();
    expect(nomeInput).toBeDisabled();
  });

  it("deve mostrar barra de status de erros quando há erros no formulário", () => {
    const initialValuesWithErrors = () => ({
      ...mockInitialValues(),
      qtde_erros_form_despesa: 5,
      status: "DRAFT",
    });
    
    renderComponent({ 
      initialValues: initialValuesWithErrors,
      despesaContext: { ...mockDespesaContext, verboHttp: "PUT" }
    });
    
    expect(screen.getByText(/O cadastro possui 5 campos não preenchidos/)).toBeInTheDocument();
  });

  it("não deve mostrar barra de status quando status for COMPLETO", () => {
    const initialValuesComplete = () => ({
      ...mockInitialValues(),
      status: "COMPLETO",
      qtde_erros_form_despesa: 5,
    });
    
    renderComponent({ 
      initialValues: initialValuesComplete,
      despesaContext: { ...mockDespesaContext, verboHttp: "PUT" }
    });
    
    expect(screen.queryByText(/O cadastro possui/)).not.toBeInTheDocument();
  });

  it("deve aplicar classe de erro quando formErrors contém erro", () => {
    renderComponent({ 
      formErrors: { cpf_cnpj_fornecedor: "CPF inválido" }
    });
    
    expect(screen.getByText("CPF inválido")).toBeInTheDocument();
  });

  it("deve chamar onSubmit quando formulário for submetido", async () => {
    const mockOnSubmit = jest.fn();
    const { container } = renderComponent({ onSubmit: mockOnSubmit });
    const form = container.querySelector("form");
    fireEvent.submit(form);
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it("deve chamar setFormErrors quando campo CPF/CNPJ perder foco", async () => {
    const mockSetFormErrors = jest.fn();
    const mockValidacoesPersonalizadas = jest.fn().mockResolvedValue({ cpf_cnpj_fornecedor: "Erro" });
    
    renderComponent({ 
      setFormErrors: mockSetFormErrors,
      validacoesPersonalizadas: mockValidacoesPersonalizadas
    });
    
    const cpfInput = screen.getByLabelText("CNPJ ou CPF do fornecedor");
    fireEvent.blur(cpfInput);
    
    await waitFor(() => {
      expect(mockValidacoesPersonalizadas).toHaveBeenCalled();
      expect(mockSetFormErrors).toHaveBeenCalled();
    });
  });

  it("deve limpar erro do CPF/CNPJ quando campo for clicado", () => {
    const mockSetFormErrors = jest.fn();
    renderComponent({ 
      setFormErrors: mockSetFormErrors,
      formErrors: { cpf_cnpj_fornecedor: "Erro" }
    });
    
    const cpfInput = screen.getByLabelText("CNPJ ou CPF do fornecedor");
    fireEvent.click(cpfInput);
    
    expect(mockSetFormErrors).toHaveBeenCalledWith({ cpf_cnpj_fornecedor: "" });
  });

  it("deve renderizar opções de tipo de documento corretamente", () => {
    renderComponent();
    const select = screen.getByLabelText("Tipo de documento");
    expect(select).toBeInTheDocument();
    const options = Array.from(select.options).map(o => o.textContent);
    expect(options).toContain("Selecione o tipo");
  });

  it("deve desabilitar campos quando despesa_anterior_ao_uso_do_sistema_editavel for false", () => {
    const initialValuesNotEditable = () => ({
      ...mockInitialValues(),
      despesa_anterior_ao_uso_do_sistema_editavel: false,
    });
    
    renderComponent({ initialValues: initialValuesNotEditable });
    
    const cpfInput = screen.getByLabelText("CNPJ ou CPF do fornecedor");
    const nomeInput = screen.getByLabelText("Razão social do fornecedor");
    
    expect(cpfInput).toBeDisabled();
    expect(nomeInput).toBeDisabled();
  });

  it("deve aplicar classe is_invalid quando há erro de validação", () => {
    const initialValuesWithError = () => ({
      ...mockInitialValues(),
      cpf_cnpj_fornecedor: "",
    });
    
    renderComponent({ 
      initialValues: initialValuesWithError,
      despesaContext: { ...mockDespesaContext, verboHttp: "PUT" }
    });
    
    const cpfInput = screen.getByLabelText("CNPJ ou CPF do fornecedor");
    expect(cpfInput).toHaveClass("is_invalid");
  });

  it("deve aplicar classe despesa_incompleta quando campo está vazio", () => {
    const initialValuesWithError = () => ({
      ...mockInitialValues(),
      cpf_cnpj_fornecedor: "",
    });
    
    renderComponent({ 
      initialValues: initialValuesWithError,
      despesaContext: { ...mockDespesaContext, verboHttp: "PUT" }
    });
    
    const cpfInput = screen.getByLabelText("CNPJ ou CPF do fornecedor");
    expect(cpfInput).toHaveClass("despesa_incompleta");
  });
}); 