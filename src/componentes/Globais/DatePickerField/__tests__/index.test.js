import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DatePickerField } from '../index';
import '@testing-library/jest-dom';
import moment from 'moment';

jest.mock('react-datepicker', () => {
  const MockDatePicker = function MockDatePicker({ selected, onChange, placeholderText, disabled }) {
    const formatDate = (date) => {
      if (!date) return '';
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };
    
    return (
      <input
        data-testid="datepicker"
        value={formatDate(selected)}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholderText}
        disabled={disabled}
      />
    );
  };
  
  MockDatePicker.registerLocale = jest.fn();
  
  return {
    __esModule: true,
    default: MockDatePicker,
    registerLocale: jest.fn()
  };
});

jest.mock('react-text-mask', () => ({
  __esModule: true,
  default: ({ children, ...props }) => <div {...props}>{children}</div>
}));

describe('DatePickerField', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o componente', () => {
    render(<DatePickerField name="data" onChange={mockOnChange} />);
    expect(screen.getByTestId('datepicker')).toBeInTheDocument();
  });

  it('deve parsear data no formato YYYY-MM-DD corretamente', () => {
    const { container } = render(
      <DatePickerField name="data" value="2024-03-15" onChange={mockOnChange} />
    );
    const input = screen.getByTestId('datepicker');
    expect(input.value).toBe('15/03/2024');
  });

  it('deve retornar null para data inválida', () => {
    const { container } = render(
      <DatePickerField name="data" value="data-invalida" onChange={mockOnChange} />
    );
    const input = screen.getByTestId('datepicker');
    expect(input.value).toBe('');
  });

  it('deve estar desabilitado quando disabled é true', () => {
    render(<DatePickerField name="data" disabled={true} onChange={mockOnChange} />);
    expect(screen.getByTestId('datepicker')).toBeDisabled();
  });

  it('deve usar placeholder customizado quando fornecido', () => {
    render(
      <DatePickerField
        name="data"
        placeholderText="Selecione uma data"
        onChange={mockOnChange}
      />
    );
    expect(screen.getByPlaceholderText('Selecione uma data')).toBeInTheDocument();
  });
});

