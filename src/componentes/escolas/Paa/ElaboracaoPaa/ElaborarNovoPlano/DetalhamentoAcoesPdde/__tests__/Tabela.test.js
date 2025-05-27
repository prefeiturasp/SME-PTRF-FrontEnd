import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tabela from '../Tabela';

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <i data-testid="fa-icon" />,
}));

jest.mock('react-tooltip', () => () => <div data-testid="tooltip" />);

jest.mock('../Paginacao', () => ({
  Paginacao: () => <div data-testid="paginacao" />,
}));

jest.mock('../ModalEdicaoReceitaPrevistaPdde', () => ({ open, onClose, receitaPrevistaPDDE }) =>
  open ? (
    <div data-testid="modal">
      Modal Aberto - {receitaPrevistaPDDE?.nome}
      <button onClick={onClose}>Fechar</button>
    </div>
  ) : null
);

const mockData = {
  results: [
    {
      id: 1,
      uuid: "acao-pdde-uuid-1234",
      nome: "Ação PDDE 1",
      programa: 1,
      programa_objeto: { id: 1, uuid: "1de0c2ac-8468-48a6-89e8-14ffa0d78133", nome: "Programa A" },
      aceita_custeio: true,
      aceita_capital: true,
      aceita_livre_aplicacao: true,
      receitas_previstas_pdde_valores:{
        uuid: "1de0c2ac-8468-48a6-89e8-14ffa0d78131",
        saldo_capital: 100.00,
        saldo_custeio: 200.00,
        saldo_livre: 300.00,
        previsao_valor_capital: 50.00,
        previsao_valor_custeio: 60.00,
        previsao_valor_livre: 70.00,
      }
    },
  ],
};

describe('Tabela', () => {
  it('deve renderizar colunas e dados corretamente', () => {
    render(
      <Tabela
        data={mockData}
        rowsPerPage={20}
        setCurrentPage={() => {}}
        setFirstPage={() => {}}
        firstPage={0}
        count={1}
        isLoading={false}
      />
    );

    expect(screen.getByText('Ação PDDE')).toBeInTheDocument();
    expect(screen.getByText('Programa')).toBeInTheDocument();
    expect(screen.getByText('Custeio (R$)')).toBeInTheDocument();
    expect(screen.getByText('Capital (R$)')).toBeInTheDocument();
    expect(screen.getByText('Livre aplicação (R$)')).toBeInTheDocument();
    expect(screen.getByTestId('paginacao')).toBeInTheDocument();
  });

  it('deve renderizar dados da ação corretamente', () => {
    render(
      <Tabela
        data={mockData}
        rowsPerPage={20}
        setCurrentPage={() => {}}
        setFirstPage={() => {}}
        firstPage={0}
        count={1}
        isLoading={false}
      />
    );

    expect(screen.getByText('Ação PDDE 1')).toBeInTheDocument();
    expect(screen.getByText('Programa A')).toBeInTheDocument();
    expect(screen.getByText(/150,00/)).toBeInTheDocument();
    expect(screen.getByText(/260,00/)).toBeInTheDocument();
  });

  it('deve abrir o modal ao clicar no botão de editar', () => {
    render(
      <Tabela
        data={mockData}
        rowsPerPage={20}
        setCurrentPage={() => {}}
        setFirstPage={() => {}}
        firstPage={0}
        count={1}
        isLoading={false}
      />
    );

    const botaoEditar = screen.getByTestId('botao-editar');
    fireEvent.click(botaoEditar);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText(/Modal Aberto - Ação PDDE 1/i)).toBeInTheDocument();
  });

  it('deve fechar o modal ao clicar no botão fechar', () => {
    render(
      <Tabela
        data={mockData}
        rowsPerPage={20}
        setCurrentPage={() => {}}
        setFirstPage={() => {}}
        firstPage={0}
        count={1}
        isLoading={false}
      />
    );

    const botaoEditar = screen.getByTestId('botao-editar');
    fireEvent.click(botaoEditar);

    const botaoFechar = screen.getByText('Fechar');
    fireEvent.click(botaoFechar);

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });
});
