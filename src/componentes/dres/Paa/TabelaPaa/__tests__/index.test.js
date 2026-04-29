import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TabelaPaa } from '../index';

jest.mock('primereact/datatable', () => ({
  DataTable: ({ value, children, paginator }) => {
    const React = require('react');
    return (
      <div data-testid="datatable" data-paginator={paginator?.toString()}>
        {value?.map((row, rowIndex) => (
          <div key={rowIndex} data-testid="row">
            {React.Children.map(children, (col, colIndex) => {
              if (!col) return null;
              const body = col.props.body;
              return (
                <div key={colIndex} data-testid={`cell-${colIndex}`}>
                  {typeof body === 'function' ? body(row) : row[col.props.field]}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  },
}));

jest.mock('primereact/column', () => ({
  Column: (props) => <>{props.children}</>,
}));

describe('TabelaPaa Component', () => {
  const mockUnidadeTemplate = jest.fn((rowData) => <span>{rowData.unidade.nome}</span>);
  const mockAcaoTemplate = jest.fn(() => <button>Visualizar</button>);

  const defaultProps = {
    listaPaa: {
      count: 1,
      results: [
        {
          unidade: { codigo_eol: '123', nome: 'Escola A' },
          periodo_paa: { referencia: '2024' },
          status_display: 'Ativo',
          documento: 'url',
        },
      ],
    },
    linhasPorPagina: 5,
    paginaAtual: 1,
    unidadeEscolarTemplate: mockUnidadeTemplate,
    acaoTemplatePdf: mockAcaoTemplate,
    aoMudarPagina: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar a tabela com dados', () => {
    render(<TabelaPaa {...defaultProps} />);

    expect(screen.getByTestId('datatable')).toBeInTheDocument();
    expect(screen.getAllByTestId('row')).toHaveLength(1);
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('deve executar templates das colunas', () => {
    render(<TabelaPaa {...defaultProps} />);

    expect(mockUnidadeTemplate).toHaveBeenCalled();
    expect(mockAcaoTemplate).toHaveBeenCalled();
  });

  it('deve renderizar status corretamente via status_display', () => {
    render(<TabelaPaa {...defaultProps} />);
    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });

  it('deve exibir "-" quando o dado opcional for nulo', () => {
    const propsComDadosNulos = {
      ...defaultProps,
      listaPaa: {
        count: 1,
        results: [{
          ...defaultProps.listaPaa.results[0],
          status_display: null,
          periodo_paa: null
        }]
      }
    };

    render(<TabelaPaa {...propsComDadosNulos} />);
    
    const dashes = screen.getAllByText('-');
    expect(dashes.length).toBeGreaterThanOrEqual(1);
  });

  it('deve renderizar corretamente com lista vazia', () => {
    render(<TabelaPaa {...defaultProps} listaPaa={{ count: 0, results: [] }} />);

    expect(screen.getByTestId('datatable')).toBeInTheDocument();
    expect(screen.queryByTestId('row')).not.toBeInTheDocument();
  });

  it('deve passar a prop paginator como true para o DataTable', () => {
    render(<TabelaPaa {...defaultProps} />);
    expect(screen.getByTestId('datatable')).toHaveAttribute('data-paginator', 'true');
  });
});