import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputFiltro from '../index';

describe('Componente InputFiltro', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    label: 'Filtrar Nome',
    name: 'filtro-nome',
    value: '',
    onChange: mockOnChange,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar o input e o label corretamente', () => {
    render(<InputFiltro {...defaultProps} />);
    
    const labelElement = screen.getByText(/filtrar nome/i);
    expect(labelElement).toBeInTheDocument();

    const inputElement = screen.getByPlaceholderText(/digite para filtrar.../i);
    expect(inputElement).toBeInTheDocument();
  });

  test('deve chamar a função onChange com os argumentos corretos', () => {
    render(<InputFiltro {...defaultProps} />);
    const inputElement = screen.getByPlaceholderText(/digite para filtrar.../i);

    fireEvent.change(inputElement, { target: { value: 'React', name: 'filtro-nome' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('filtro-nome', 'React');
  });

  test('deve exibir o valor passado via prop "value"', () => {
    render(<InputFiltro {...defaultProps} value="Texto Inicial" />);
    const inputElement = screen.getByRole('textbox');
    
    expect(inputElement.value).toBe('Texto Inicial');
  });

  test('não deve renderizar label se a prop "label" não for fornecida', () => {
    render(<InputFiltro name="teste" onChange={mockOnChange} value="" />);
    
    const labelElement = screen.queryByLabelText(/filtrar nome/i);
    expect(labelElement).not.toBeInTheDocument();
  });

  test('deve aplicar classes customizadas passadas via "className"', () => {
    const customClass = 'minha-classe-estilizada';
    const { container } = render(<InputFiltro {...defaultProps} className={customClass} />);
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  test('deve aceitar outros tipos de input (ex: password ou number)', () => {
    render(<InputFiltro {...defaultProps} type="password" />);
    const inputElement = screen.getByPlaceholderText(/digite para filtrar.../i);
    
    expect(inputElement).toHaveAttribute('type', 'password');
  });

  test('deve associar corretamente o label ao input via id', () => {
    render(<InputFiltro {...defaultProps} />);
    const inputElement = screen.getByLabelText(/filtrar nome/i);

    expect(inputElement).toBeInTheDocument();
  });

  test('deve aceitar atributos adicionais via rest props', () => {
    render(<InputFiltro {...defaultProps} disabled maxLength={10} />);
    const inputElement = screen.getByRole('textbox');
    
    expect(inputElement).toBeDisabled();
    expect(inputElement).toHaveAttribute('maxLength', '10');
  });

  test('deve renderizar sem label se não fornecido (usando queryByRole)', () => {
    render(<InputFiltro name="sem-label" value="" onChange={mockOnChange} />);
    const label = screen.queryByText(/filtrar nome/i);
    
    expect(label).not.toBeInTheDocument();
  });
});