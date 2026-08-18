import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Filtros } from '../Filtros';

describe('Componente <Filtros />', () => {
  const mockHandleChangeFiltros = jest.fn();
  const mockHandleSubmitFiltros = jest.fn();
  const mockHandleLimparFiltros = jest.fn();

  const defaultProps = {
    stateFiltros: {
      nome: 'Conta Corrente',
    },
    handleChangeFiltros: mockHandleChangeFiltros,
    handleSubmitFiltros: mockHandleSubmitFiltros,
    handleLimparFiltros: mockHandleLimparFiltros,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar os elementos da interface corretamente com o valor inicial das props', () => {
    render(<Filtros {...defaultProps} />);

    expect(screen.getByLabelText(/filtre por tipo de conta/i)).toBeInTheDocument();

    const inputNome = screen.getByPlaceholderText(/digite o tipo de conta.../i);
    expect(inputNome).toBeInTheDocument();
    expect(inputNome).toHaveValue('Conta Corrente');

    expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filtrar/i })).toBeInTheDocument();
  });

  test('deve chamar handleChangeFiltros com o nome do campo e o novo valor ao digitar no input', () => {
    render(<Filtros {...defaultProps} />);

    const inputNome = screen.getByLabelText(/filtre por tipo de conta/i);
    fireEvent.change(inputNome, { target: { name: 'nome', value: 'Poupança' } });

    expect(mockHandleChangeFiltros).toHaveBeenCalledTimes(1);
    expect(mockHandleChangeFiltros).toHaveBeenCalledWith('nome', 'Poupança');
  });

  test('deve chamar handleLimparFiltros ao clicar no botão "Limpar"', () => {
    render(<Filtros {...defaultProps} />);

    const btnLimpar = screen.getByRole('button', { name: /limpar/i });
    fireEvent.click(btnLimpar);

    expect(mockHandleLimparFiltros).toHaveBeenCalledTimes(1);
  });

  test('deve chamar handleSubmitFiltros ao clicar no botão "Filtrar"', () => {
    render(<Filtros {...defaultProps} />);

    const btnFiltrar = screen.getByRole('button', { name: /filtrar/i });
    fireEvent.click(btnFiltrar);

    expect(mockHandleSubmitFiltros).toHaveBeenCalledTimes(1);
  });

  test('deve chamar handleSubmitFiltros prevenindo o comportamento padrão ao submeter o formulário (ex: acionando Enter)', () => {
    render(<Filtros {...defaultProps} />);

    const inputNome = screen.getByLabelText(/filtre por tipo de conta/i);
    
    // Dispara a submissão do formulário
    fireEvent.submit(inputNome);

    expect(mockHandleSubmitFiltros).toHaveBeenCalledTimes(1);
  });
});