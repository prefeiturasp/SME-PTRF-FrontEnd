import { render, screen, fireEvent } from '@testing-library/react';
import { SelectPeriodo } from '../SelectPeriodo';

const props = {
  handleChangePeriodo: jest.fn(),
  selectConta: "1",
  exibeDataPT_BR: jest.fn(),
  periodosAssociacao: [
      { uuid: '1', referencia: 'Referencia 1', data_inicio_realizacao_despesas: '20253-01-01', data_fim_realizacao_despesas: '2025-01-31' },
      { uuid: '2', referencia: 'Referencia 2', data_inicio_realizacao_despesas: '2025-02-01', data_fim_realizacao_despesas: '2025-02-28' }
  ]
}

describe('Componente Select Priodo', () => {
  it('renderiza os selects', () => {
    render(<SelectPeriodo {...props} />);
    const inputConta = screen.getByLabelText(/Selecione o período:/i);

    fireEvent.change(inputConta, { target: { value: '2' } });
    expect(props.handleChangePeriodo).toHaveBeenCalledWith('2');
  });
});