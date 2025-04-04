import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabelaAssociacaoAcaoNaoVinculadas } from '../TabelaAssociacaoAcaoNaoVinculadas';
import { mockUnidades } from '../../__fixtures__/mockData';


const mockHandleVinculaUE = jest.fn();

const mockAcoesTemplate = (rowData) => {
    return (
      <button
          className="btn-editar-membro"
          onClick={() => mockHandleVinculaUE(rowData)}
      >
          Vincular
      </button>
    );
};

const defaultProps = {
  unidades: mockUnidades,
  rowsPerPage: 10,
  selecionarHeader: jest.fn(),
  selecionarTemplate: jest.fn(),
  acoesTemplate: mockAcoesTemplate,
  autoLayout: true,
  caminhoUnidade: "unidade"
}

describe('TabelaAssociacaoAcaoNaoVinculadas', () => {

  it('deve renderizar o componente corretamente', () => {
    render(
      <TabelaAssociacaoAcaoNaoVinculadas {...defaultProps}/>
    );

    expect(screen.getByText('Código Eol')).toBeInTheDocument();
    expect(screen.getByText('Nome UE')).toBeInTheDocument();
    expect(screen.getByText('Informações')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('deve chamar a função onPageChange ao clicar no Paginator', () => {
    render(
      <TabelaAssociacaoAcaoNaoVinculadas {...defaultProps}/>
    );

    const tabela = screen.getByRole("grid");
    const rows = tabela.querySelectorAll("tbody tr");
    expect(rows).toHaveLength(2);
    const row = rows[0]
    const cells = row.querySelectorAll("td");
    expect(cells).toHaveLength(5); // todas as colunas da tabela
    const actionsCell = cells[4]
    expect(actionsCell).not.toBeEmptyDOMElement(); // Ações não está vazia
    const botaoEditar = actionsCell.querySelector("button");
    expect(botaoEditar).toBeInTheDocument();
    fireEvent.click(botaoEditar);
    expect(mockHandleVinculaUE).toHaveBeenCalled()
  });
});
