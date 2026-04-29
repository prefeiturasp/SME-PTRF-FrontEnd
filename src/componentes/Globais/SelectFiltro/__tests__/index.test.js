import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectFiltro from '../index';

const mockData = [
  { id: 1, nome: 'Opção A' },
  { id: 2, nome: 'Opção B' },
];

describe('SelectFiltro Component', () => {
  const mockOnChange = jest.fn();

  const defaultProps = {
    label: 'Filtrar Unidade',
    name: 'unidade',
    value: undefined,
    data: mockData,
    onChange: mockOnChange,
    placeholder: 'Selecione'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o label e o placeholder corretamente', () => {
    render(<SelectFiltro {...defaultProps} />);
    
    expect(screen.getByText('Filtrar Unidade')).toBeInTheDocument();
    expect(screen.getByText('Selecione')).toBeInTheDocument();
  });

  it('deve exibir o valor selecionado quando passado via props', () => {
    render(<SelectFiltro {...defaultProps} value={1} />);
    
    expect(screen.getByText('Opção A')).toBeInTheDocument();
  });

  it('deve chamar onChange com os argumentos corretos ao selecionar uma opção', async () => {
    render(<SelectFiltro {...defaultProps} />);

    const selectElement = screen.getByRole('combobox');
    fireEvent.mouseDown(selectElement);

    const option = await screen.findByText('Opção A');
    fireEvent.click(option);

    expect(mockOnChange).toHaveBeenCalledWith('unidade', 1);
  });

  it('deve limpar a seleção ao clicar no botão clear (allowClear)', async () => {
    render(<SelectFiltro {...defaultProps} value={1} allowClear />);

    const selectWrapper = screen.getByRole('combobox').closest('.ant-select');

    fireEvent.mouseEnter(selectWrapper);

    await waitFor(() => {
      const clearButton = document.querySelector('.ant-select-clear');
      expect(clearButton).toBeInTheDocument();
      fireEvent.mouseDown(clearButton);
    });

    const valor = mockOnChange.mock.calls[0][1];
    expect([undefined, null]).toContain(valor);
  });

  it('deve renderizar opções corretamente ao abrir o dropdown', async () => {
    render(<SelectFiltro {...defaultProps} />);

    const selectElement = screen.getByRole('combobox');
    fireEvent.mouseDown(selectElement);

    const optionA = await screen.findByText('Opção A');
    const optionB = await screen.findByText('Opção B');

    expect(optionA).toBeInTheDocument();
    expect(optionB).toBeInTheDocument();
  });

  it('deve repassar props adicionais (...rest) como disabled', () => {
    render(<SelectFiltro {...defaultProps} disabled />);

    const selectWrapper = screen.getByRole('combobox').closest('.ant-select');

    expect(selectWrapper).toHaveClass('ant-select-disabled');
  });

  it('não deve quebrar se data for null', async () => {
    render(<SelectFiltro {...defaultProps} data={null} />);

    const selectElement = screen.getByRole('combobox');
    fireEvent.mouseDown(selectElement);

    await waitFor(() => {
      const options = document.querySelectorAll('.ant-select-item-option-content');
      expect(options.length).toBe(1);
    });
  });

  it('deve usar optionValue e optionLabel customizados', async () => {
    const customData = [
      { codigo: 'A', descricao: 'Item A' },
      { codigo: 'B', descricao: 'Item B' }
    ];

    render(
      <SelectFiltro
        {...defaultProps}
        data={customData}
        optionValue="codigo"
        optionLabel="descricao"
      />
    );

    const selectElement = screen.getByRole('combobox');
    fireEvent.mouseDown(selectElement);

    const optionA = await screen.findByText('Item A');
    const optionB = await screen.findByText('Item B');

    expect(optionA).toBeInTheDocument();
    expect(optionB).toBeInTheDocument();
  });

  it('deve exibir e permitir selecionar a opção fixa "Selecione um tipo"', async () => {
    render(<SelectFiltro {...defaultProps} />);

    const selectElement = screen.getByRole('combobox');
    fireEvent.mouseDown(selectElement);

    const defaultOption = await screen.findByText('Selecione um tipo');
    expect(defaultOption).toBeInTheDocument();

    fireEvent.click(defaultOption);
    expect(mockOnChange).toHaveBeenCalledWith('unidade', "");
  });

  it('deve filtrar as opções ignorando maiúsculas e minúsculas', async () => {
    render(<SelectFiltro {...defaultProps} />);
    
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'opção a' } });

    await waitFor(() => {
      expect(screen.getByText('Opção A')).toBeInTheDocument();
      expect(screen.queryByText('Opção B')).not.toBeInTheDocument();
    });
  });

  it('deve aplicar a className customizada no container pai', () => {
    const { container } = render(<SelectFiltro {...defaultProps} className="classe-teste" />);
    expect(container.firstChild).toHaveClass('classe-teste');
  });
});