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

jest.mock('../ModalEdicaoAcaoPdde', () => ({ open, onClose, acaoPdde }) =>
  open ? (
    <div data-testid="modal">
      Modal Aberto - {acaoPdde?.nome}
      <button onClick={onClose}>Fechar</button>
    </div>
  ) : null
);

const mockData = {
  results: [
    {
      uuid: '123',
      nome: 'Ação Teste',
      categoria_objeto: { nome: 'Programa A' },
      previsao_valor_custeio: '100,00',
      saldo_valor_custeio: '200,00',
      previsao_valor_capital: '50,00',
      saldo_valor_capital: '100,00',
      previsao_valor_livre_aplicacao: '30,00',
      saldo_valor_livre_aplicacao: '70,00',
      aceita_custeio: true,
      aceita_capital: false,
      aceita_livre_aplicacao: true,
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

    expect(screen.getByText('Ação Teste')).toBeInTheDocument();
    expect(screen.getByText('Programa A')).toBeInTheDocument();
    expect(screen.getByText(/3,00/)).toBeInTheDocument();
    expect(screen.getByText(/1,00/)).toBeInTheDocument();
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
    expect(screen.getByText(/Modal Aberto - Ação Teste/i)).toBeInTheDocument();
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


/* expect(screen.getByRole('grid')).toBeInTheDocument(); */