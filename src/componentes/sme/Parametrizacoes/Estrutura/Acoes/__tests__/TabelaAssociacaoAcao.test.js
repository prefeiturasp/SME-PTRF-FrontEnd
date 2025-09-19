import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabelaAssociacaoAcao } from '../TabelaAssociacaoAcao';
import { mockUnidades as mockListaUnidades } from '../__fixtures__/mockData';

const mockUnidades = {
  "count": 2,
  "next": "http://localhost:8000/api/acoes-associacoes/?acao__uuid=ee8a43b7-0156-4025-b142-b1c5ba2a3790&filtro_informacoes=&nome=&page=2",
  "previous": null,
  "results": mockListaUnidades
};

const defaultProps = {
  unidades: mockUnidades,
  rowsPerPage: 10,
  selecionarHeader: jest.fn(),
  selecionarTemplate: jest.fn(),
  acoesTemplate: jest.fn(),
  onPageChange: jest.fn(),
  firstPage: 1
}

describe('TabelaAssociacaoAcao', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o componente corretamente', () => {
    render(
      <TabelaAssociacaoAcao {...defaultProps} />
    );

    expect(screen.getByRole('columnheader', { name: 'Código Eol' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Nome UE' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Informações' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Ações' })).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 2' })).toBeInTheDocument();
  });

  it('deve chamar a função onPageChange ao clicar no Paginator', () => {
    render(
      <TabelaAssociacaoAcao {...defaultProps} />
    );

    const paginatorButton = screen.getByRole('button', { name: 'Page 2' });
    fireEvent.click(paginatorButton);

    expect(defaultProps.onPageChange).toHaveBeenCalled();
  });

  it('deve renderizar o botão de legenda', () => {
    render(
      <TabelaAssociacaoAcao {...defaultProps} />
    );

    expect(screen.getByRole('button', { name: 'Legenda informação' })).toBeInTheDocument();
  });
});