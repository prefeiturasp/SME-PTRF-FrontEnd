import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabelaAssociacaoAcao } from '../TabelaAssociacaoAcao';
import { mockUnidades as mockListaUnidades} from '../__fixtures__/mockData';

const mockUnidades ={
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

  it('deve renderizar o componente corretamente', () => {
    render(
      <TabelaAssociacaoAcao {...defaultProps}/>
    );

    expect(screen.getByText('Código Eol')).toBeInTheDocument();
    expect(screen.getByText('Nome UE')).toBeInTheDocument();
    expect(screen.getByText('Informações')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('deve chamar a função onPageChange ao clicar no Paginator', () => {
    render(
      <TabelaAssociacaoAcao {...defaultProps}/>
    );

    const paginatorButton = screen.getByText('1');
    fireEvent.click(paginatorButton);

    expect(defaultProps.onPageChange).toHaveBeenCalled();
  });
});
