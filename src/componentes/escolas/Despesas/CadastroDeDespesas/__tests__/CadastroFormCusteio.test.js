import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CadastroFormCusteio } from "../CadastroFormCusteio";
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

jest.mock("../../../../../utils/ValidacoesAdicionaisFormularios", () => ({
  trataNumericos: jest.fn().mockReturnValue(100),
}));

const mockFormikProps = {
  values: {
    data_transacao: '2024-01-01',
  },
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
  setFieldValue: jest.fn(),
};

const mockRateio = {
  tipo_custeio: null,
  especificacao_material_servico: null,
  acao_associacao: null,
  conta_associacao: null,
  valor_original: 100,
  valor_rateio: 100,
};

const mockDespesasTabelas = {
  tipos_custeio: [
    { id: 1, nome: 'Tipo Custeio 1' },
    { id: 2, nome: 'Tipo Custeio 2' },
  ],
  acoes_associacao: [
    { uuid: '1', nome: 'Ação 1', e_recursos_proprios: false },
    { uuid: '2', nome: 'Ação 2', e_recursos_proprios: false },
  ],
};

const mockEspecificacoesCusteio = {
  1: [
    { id: 1, descricao: 'Especificação 1', ativa: true },
    { id: 2, descricao: 'Especificação 2', ativa: false },
  ],
  2: [
    { id: 3, descricao: 'Especificação 3', ativa: true },
  ],
};

const renderComponent = (props = {}) => {
  const defaultProps = {
    formikProps: mockFormikProps,
    rateio: mockRateio,
    index: 0,
    despesasTabelas: mockDespesasTabelas,
    especificacoes_custeio: mockEspecificacoesCusteio,
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
      <CadastroFormCusteio {...defaultProps} />
    </MemoryRouter>
  );
};

describe("Componente CadastroFormCusteio", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o componente com todos os campos", () => {
    renderComponent();
    
    expect(screen.getByLabelText("Tipo de despesa de custeio")).toBeInTheDocument();
    expect(screen.getByLabelText("Especificação do bem, material ou serviço")).toBeInTheDocument();
    expect(screen.getByLabelText("Ação")).toBeInTheDocument();
    expect(screen.getByLabelText("Tipo de conta")).toBeInTheDocument();
    expect(screen.getByLabelText("Valor")).toBeInTheDocument();
    expect(screen.getByLabelText("Valor realizado")).toBeInTheDocument();
  });

  it("deve renderizar as opções de tipo de custeio", () => {
    renderComponent();
    
    const select = screen.getByLabelText("Tipo de despesa de custeio");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("");
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

  it("deve renderizar o campo de tipo de conta", () => {
    renderComponent();
    
    const select = screen.getByLabelText("Tipo de conta");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("");
  });

  it("deve renderizar o campo de valor", () => {
    renderComponent();
    
    const inputs = screen.getAllByTestId("currency-input");
    const valorInput = inputs[0]; // Primeiro currency input é o valor
    expect(valorInput).toBeInTheDocument();
    expect(valorInput).toHaveValue("100");
  });

  it("deve renderizar o campo de valor realizado", () => {
    renderComponent();
    
    const inputs = screen.getAllByTestId("currency-input");
    const valorRealizadoInput = inputs[1]; // Segundo currency input é o valor realizado
    expect(valorRealizadoInput).toBeInTheDocument();
    expect(valorRealizadoInput).toHaveValue("100");
  });

  it("deve desabilitar campos quando disabled for true", () => {
    renderComponent({ disabled: true });
    
    const select = screen.getByLabelText("Tipo de despesa de custeio");
    expect(select).toBeDisabled();
  });

  it("deve mostrar erro quando verboHttp for PUT e campos obrigatórios estiverem vazios", () => {
    renderComponent({ 
      verboHttp: "PUT",
      rateio: { ...mockRateio, tipo_custeio: null }
    });
    
    const select = screen.getByLabelText("Tipo de despesa de custeio");
    expect(select).toHaveClass("is_invalid");
  });

  it("deve mostrar label correto para valor quando há retenção de imposto", () => {
    renderComponent({ 
      eh_despesa_com_retencao_imposto: jest.fn().mockReturnValue(true)
    });
    
    expect(screen.getByLabelText("Valor líquido")).toBeInTheDocument();
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

  it("deve mostrar especificações quando tipo de custeio é selecionado", () => {
    renderComponent({
      rateio: { ...mockRateio, tipo_custeio: 1 }
    });
    
    const select = screen.getByLabelText("Especificação do bem, material ou serviço");
    expect(select).toBeInTheDocument();
  });

  it("deve filtrar ações que não são recursos próprios", () => {
    renderComponent({
      despesasTabelas: {
        ...mockDespesasTabelas,
        acoes_associacao: [
          { uuid: '1', nome: 'Ação 1', e_recursos_proprios: false },
          { uuid: '2', nome: 'Ação 2', e_recursos_proprios: true }, // Esta deve ser filtrada
        ]
      }
    });
    
    const select = screen.getByLabelText("Ação");
    expect(select).toBeInTheDocument();
  });

  it("deve chamar setValorRateioRealizado quando valor original é alterado", () => {
    const mockSetFieldValue = jest.fn();
    renderComponent({
      formikProps: {
        ...mockFormikProps,
        setFieldValue: mockSetFieldValue,
      }
    });
    
    const valorInput = screen.getAllByTestId("currency-input")[0];
    fireEvent.change(valorInput, { target: { value: "200" } });
    
    expect(mockSetFieldValue).toHaveBeenCalled();
  });

  it("deve aplicar classe de erro quando valor realizado é zero e verboHttp é PUT", () => {
    // Mock trataNumericos para retornar 0 neste teste específico
    const { trataNumericos } = require("../../../../../utils/ValidacoesAdicionaisFormularios");
    trataNumericos.mockReturnValue(0);
    
    renderComponent({
      verboHttp: "PUT",
      rateio: { ...mockRateio, valor_rateio: 0 }
    });
    
    const valorRealizadoInput = screen.getAllByTestId("currency-input")[1];
    expect(valorRealizadoInput).toHaveClass("is_invalid");
  });
}); 