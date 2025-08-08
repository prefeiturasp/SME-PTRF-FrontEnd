import { render, screen, fireEvent } from '@testing-library/react';
import { SelectPeriodoConta } from '../SelectPeriodoConta';
import { mockContasAssociacoes, mockPeriodos } from '../__fixtures__/mockData';

jest.mock('../../../../utils/ValidacoesAdicionaisFormularios', () => ({
  exibeDataPT_BR: (data) => `formatada-${data}`,
}));

jest.mock('../../../../utils/FormataData', () => ({
  formataData: (data) => `formatada-${data}`,
}));

describe('SelectPeriodoConta', () => {
  const mockHandleChange = jest.fn();

  const periodosMock = mockPeriodos;

  const defaultProps = {
    periodoConta: { periodo: '', conta: '' },
    handleChangePeriodoConta: mockHandleChange,
    periodosAssociacao: periodosMock,
    contasAssociacao: mockContasAssociacoes,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza os selects com opções corretas', () => {
    render(<SelectPeriodoConta {...defaultProps} />);

    expect(screen.getByLabelText('Período:')).toBeInTheDocument();
    expect(screen.getByLabelText('Conta:')).toBeInTheDocument();

    expect(screen.getByText(/2023.2 - formatada-2023-05-01 até formatada-2023-08-31/i)).toBeInTheDocument();
    expect(screen.getByText(/Conta Corrente \(encerrada em formatada-2025-06-01\)/)).toBeInTheDocument();
    expect(screen.getByText(/Conta Ativa/)).toBeInTheDocument();
  });

  it('chama handleChangePeriodoConta ao selecionar um período', () => {
    render(<SelectPeriodoConta {...defaultProps} />);

    fireEvent.change(screen.getByLabelText('Período:'), {
      target: { name: 'periodo', value: mockPeriodos[0].uuid },
    });

    expect(mockHandleChange).toHaveBeenCalledWith('periodo', mockPeriodos[0].uuid, 'periodo');
  });

  it('chama handleChangePeriodoConta ao selecionar uma conta', () => {
    render(<SelectPeriodoConta {...defaultProps} />);

    fireEvent.change(screen.getByLabelText('Conta:'), {
      target: { name: 'conta', value: mockContasAssociacoes[0].uuid },
    });

    expect(mockHandleChange).toHaveBeenCalledWith('conta', mockContasAssociacoes[0].uuid, 'conta');
  });
});
