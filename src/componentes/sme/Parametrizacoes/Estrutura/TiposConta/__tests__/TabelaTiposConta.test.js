import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TabelaTiposContas from '../TabelaTiposConta';

// Mock do subcomponente TotalRegistros para verificar as props enviadas
jest.mock('../../../componentes/TotalRegistros', () => ({
  TotalRegistros: ({ titulo, total_registros }) => (
    <div data-testid="total-registros-mock">
      <span>{titulo}</span>
      <span>{total_registros}</span>
    </div>
  ),
}));

describe('Componente <TabelaTiposContas />', () => {
  const mockAcoesTemplate = jest.fn((rowData) => (
    <button data-testid={`btn-acao-${rowData.id}`}>Ação {rowData.id}</button>
  ));

  const mockListaDeTiposContas = [
    { id: 1, nome: 'Conta Corrente' },
    { id: 2, nome: 'Conta Poupança' },
    { id: 3, nome: 'Conta Aplicações' },
  ];

  const defaultProps = {
    rowsPerPage: 10,
    listaDeTiposContas: mockListaDeTiposContas,
    acoesTemplate: mockAcoesTemplate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar o componente TotalRegistros com o título e a contagem corretos', () => {
    render(<TabelaTiposContas {...defaultProps} />);

    const totalRegistrosMock = screen.getByTestId('total-registros-mock');
    expect(totalRegistrosMock).toBeInTheDocument();
    expect(screen.getByText('Tipo(s) de Conta(s)')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('deve renderizar os cabeçalhos das colunas da tabela', () => {
    render(<TabelaTiposContas {...defaultProps} />);

    expect(screen.getByRole('columnheader', { name: /tipo de conta/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /ações/i })).toBeInTheDocument();
  });

  test('deve renderizar os itens da lista de tipos de contas', () => {
    render(<TabelaTiposContas {...defaultProps} />);

    expect(screen.getByText('Conta Corrente')).toBeInTheDocument();
    expect(screen.getByText('Conta Poupança')).toBeInTheDocument();
    expect(screen.getByText('Conta Aplicações')).toBeInTheDocument();
  });

  test('deve chamar e renderizar o template de ações para cada linha da tabela', () => {
    const mockAcoes = jest.fn((rowData) => (
      <button data-testid={`btn-acao-${rowData.id}`}>
        Ação {rowData.id}
      </button>
    ));

    render(
      <TabelaTiposContas
        {...defaultProps}
        acoesTemplate={mockAcoes}
      />
    );

    expect(screen.getByTestId('btn-acao-1')).toBeInTheDocument();
    expect(screen.getByTestId('btn-acao-2')).toBeInTheDocument();
    expect(screen.getByTestId('btn-acao-3')).toBeInTheDocument();
  });

  test('deve renderizar corretamente quando a lista de tipos de contas estiver vazia', () => {
    render(
      <TabelaTiposContas
        {...defaultProps}
        listaDeTiposContas={[]}
      />
    );

    // Deve informar 0 no TotalRegistros
    expect(screen.getByText('0')).toBeInTheDocument();

    // Nenhum item de conta deve estar na tela
    expect(screen.queryByText('Conta Corrente')).not.toBeInTheDocument();
  });
});