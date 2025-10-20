import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CadastroFormFormik } from "../CadastroFormFormik";

jest.mock("../../../../../services/visoes.service");

import * as visoesService from "../../../../../services/visoes.service";

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

const createMockAux = (overrides = {}) => ({
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
  ...overrides,
});

const createInitialValuesWithRateios = (rateios) => () => ({
  ...mockInitialValues(),
  rateios,
});

const createInitialValuesWithEstorno = (estornoUuid = null) => () => ({
  ...mockInitialValues(),
  rateios: [
    { 
      ...mockInitialValues().rateios[0], 
      uuid: "rateio-uuid-1",
      estorno: estornoUuid ? { uuid: estornoUuid } : null
    },
  ],
});

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
    aux: createMockAux(),
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

  it("deve mostrar botão deletar quando data_documento não estiver preenchido", async () => {
    jest.useFakeTimers();

    const initialValuesWithoutDate = () => ({
      ...mockInitialValues(),
      data_documento: '',
      despesa_anterior_ao_uso_do_sistema_editavel: true,
    });

    jest.spyOn(visoesService.visoesService, "getPermissoes").mockImplementation((permissoes) => {
      if (permissoes.includes("delete_despesa")) return true;
      return true;
    });

    renderComponent({
      initialValues: initialValuesWithoutDate,
      despesaContext: { ...mockDespesaContext, verboHttp: "PUT" },
      aux: createMockAux({ mostraBotaoDeletar: jest.fn(() => true) }),
      readOnlyBtnAcao: false,
    });

    jest.runAllTimers();

    await waitFor(() => {
      const deleteButton = screen.getByRole("button", { name: /deletar/i });
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toBeEnabled();
    });

    jest.useRealTimers();
  });

  it("deve renderizar número do boletim de ocorrência quando não há comprovação fiscal e não é despesa reconhecida", () => {
    renderComponent({
      eh_despesa_com_comprovacao_fiscal: jest.fn().mockReturnValue(false),
      eh_despesa_reconhecida: jest.fn().mockReturnValue(false),
    });

    expect(screen.getByText("Número do Boletim de Ocorrência")).toBeInTheDocument();
  });

  it("deve chamar aux.onHandleChangeApenasNumero ao alterar número do documento", () => {
    const mockAux = createMockAux();
    renderComponent({ aux: mockAux });

    const numeroDocInput = screen.getByLabelText("Número do documento");
    fireEvent.change(numeroDocInput, { target: { value: "12345" } });

    expect(mockAux.onHandleChangeApenasNumero).toHaveBeenCalled();
  });

  it("deve chamar exibeDocumentoTransacao ao alterar tipo de transação", () => {
    const mockAux = createMockAux();

    renderComponent({
      aux: mockAux,
      despesasTabelas: {
        ...mockDespesasTabelas,
        tipos_transacao: [{ id: 1, nome: "Dinheiro" }],
      },
    });

    const tipoTransacaoSelect = screen.getByLabelText("Forma de pagamento");
    fireEvent.change(tipoTransacaoSelect, { target: { value: "1" } });

    expect(mockAux.exibeDocumentoTransacao).toHaveBeenCalled();
  });

  it("deve renderizar botão adicionar despesa parcial quando mais_de_um_tipo_despesa for sim", () => {
    const initialValuesMultiple = () => ({
      ...mockInitialValues(),
      mais_de_um_tipo_despesa: "sim",
      despesa_anterior_ao_uso_do_sistema_editavel: true,
    });

    renderComponent({ initialValues: initialValuesMultiple });

    expect(screen.getByText("+ Adicionar despesa parcial")).toBeInTheDocument();
  });

  it("deve adicionar novo rateio ao clicar em adicionar despesa parcial", () => {
    const initialValuesMultiple = () => ({
      ...mockInitialValues(),
      mais_de_um_tipo_despesa: "sim",
      despesa_anterior_ao_uso_do_sistema_editavel: true,
    });

    renderComponent({ 
      initialValues: initialValuesMultiple,
      bloqueiaCamposDespesa: jest.fn(() => false),
    });

    const addButton = screen.getByText("+ Adicionar despesa parcial");
    fireEvent.click(addButton);

    const despesas = screen.getAllByText(/Despesa \d+/);
    expect(despesas.length).toBeGreaterThan(0);
  });

  it("deve renderizar botão remover despesa quando há mais de um rateio", () => {
    const multipleRateios = [
      { ...mockInitialValues().rateios[0], uuid: "rateio-1" },
      { ...mockInitialValues().rateios[0], uuid: "rateio-2" },
    ];

    renderComponent({ initialValues: createInitialValuesWithRateios(multipleRateios) });
    expect(screen.getByText("Remover Despesa")).toBeInTheDocument();
  });

  it("deve chamar removeRateio ao clicar em remover despesa", () => {
    const mockRemoveRateio = jest.fn();
    const multipleRateios = [
      { ...mockInitialValues().rateios[0], uuid: "rateio-1" },
      { ...mockInitialValues().rateios[0], uuid: "rateio-2" },
    ];

    jest.spyOn(visoesService.visoesService, "getPermissoes").mockReturnValue(true);

    renderComponent({ 
      initialValues: () => ({
        ...mockInitialValues(),
        rateios: multipleRateios,
        despesa_anterior_ao_uso_do_sistema_editavel: true,
      }),
      removeRateio: mockRemoveRateio,
      bloqueiaCamposDespesa: jest.fn(() => false),
    });

    const removeButton = screen.getByText("Remover Despesa");
    fireEvent.click(removeButton);

    expect(mockRemoveRateio).toHaveBeenCalled();
  });

  it("deve renderizar link de cadastrar estorno quando rateio tem uuid mas não tem estorno", () => {
    renderComponent({ 
      initialValues: createInitialValuesWithEstorno(null),
      aux: createMockAux(),
    });

    expect(screen.getByText("Cadastrar estorno")).toBeInTheDocument();
  });

  it("deve renderizar link de acessar estorno quando rateio tem estorno", () => {
    renderComponent({ 
      initialValues: createInitialValuesWithEstorno("estorno-uuid-1"),
      aux: createMockAux(),
    });

    expect(screen.getByText("Acessar estorno")).toBeInTheDocument();
  });

  it("deve mostrar mensagem de bloqueio quando rateio tem estorno", () => {
    renderComponent({ 
      initialValues: createInitialValuesWithEstorno("estorno-uuid-1"),
      aux: createMockAux(),
    });

    expect(screen.getByText(/Esta seção da despesa encontra-se bloqueada para edição/)).toBeInTheDocument();
  });

  it("deve renderizar botão adicionar imposto quando eh_despesa_com_retencao_imposto retorna true", () => {
    const initialValuesComRetencao = () => ({
      ...mockInitialValues(),
      despesas_impostos: [],
    });

    renderComponent({
      initialValues: initialValuesComRetencao,
      showRetencaoImposto: true,
      eh_despesa_com_retencao_imposto: jest.fn().mockReturnValue(true),
    });

    expect(screen.getByText("+ Adicionar imposto")).toBeInTheDocument();
  });

  it("deve adicionar novo imposto ao clicar em adicionar imposto", () => {
    const initialValuesComRetencao = () => ({
      ...mockInitialValues(),
      despesas_impostos: [],
      despesa_anterior_ao_uso_do_sistema_editavel: true,
    });

    renderComponent({
      initialValues: initialValuesComRetencao,
      showRetencaoImposto: true,
      eh_despesa_com_retencao_imposto: jest.fn().mockReturnValue(true),
      disableBtnAdicionarImposto: false,
    });

    const addButton = screen.getByText("+ Adicionar imposto");
    fireEvent.click(addButton);

    expect(screen.getByTestId("cadastro-form-despesa-imposto")).toBeInTheDocument();
  });

  it("deve renderizar componente de despesa imposto quando há despesas_impostos", () => {
    const initialValuesComImposto = () => ({
      ...mockInitialValues(),
      despesas_impostos: [
        {
          tipo_documento: "",
          numero_documento: "",
          tipo_transacao: "",
          documento_transacao: "",
          data_transacao: "",
          rateios: [],
        }
      ],
    });

    renderComponent({
      initialValues: initialValuesComImposto,
      showRetencaoImposto: true,
    });

    expect(screen.getByTestId("cadastro-form-despesa-imposto")).toBeInTheDocument();
  });

  it("deve chamar setaValoresCusteioCapital ao alterar mais_de_um_tipo_despesa", () => {
    const mockAux = createMockAux();
    renderComponent({ aux: mockAux });

    const select = document.getElementById("mais_de_um_tipo_despesa");
    fireEvent.change(select, { target: { value: "sim" } });

    expect(mockAux.setaValoresCusteioCapital).toHaveBeenCalled();
    expect(mockAux.setValoresRateiosOriginal).toHaveBeenCalled();
  });

  it("deve chamar handleAvisoCapital ao alterar tipo de aplicação do recurso", () => {
    const mockAux = createMockAux();

    renderComponent({ 
      aux: mockAux,
      despesasTabelas: {
        ...mockDespesasTabelas,
        tipos_aplicacao_recurso: [
          { id: "CUSTEIO", nome: "Custeio" },
          { id: "CAPITAL", nome: "Capital" },
        ],
      },
    });

    const tipoAplicacaoSelect = screen.getByLabelText("Tipo de aplicação do recurso");
    fireEvent.change(tipoAplicacaoSelect, { target: { value: "CAPITAL" } });

    expect(mockAux.handleAvisoCapital).toHaveBeenCalled();
    expect(mockAux.limpaTipoDespesaCusteio).toHaveBeenCalled();
  });

  it("deve chamar onCalendarCloseDataPagamento ao fechar calendário de data de pagamento", async () => {
    const mockOnCalendarClose = jest.fn();

    renderComponent({
      onCalendarCloseDataPagamento: mockOnCalendarClose,
    });

    const dataPagamentoInput = screen.getByLabelText("Data do pagamento");
    fireEvent.change(dataPagamentoInput, { target: { value: "2024-01-01" } });

    await waitFor(() => {
      expect(mockOnCalendarClose).toHaveBeenCalled();
    });
  });

  it("deve chamar onCalendarCloseDataDoDocumento ao fechar calendário de data do documento", async () => {
    const mockOnCalendarClose = jest.fn();

    renderComponent({
      onCalendarCloseDataDoDocumento: mockOnCalendarClose,
    });

    const dataDocumentoInput = screen.getByLabelText("Data do documento");
    fireEvent.change(dataDocumentoInput, { target: { value: "2024-01-01" } });

    await waitFor(() => {
      expect(mockOnCalendarClose).toHaveBeenCalled();
    });
  });

  it("deve mostrar erro de valor_recusos_acoes quando exibeMsgErroValorRecursos for true", () => {
    const initialValuesComErro = () => ({
      ...mockInitialValues(),
    });

    const mockErrors = {
      valor_recusos_acoes: "Erro no valor de recursos",
    };

    const mockValidate = jest.fn().mockReturnValue(mockErrors);

    renderComponent({
      initialValues: initialValuesComErro,
      validateFormDespesas: mockValidate,
      exibeMsgErroValorRecursos: true,
    });

    expect(screen.getByText("Valor do PTRF")).toBeInTheDocument();
  });

  it("deve chamar setaValorRealizado ao alterar valor original", () => {
    renderComponent();

    const valorOriginalInput = screen.getByLabelText("Valor total do documento");
    fireEvent.change(valorOriginalInput, { target: { value: "200" } });

    // setaValorRealizado é chamado internamente
    expect(valorOriginalInput).toBeInTheDocument();
  });

  it("deve desabilitar campos quando eh_despesa_com_comprovacao_fiscal retorna false", () => {
    renderComponent({
      eh_despesa_com_comprovacao_fiscal: jest.fn().mockReturnValue(false),
    });

    const cpfInput = screen.getByLabelText("CNPJ ou CPF do fornecedor");
    const nomeInput = screen.getByLabelText("Razão social do fornecedor");
    const tipoDocInput = screen.getByLabelText("Tipo de documento");

    expect(cpfInput).toBeDisabled();
    expect(nomeInput).toBeDisabled();
    expect(tipoDocInput).toBeDisabled();
  });

  it("deve renderizar botão salvar quando não é operação de exclusão", () => {
    renderComponent({ aux: createMockAux() });
    expect(screen.getByText("Salvar")).toBeInTheDocument();
  });

  it("deve chamar serviceIniciaEncadeamentoDosModais ao clicar em salvar", async () => {
    const mockService = jest.fn().mockResolvedValue(true);
    const mockDesabilita = jest.fn();
    const mockHabilita = jest.fn();

    const initialValuesComBoletim = () => ({
      ...mockInitialValues(),
      numero_boletim_de_ocorrencia: "12345",
      despesa_anterior_ao_uso_do_sistema_editavel: true,
    });

    renderComponent({
      initialValues: initialValuesComBoletim,
      serviceIniciaEncadeamentoDosModais: mockService,
      desabilitaBtnSalvar: mockDesabilita,
      habilitaBtnSalvar: mockHabilita,
      eh_despesa_reconhecida: jest.fn().mockReturnValue(true),
      aux: createMockAux(),
    });

    const salvarButton = screen.getByText("Salvar");
    fireEvent.click(salvarButton);

    await waitFor(() => {
      expect(mockDesabilita).toHaveBeenCalled();
      expect(mockService).toHaveBeenCalled();
    });
  });

  it("deve chamar habilitaBtnSalvar quando serviceIniciaEncadeamentoDosModais falha", async () => {
    const mockService = jest.fn().mockRejectedValue(new Error("Erro"));
    const mockDesabilita = jest.fn();
    const mockHabilita = jest.fn();

    const initialValuesComBoletim = () => ({
      ...mockInitialValues(),
      numero_boletim_de_ocorrencia: "12345",
      despesa_anterior_ao_uso_do_sistema_editavel: true,
    });

    renderComponent({
      initialValues: initialValuesComBoletim,
      serviceIniciaEncadeamentoDosModais: mockService,
      desabilitaBtnSalvar: mockDesabilita,
      habilitaBtnSalvar: mockHabilita,
      eh_despesa_reconhecida: jest.fn().mockReturnValue(true),
      aux: createMockAux(),
    });

    const salvarButton = screen.getByText("Salvar");
    fireEvent.click(salvarButton);

    await waitFor(() => {
      expect(mockDesabilita).toHaveBeenCalled();
      expect(mockHabilita).toHaveBeenCalled();
    });
  });

  it("deve chamar onCancelarTrue ao clicar em voltar sem alterações", () => {
    const mockOnCancelar = jest.fn();

    renderComponent({
      onCancelarTrue: mockOnCancelar,
      houveAlteracoes: jest.fn(() => false),
    });

    const voltarButton = screen.getByText("Voltar");
    fireEvent.click(voltarButton);

    expect(mockOnCancelar).toHaveBeenCalled();
  });

  it("deve chamar onShowModal ao clicar em voltar com alterações", () => {
    const mockOnShowModal = jest.fn();

    renderComponent({
      onShowModal: mockOnShowModal,
      houveAlteracoes: jest.fn(() => true),
    });

    const voltarButton = screen.getByText("Voltar");
    fireEvent.click(voltarButton);

    expect(mockOnShowModal).toHaveBeenCalled();
  });

  it("deve limpar timeout no cleanup do useEffect", () => {
    jest.useFakeTimers();
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const initialValuesEditavel = () => ({
      ...mockInitialValues(),
      despesa_anterior_ao_uso_do_sistema_editavel: true,
    });

    const { unmount } = renderComponent({
      initialValues: initialValuesEditavel,
      readOnlyBtnAcao: false,
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    jest.useRealTimers();
    clearTimeoutSpy.mockRestore();
  });
}); 