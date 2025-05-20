import { render, screen, fireEvent } from '@testing-library/react';
import { SelectConta } from '../SelectConta';

const props = {
  handleChangeConta: jest.fn(),
  selectConta: "1",
  tiposConta: [
      { uuid: '1', nome: 'Tipo 1' },
      { uuid: '2', nome: 'Tipo 2' }
  ]
}

describe('Componente Filtros', () => {
  it('renderiza os filtros', () => {
    render(<SelectConta {...props} />);
    const inputConta = screen.getByLabelText(/Selecione o tipo de conta:/i);

    fireEvent.change(inputConta, { target: { value: '2' } });
    expect(props.handleChangeConta).toHaveBeenCalledWith('2');
  });
});