import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Filtros } from '../Filtros';

const mockHandleChangeFiltros = jest.fn();
const mockHandleSubmitFiltros = jest.fn();
const mockLimpaFiltros = jest.fn();

const periodosMock = [
  {
    uuid: 'periodo-1',
    referencia: '01/2024',
    data_inicio_realizacao_despesas: '2024-01-01',
    data_fim_realizacao_despesas: '2024-01-31',
  },
];

const tabelaPrestacoesMock = {
  status: [
    { id: 1, nome: 'Aprovado' },
    { id: 2, nome: 'Reprovado' },
  ],
};

const defaultProps = {
  stateFiltros: {
    filtrar_por_periodo: '',
    filtrar_por_status: '',
  },
  handleChangeFiltros: mockHandleChangeFiltros,
  handleSubmitFiltros: mockHandleSubmitFiltros,
  limpaFiltros: mockLimpaFiltros,
  periodosAssociacao: periodosMock,
  tabelaPrestacoes: tabelaPrestacoesMock,
  exibeDataPT_BR: (data) => data,
};

const renderComponent = (props = {}) =>
  render(<Filtros {...defaultProps} {...props} />);

describe('Filtros', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar os campos de filtro corretamente', () => {
    renderComponent();

    expect(screen.getByLabelText(/filtrar por período/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filtrar por status/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /filtrar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /limpar filtros/i })).toBeInTheDocument();
  });

  it('deve renderizar opções de períodos', () => {
    renderComponent();

    expect(
      screen.getByRole('option', { name: /01\/2024/i })
    ).toBeInTheDocument();
  });

  it('deve renderizar opções de status', () => {
    renderComponent();

    expect(screen.getByRole('option', { name: /aprovado/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /reprovado/i })).toBeInTheDocument();
  });

  it('deve chamar handleChangeFiltros ao alterar período', () => {
    renderComponent();

    const selectPeriodo = screen.getByLabelText(/filtrar por período/i);

    fireEvent.change(selectPeriodo, {
      target: { value: 'periodo-1', name: 'filtrar_por_periodo' },
    });

    expect(mockHandleChangeFiltros).toHaveBeenCalledWith(
      'filtrar_por_periodo',
      'periodo-1'
    );
  });

  it('deve chamar handleChangeFiltros ao alterar status', () => {
    renderComponent();

    const selectStatus = screen.getByLabelText(/filtrar por status/i);

    fireEvent.change(selectStatus, {
      target: { value: '1', name: 'filtrar_por_status' },
    });

    expect(mockHandleChangeFiltros).toHaveBeenCalledWith(
      'filtrar_por_status',
      '1'
    );
  });

  it('deve chamar handleSubmitFiltros ao clicar em Filtrar', () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /filtrar/i }));

    expect(mockHandleSubmitFiltros).toHaveBeenCalled();
  });

  it('deve chamar limpaFiltros ao clicar em Limpar filtros', () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /limpar filtros/i }));

    expect(mockLimpaFiltros).toHaveBeenCalled();
  });

});