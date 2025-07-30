import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalPrevia } from '../ModalGerarPrevia';

// Mock do DatePickerField
jest.mock('../../../Globais/DatePickerField', () => ({
  DatePickerField: ({ value, onChange, ...props }) => (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange?.(e)}
      {...props}
    />
  ),
}));

describe('ModalPrevia', () => {
  const defaultProps = {
    show: true,
    onHide: jest.fn(),
    titulo: 'Gerar Documento',
    data_inicio: '2025-07-01',
    data_fim: '2025-07-29',
    handleChange: jest.fn(),
    mensagemErro: '',
    primeiroBotaoOnclick: jest.fn(),
    dataQa: 'teste',
  };

  it('exibe o título e os campos de data corretamente', () => {
    render(<ModalPrevia {...defaultProps} />);
    
    expect(screen.getByText(/Gerar Documento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data Inicial/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data final/i)).toBeInTheDocument();
  });

  it('chama onHide ao clicar no botão Cancelar', () => {
    render(<ModalPrevia {...defaultProps} />);
    
    const btnCancelar = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(btnCancelar);

    expect(defaultProps.onHide).toHaveBeenCalled();
  });

  it('chama primeiroBotaoOnclick ao clicar no botão Gerar Prévia', () => {
    render(<ModalPrevia {...defaultProps} />);
    
    const btnGerar = screen.getByRole('button', { name: /Gerar Prévia/i });
    fireEvent.click(btnGerar);

    expect(defaultProps.primeiroBotaoOnclick).toHaveBeenCalled();
  });

  it('desabilita o botão Gerar Prévia se data_inicio ou data_fim estiverem vazios', () => {
    const { rerender } = render(
      <ModalPrevia {...defaultProps} data_inicio={null} />
    );

    expect(screen.getByRole('button', { name: /Gerar Prévia/i })).toBeDisabled();

    rerender(<ModalPrevia {...defaultProps} data_fim={null} />);
    expect(screen.getByRole('button', { name: /Gerar Prévia/i })).toBeDisabled();
  });

  it('exibe a mensagem de erro se mensagemErro for passada', () => {
    render(<ModalPrevia {...defaultProps} mensagemErro="Data inválida" />);

    expect(screen.getByText(/Data inválida/i)).toBeInTheDocument();
  });
});
