import React from 'react';
import { render, screen } from '@testing-library/react';
import { ListaRelatorios } from '../ListaRelatorios';

jest.mock('primereact/datatable', () => ({
  DataTable: ({ children, value, paginator, rows, paginatorTemplate }) => (
    <div data-testid="datatable" data-paginator={paginator} data-rows={rows}>
      <table>
        <tbody>
          {value?.map((item, index) => (
            <tr key={index} data-testid={`row-${index}`}>
              <td>{item.nome_da_dre}</td>
              <td>{item.tipo_relatorio}</td>
              <td>{item.total_unidades_no_relatorio}</td>
              <td>{item.data_recebimento}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {children}
    </div>
  ),
}));

jest.mock('primereact/column', () => ({
  Column: ({ field, header, body }) => (
    <div data-testid={`column-${field || 'body'}`} data-header={header}>
      {header}
    </div>
  ),
}));

describe('ListaRelatorios', () => {
  const mockRelatorios = [
    {
      nome_da_dre: 'DRE Teste 1',
      tipo_relatorio: 'Mensal',
      total_unidades_no_relatorio: 10,
      data_recebimento: '01/01/2024',
    },
    {
      nome_da_dre: 'DRE Teste 2',
      tipo_relatorio: 'Anual',
      total_unidades_no_relatorio: 20,
      data_recebimento: '02/01/2024',
    },
  ];

  const mockAcoesTemplate = jest.fn((rowData) => <button>Ação</button>);
  const mockStatusSmeTemplate = jest.fn((rowData) => <span>Status</span>);

  it('deve renderizar o componente corretamente', () => {
    render(
      <ListaRelatorios
        relatoriosConsolidados={mockRelatorios}
        rowsPerPage={10}
        acoesTemplate={mockAcoesTemplate}
        statusSmeTemplate={mockStatusSmeTemplate}
      />
    );

    expect(screen.getByTestId('datatable')).toBeInTheDocument();
  });

  it('deve renderizar todas as colunas', () => {
    render(
      <ListaRelatorios
        relatoriosConsolidados={mockRelatorios}
        rowsPerPage={10}
        acoesTemplate={mockAcoesTemplate}
        statusSmeTemplate={mockStatusSmeTemplate}
      />
    );

    expect(screen.getByText('Nome da DRE')).toBeInTheDocument();
    expect(screen.getByText('Tipo de Publicação')).toBeInTheDocument();
    expect(screen.getByText('Total de unidades no relatório')).toBeInTheDocument();
    expect(screen.getByText('Data de recebimento')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Ação')).toBeInTheDocument();
  });

  it('deve exibir paginação quando há mais itens que rowsPerPage', () => {
    render(
      <ListaRelatorios
        relatoriosConsolidados={mockRelatorios}
        rowsPerPage={1}
        acoesTemplate={mockAcoesTemplate}
        statusSmeTemplate={mockStatusSmeTemplate}
      />
    );

    const datatable = screen.getByTestId('datatable');
    expect(datatable).toHaveAttribute('data-paginator', 'true');
  });

  it('não deve exibir paginação quando há menos itens que rowsPerPage', () => {
    render(
      <ListaRelatorios
        relatoriosConsolidados={mockRelatorios}
        rowsPerPage={10}
        acoesTemplate={mockAcoesTemplate}
        statusSmeTemplate={mockStatusSmeTemplate}
      />
    );

    const datatable = screen.getByTestId('datatable');
    expect(datatable).toHaveAttribute('data-paginator', 'false');
  });

  it('deve renderizar lista vazia sem erros', () => {
    render(
      <ListaRelatorios
        relatoriosConsolidados={[]}
        rowsPerPage={10}
        acoesTemplate={mockAcoesTemplate}
        statusSmeTemplate={mockStatusSmeTemplate}
      />
    );

    expect(screen.getByTestId('datatable')).toBeInTheDocument();
  });

  it('deve passar os dados corretos para o DataTable', () => {
    render(
      <ListaRelatorios
        relatoriosConsolidados={mockRelatorios}
        rowsPerPage={5}
        acoesTemplate={mockAcoesTemplate}
        statusSmeTemplate={mockStatusSmeTemplate}
      />
    );

    expect(screen.getByText('DRE Teste 1')).toBeInTheDocument();
    expect(screen.getByText('DRE Teste 2')).toBeInTheDocument();
  });
});