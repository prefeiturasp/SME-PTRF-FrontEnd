import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CadastroFormDespesaImposto } from "../CadastroFormDespesaImposto";
import { MemoryRouter } from "react-router-dom";

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
  trataNumericos: jest.fn().mockReturnValue(100),
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

const mockFormikProps = {
  values: {
    data_transacao: '2024-01-01',
    despesas_impostos: [
      {
        tipo_documento: null,
        numero_documento: '',
        tipo_transacao: null,
        data_transacao: '',
        documento_transacao: '',
        rateios: [
          {
            tipo_custeio: { id: 1, nome: 'Tipo Custeio 1' },
            especificacao_material_servico: null,
            acao_associacao: null,
            conta_associacao: null,
            valor_original: 100,
            valor_rateio: 100,
          }
        ]
      }
    ]
  },
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
  setFieldValue: jest.fn(),
};

const mockDespesaImposto = {
  tipo_documento: null,
  numero_documento: '',
  tipo_transacao: null,
  data_transacao: '',
  documento_transacao: '',
  rateios: [
    {
      tipo_custeio: { id: 1, nome: 'Tipo Custeio 1' },
      especificacao_material_servico: null,
      acao_associacao: null,
      conta_associacao: null,
      valor_original: 100,
      valor_rateio: 100,
    }
  ]
};

const mockTiposDocumento = [
  { id: 1, nome: 'Tipo Documento 1' },
  { id: 2, nome: 'Tipo Documento 2' },
];

const mockDespesasTabelas = {
  tipos_transacao: [
    { id: 1, nome: 'Tipo Transação 1' },
    { id: 2, nome: 'Tipo Transação 2' },
  ],
};

const mockEspecificacoesCusteio = {
  1: [
    { id: 1, descricao: 'Especificação 1', ativa: true },
    { id: 2, descricao: 'Especificação 2', ativa: false },
  ],
};

const mockAcoesCusteio = [
  { uuid: '1', nome: 'Ação 1' },
  { uuid: '2', nome: 'Ação 2' },
];

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(visoesService.visoesService, 'getPermissoes').mockReturnValue(true);
});

const renderComponent = (props = {}) => {
  const defaultProps = {
    formikProps: mockFormikProps,
    eh_despesa_com_retencao_imposto: jest.fn().mockReturnValue(true),
    disabled: false,
    tipos_documento_com_recolhimento_imposto: jest.fn().mockReturnValue(mockTiposDocumento),
    numeroDocumentoImpostoReadOnly: jest.fn().mockReturnValue(false),
    aux: {
      onHandleChangeApenasNumero: jest.fn(),
      exibeDocumentoTransacaoImposto: jest.fn(),
    },
    preenche_tipo_despesa_custeio: jest.fn().mockReturnValue({ id: 1, nome: 'Tipo Custeio 1' }),
    especificacoes_custeio: mockEspecificacoesCusteio,
    despesasTabelas: mockDespesasTabelas,
    cssEscondeDocumentoTransacaoImposto: {},
    labelDocumentoTransacaoImposto: {},
    setCssEscondeDocumentoTransacaoImposto: jest.fn(),
    setLabelDocumentoTransacaoImposto: jest.fn(),
    despesaContext: { verboHttp: "POST" },
    acoes_custeio: jest.fn().mockReturnValue(mockAcoesCusteio),
    setValorRateioRealizadoImposto: jest.fn(),
    readOnlyCamposImposto: [false, false],
    index: 0,
    despesa_imposto: mockDespesaImposto,
    remove: jest.fn(),
    formErrorsImposto: {},
    onCalendarCloseDataPagamentoImposto: jest.fn(),
    renderContaAssociacaoOptions: jest.fn().mockReturnValue([]),
    filterContas: jest.fn().mockReturnValue([]),
    limparSelecaoContasDesabilitadas: jest.fn(),
    ...props,
  };

  return render(
    <MemoryRouter>
      <CadastroFormDespesaImposto {...defaultProps} />
    </MemoryRouter>
  );
};

describe("Componente CadastroFormDespesaImposto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o componente quando eh_despesa_com_retencao_imposto retorna true", () => {
    renderComponent();
    expect(screen.getByText("Imposto retido 1")).toBeInTheDocument();
  });

  it("não deve renderizar o componente quando eh_despesa_com_retencao_imposto retorna false", () => {
    renderComponent({
      eh_despesa_com_retencao_imposto: jest.fn().mockReturnValue(false)
    });
    expect(screen.queryByText("Imposto retido 1")).not.toBeInTheDocument();
  });

  it("deve renderizar o campo tipo de documento", () => {
    renderComponent();
    expect(screen.getByLabelText("Tipo de documento")).toBeInTheDocument();
  });

  it("deve renderizar as opções de tipo de documento", () => {
    renderComponent();
    const select = screen.getByLabelText("Tipo de documento");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("");
  });

  it("deve renderizar o campo número do documento", () => {
    renderComponent();
    expect(screen.getByLabelText("Número do documento")).toBeInTheDocument();
  });

  it("deve renderizar o campo tipo de despesa", () => {
    renderComponent();
    expect(screen.getByLabelText("Tipo de despesa")).toBeInTheDocument();
  });

  it("deve renderizar o campo especificação do imposto", () => {
    renderComponent();
    expect(screen.getByLabelText("Especificação do imposto")).toBeInTheDocument();
  });

  it("deve renderizar o campo forma de pagamento", () => {
    renderComponent();
    expect(screen.getByLabelText("Forma de pagamento")).toBeInTheDocument();
  });

  it("deve renderizar o campo data do pagamento", () => {
    renderComponent();
    expect(screen.getByLabelText("Data do pagamento")).toBeInTheDocument();
  });

  it("deve renderizar o campo ação", () => {
    renderComponent();
    expect(screen.getByLabelText("Ação")).toBeInTheDocument();
  });

  it("deve renderizar o campo tipo de conta", () => {
    renderComponent();
    expect(screen.getByLabelText("Tipo de conta")).toBeInTheDocument();
  });

  it("deve renderizar o campo valor do imposto", () => {
    renderComponent();
    expect(screen.getByLabelText("Valor do imposto")).toBeInTheDocument();
  });

  it("deve renderizar o campo valor realizado do imposto", () => {
    renderComponent();
    expect(screen.getByLabelText("Valor realizado do imposto")).toBeInTheDocument();
  });

  it("deve desabilitar campos quando disabled for true", () => {
    renderComponent({ disabled: true });
    const select = screen.getByLabelText("Tipo de documento");
    expect(select).toBeDisabled();
  });

  it("deve mostrar o botão remover quando index >= 1", () => {
    renderComponent({ index: 1 });
    expect(screen.getByText("Remover Imposto")).toBeInTheDocument();
  });

  it("não deve mostrar o botão remover quando index = 0", () => {
    renderComponent({ index: 0 });
    expect(screen.queryByText("Remover Imposto")).not.toBeInTheDocument();
  });

  it("deve chamar remove quando botão remover for clicado", () => {
    const mockRemove = jest.fn();
    
    renderComponent({ 
      index: 1, 
      remove: mockRemove,
      readOnlyCamposImposto: [false, false], // Adicionar para index 1
      disabled: false // Garantir que não está desabilitado
    });
    
    const removeButton = screen.getByText("Remover Imposto");
    fireEvent.click(removeButton);
    
    expect(mockRemove).toHaveBeenCalledWith(1);
  });

  it("deve mostrar erro quando não há contas disponíveis", () => {
    renderComponent({
      filterContas: jest.fn().mockReturnValue([]),
      despesa_imposto: { ...mockDespesaImposto, data_transacao: '2024-01-01' }
    });
    expect(screen.getByText("Não existem contas disponíveis para a data do pagamento")).toBeInTheDocument();
  });

  it("deve mostrar erro de data quando formErrorsImposto contém erro", () => {
    renderComponent({
      formErrorsImposto: {
        0: { despesa_imposto_data_transacao: "Data inválida" }
      }
    });
    expect(screen.getByText("Data inválida")).toBeInTheDocument();
  });

  it("deve aplicar classe de erro quando valor realizado é zero e verboHttp é PUT", () => {
    const { trataNumericos } = require("../../../../../utils/ValidacoesAdicionaisFormularios");
    trataNumericos.mockReturnValue(0);
    
    renderComponent({
      despesaContext: { verboHttp: "PUT" },
      despesa_imposto: {
        ...mockDespesaImposto,
        rateios: [{ ...mockDespesaImposto.rateios[0], valor_rateio: 0 }]
      }
    });
    
    const valorRealizadoInput = screen.getAllByTestId("currency-input")[1];
    expect(valorRealizadoInput).toHaveClass("is_invalid");
  });

  it("deve chamar setValorRateioRealizadoImposto quando valor original é alterado", () => {
    const mockSetValorRateioRealizadoImposto = jest.fn();
    renderComponent({
      setValorRateioRealizadoImposto: mockSetValorRateioRealizadoImposto,
    });
    
    const valorInput = screen.getAllByTestId("currency-input")[0];
    fireEvent.change(valorInput, { target: { value: "200" } });
    
    expect(mockSetValorRateioRealizadoImposto).toHaveBeenCalled();
  });

  it("deve chamar onCalendarCloseDataPagamentoImposto quando data é alterada", () => {
    const mockOnCalendarCloseDataPagamentoImposto = jest.fn();
    const mockLimparSelecaoContasDesabilitadas = jest.fn();
    renderComponent({
      onCalendarCloseDataPagamentoImposto: mockOnCalendarCloseDataPagamentoImposto,
      limparSelecaoContasDesabilitadas: mockLimparSelecaoContasDesabilitadas,
    });
    
    const dateInput = screen.getByTestId("date-picker");
    fireEvent.change(dateInput, { target: { value: "2024-02-01" } });
    
    expect(mockLimparSelecaoContasDesabilitadas).toHaveBeenCalled();
    expect(mockOnCalendarCloseDataPagamentoImposto).toHaveBeenCalled();
  });

  it("deve mostrar especificações quando tipo de custeio é selecionado", () => {
    renderComponent({
      despesa_imposto: {
        ...mockDespesaImposto,
        rateios: [{ ...mockDespesaImposto.rateios[0], tipo_custeio: 1 }]
      }
    });
    const select = screen.getByLabelText("Especificação do imposto");
    expect(select).toBeInTheDocument();
  });

  it("deve desabilitar tipo de conta quando data_transacao está vazia", () => {
    renderComponent({
      despesa_imposto: {
        ...mockDespesaImposto,
        data_transacao: null
      }
    });
    const select = screen.getByLabelText("Tipo de conta");
    expect(select).toBeDisabled();
  });

  it("deve mostrar documento de transação quando forma de pagamento é selecionada", () => {
    renderComponent({
      despesa_imposto: {
        ...mockDespesaImposto,
        tipo_transacao: 1
      },
      labelDocumentoTransacaoImposto: { 0: "Nota Fiscal" },
      cssEscondeDocumentoTransacaoImposto: { 0: "" }
    });
    expect(screen.getByLabelText("Número do Nota Fiscal")).toBeInTheDocument();
  });
}); 