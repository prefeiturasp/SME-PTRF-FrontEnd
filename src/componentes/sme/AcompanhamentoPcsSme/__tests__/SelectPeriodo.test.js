import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectPeriodo } from '../SelectPeriodo';

// Mockando a função de formatação de data
jest.mock('../../../../utils/ValidacoesAdicionaisFormularios', () => ({
  exibeDataPT_BR: (data) => `formatado-${data}`
}));

describe('SelectPeriodo', () => {
  const mockPeriodos = [
    {
      uuid: 'abc-123',
      referencia: '2024.1',
      data_inicio_realizacao_despesas: '2024-01-01',
      data_fim_realizacao_despesas: '2024-06-30'
    },
    {
      uuid: 'def-456',
      referencia: '2024.2',
      data_inicio_realizacao_despesas: null,
      data_fim_realizacao_despesas: null
    }
  ];

  const mockHandleChange = jest.fn();

  beforeEach(() => {
    mockHandleChange.mockClear();
  });

  it('renderiza o label e o select com as opções formatadas', () => {
    render(
      <SelectPeriodo
        periodos={mockPeriodos}
        periodoEscolhido="abc-123"
        handleChangePeriodos={mockHandleChange}
      />
    );

    // Verifica o label
    expect(screen.getByLabelText('Período:')).toBeInTheDocument();

    // Verifica opções renderizadas
    expect(screen.getByRole('option', { name: '2024.1 - formatado-2024-01-01 até formatado-2024-06-30' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '2024.2 - - até -' })).toBeInTheDocument();

    // Verifica o valor selecionado
    expect(screen.getByDisplayValue(/2024.1/)).toBeInTheDocument();
  });

  it('dispara handleChangePeriodos ao trocar o período', () => {
    render(
      <SelectPeriodo
        periodos={mockPeriodos}
        periodoEscolhido="abc-123"
        handleChangePeriodos={mockHandleChange}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'def-456' } });

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith('def-456');
  });

  it('não renderiza opções se lista de períodos estiver vazia', () => {
    render(
      <SelectPeriodo
        periodos={[]}
        periodoEscolhido=""
        handleChangePeriodos={mockHandleChange}
      />
    );

    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });
});
