import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CadastroFormCapital } from "../CadastroFormCapital";
import { MemoryRouter } from "react-router-dom";

// Mock dos serviços
jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn().mockReturnValue(true),
  },
}));

// Mock dos componentes
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

jest.mock("react-number-format", () => ({
  __esModule: true,
  default: ({ value, onChange, ...props }) => (
    <input
      data-testid="number-format-input"
      value={value}
      onChange={onChange}
      {...props}
    />
  ),
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

jest.mock("../../../../../utils/ValidacoesAdicionaisFormularios", () => ({
  calculaValorRateio: jest.fn().mockReturnValue(100),
  trataNumericos: jest.fn().mockReturnValue(100),
  processoIncorporacaoMask: jest.fn().mockReturnValue([]),
}));

const mockFormikProps = {
  values: {
    mais_de_um_tipo_despesa: 'nao',
    data_transacao: '2024-01-01',
  },
  handleChange: jest.fn(),
  setFieldValue: jest.fn(),
};

const mockRateio = {
  especificacao_material_servico: null,
  acao_associacao: null,
  quantidade_itens_capital: 1,
  valor_item_capital: 100,
  nao_exibir_em_rel_bens: false,
  numero_processo_incorporacao_capital: '',
  conta_associacao: null,
  valor_original: 100,
  valor_rateio: 100,
};

const mockDespesasTabelas = {
  acoes_associacao: [
    { uuid: '1', nome: 'Ação 1', e_recursos_proprios: false },
    { uuid: '2', nome: 'Ação 2', e_recursos_proprios: false },
  ],
};

const mockEspecificacoesCapital = [
  { id: 1, descricao: 'Especificação 1', ativa: true },
  { id: 2, descricao: 'Especificação 2', ativa: false },
];

const renderComponent = (props = {}) => {
  const defaultProps = {
    formikProps: mockFormikProps,
    rateio: mockRateio,
    index: 0,
    despesasTabelas: mockDespesasTabelas,
    especificaoes_capital: mockEspecificacoesCapital,
    verboHttp: "POST",
    disabled: false,
    errors: {},
    exibeMsgErroValorRecursos: false,
    exibeMsgErroValorOriginal: false,
    eh_despesa_com_comprovacao_fiscal: jest.fn().mockReturnValue(true),
    eh_despesa_com_retencao_imposto: jest.fn().mockReturnValue(false),
    bloqueiaRateioEstornado: jest.fn().mockReturnValue(false),
    renderContaAssociacaoOptions: jest.fn().mockReturnValue([]),
    filterContas: jest.fn().mockReturnValue([]),
    ...props,
  };

  return render(
    <MemoryRouter>
      <CadastroFormCapital {...defaultProps} />
    </MemoryRouter>
  );
};

describe("Componente CadastroFormCapital", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o componente com todos os campos", () => {
    renderComponent();
    
    expect(screen.getByLabelText("Especificação do bem, material ou serviço")).toBeInTheDocument();
    expect(screen.getByLabelText("Ação")).toBeInTheDocument();
    expect(screen.getByTestId("number-format-input")).toBeInTheDocument();
    expect(screen.getAllByTestId("currency-input")[0]).toBeInTheDocument();
    expect(screen.getByText("Não exibir na relação de bens")).toBeInTheDocument();
    expect(screen.getByLabelText("Número do processo de incorporação")).toBeInTheDocument();
    expect(screen.getByLabelText("Tipo de conta")).toBeInTheDocument();
    expect(screen.getByLabelText("Valor total do capital")).toBeInTheDocument();
    expect(screen.getByLabelText("Valor realizado")).toBeInTheDocument();
  });

  it("deve renderizar as opções de especificação de material", () => {
    renderComponent();
    
    const select = screen.getByLabelText("Especificação do bem, material ou serviço");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("");
  });

  it("deve renderizar as opções de ação", () => {
    renderComponent();
    
    const select = screen.getByLabelText("Ação");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("");
  });

  it("deve renderizar o campo de quantidade de itens", () => {
    renderComponent();
    
    const input = screen.getByTestId("number-format-input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("1");
  });

  it("deve renderizar o campo de valor unitário", () => {
    renderComponent();
    
    const inputs = screen.getAllByTestId("currency-input");
    const valorUnitarioInput = inputs[0]; // Primeiro currency input é o valor unitário
    expect(valorUnitarioInput).toBeInTheDocument();
    expect(valorUnitarioInput).toHaveValue("100");
  });

  it("deve renderizar o checkbox de não exibir em relatório de bens", () => {
    renderComponent();
    
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it("deve renderizar o campo de número do processo de incorporação", () => {
    renderComponent();
    
    const input = screen.getByTestId("masked-input");
    expect(input).toBeInTheDocument();
  });

  it("deve renderizar o campo de tipo de conta", () => {
    renderComponent();
    
    const select = screen.getByLabelText("Tipo de conta");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("");
  });

  it("deve renderizar o campo de valor total do capital", () => {
    renderComponent();
    
    const inputs = screen.getAllByTestId("currency-input");
    expect(inputs[1]).toBeInTheDocument(); // Segundo currency input
  });

  it("deve renderizar o campo de valor realizado", () => {
    renderComponent();
    
    const inputs = screen.getAllByTestId("currency-input");
    expect(inputs[2]).toBeInTheDocument(); // Terceiro currency input
  });

  it("deve desabilitar campos quando disabled for true", () => {
    renderComponent({ disabled: true });
    
    const select = screen.getByLabelText("Especificação do bem, material ou serviço");
    expect(select).toBeDisabled();
  });

  it("deve mostrar erro quando verboHttp for PUT e campos obrigatórios estiverem vazios", () => {
    renderComponent({ 
      verboHttp: "PUT",
      rateio: { ...mockRateio, especificacao_material_servico: null }
    });
    
    const select = screen.getByLabelText("Especificação do bem, material ou serviço");
    expect(select).toHaveClass("is_invalid");
  });

  it("deve mostrar label correto para valor total quando há retenção de imposto", () => {
    renderComponent({ 
      eh_despesa_com_retencao_imposto: jest.fn().mockReturnValue(true)
    });
    
    expect(screen.getByLabelText("Valor líquido total do capital")).toBeInTheDocument();
  });

  it("deve mostrar label correto para valor realizado quando há retenção de imposto", () => {
    renderComponent({ 
      eh_despesa_com_retencao_imposto: jest.fn().mockReturnValue(true)
    });
    
    expect(screen.getByLabelText("Valor líquido realizado")).toBeInTheDocument();
  });

  it("deve mostrar mensagem de erro quando não há contas disponíveis", () => {
    renderComponent({ 
      filterContas: jest.fn().mockReturnValue([])
    });
    
    expect(screen.getByText("Não existem contas disponíveis para a data do pagamento")).toBeInTheDocument();
  });

  it("deve mostrar erro de valor original quando exibeMsgErroValorOriginal for true", () => {
    renderComponent({ 
      exibeMsgErroValorOriginal: true,
      errors: { valor_original: true }
    });
    
    expect(screen.getByText("A soma dos valores originais do rateio não está correspondendo ao valor total original utilizado com recursos do Programa.")).toBeInTheDocument();
  });

  it("deve mostrar erro de valor realizado quando exibeMsgErroValorRecursos for true", () => {
    renderComponent({ 
      exibeMsgErroValorRecursos: true,
      errors: { valor_recusos_acoes: true }
    });
    
    expect(screen.getByText("A soma dos valores do rateio não está correspondendo ao valor total utilizado com recursos do Programa.")).toBeInTheDocument();
  });
}); 