import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectMultiFiltro from '../index';

const mockData = [
  { id: 1, nome: 'Opção A' },
  { id: 2, nome: 'Opção B' },
];

describe('SelectMultiFiltro Component', () => {
  const mockOnChange = jest.fn();

  const defaultProps = {
    label: 'Filtrar Vigência',
    name: 'vigencia_paa',
    value: [],
    data: mockData,
    onChange: mockOnChange,
    placeholder: 'Selecione as informações'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('deve renderizar o label e o placeholder corretamente', () => {
    render(<SelectMultiFiltro {...defaultProps} />);
    
    expect(screen.getByText('Filtrar Vigência')).toBeInTheDocument();
    expect(screen.getByText('Selecione as informações')).toBeInTheDocument();
  });

  it('deve exibir múltiplos valores selecionados se passados via props', () => {
    render(<SelectMultiFiltro {...defaultProps} value={[1, 2]} />);
    
    expect(screen.getByText('Opção A')).toBeInTheDocument();
    expect(screen.getByText('Opção B')).toBeInTheDocument();
  });


  it('deve chamar a função onChange com os argumentos corretos ao selecionar uma opção', async () => {
    render(<SelectMultiFiltro {...defaultProps} />);

    const selectElement = screen.getByRole('combobox');
    fireEvent.mouseDown(selectElement);

    const option = await screen.findByText('Opção A');
    fireEvent.click(option);

    expect(mockOnChange).toHaveBeenCalledWith('vigencia_paa', [1]);
  });

  it('deve limpar a seleção ao clicar no botão de limpar (allowClear)', async () => {
    render(<SelectMultiFiltro {...defaultProps} value={[1]} />);
    
    const selectWrapper = screen.getByRole('combobox').closest('.ant-select');

    fireEvent.mouseEnter(selectWrapper);

    await waitFor(() => {
      const clearButton = document.querySelector('.ant-select-clear');
      expect(clearButton).toBeInTheDocument();
      fireEvent.mouseDown(clearButton);
    });

    expect(mockOnChange).toHaveBeenCalledWith('vigencia_paa', []);
  });

  it('deve filtrar as opções ignorando maiúsculas e minúsculas', async () => {
    render(<SelectMultiFiltro {...defaultProps} />);
    
    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'opção b' } });

    await waitFor(() => {
      const options = document.querySelectorAll('.ant-select-item-option-content');

      expect(options[0]).toHaveTextContent('Opção B');
    });
  });

  it('deve repassar props adicionais (...rest) para o Select, como o estado disabled', () => {
    render(<SelectMultiFiltro {...defaultProps} disabled={true} />);
    
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeDisabled();
  });

  it('não deve quebrar se a prop "data" for nula', () => {
    render(<SelectMultiFiltro {...defaultProps} data={null} />);
    
    const selectElement = screen.getByRole('combobox');
    fireEvent.mouseDown(selectElement);
    
    const options = document.querySelectorAll('.ant-select-item-option-content');
    expect(options.length).toBe(0);
  });

  it('não deve renderizar a tag label se a prop label não for fornecida', () => {
    const { queryByText } = render(<SelectMultiFiltro {...defaultProps} label={undefined} />);
    expect(queryByText('Filtrar Vigência')).not.toBeInTheDocument();
  });

  it('deve aplicar className e estilos customizados no container', () => {
    const customClass = "minha-classe-customizada";
    const customStyle = { marginTop: '20px' };
    
    const { container } = render(
      <SelectMultiFiltro 
        {...defaultProps} 
        className={customClass} 
        containerStyle={customStyle} 
      />
    );

    const divContainer = container.firstChild;
    expect(divContainer).toHaveClass(customClass);
    expect(divContainer).toHaveStyle('margin-top: 20px');
  });

  it('deve funcionar corretamente se a prop onChange não for passada (defensivo)', async () => {
    const { onChange, ...propsWithoutOnChange } = defaultProps;
    render(<SelectMultiFiltro {...propsWithoutOnChange} />);

    const selectElement = screen.getByRole('combobox');
    fireEvent.mouseDown(selectElement);

    const option = await screen.findByText('Opção A');
    
    expect(() => fireEvent.click(option)).not.toThrow();
  });
});