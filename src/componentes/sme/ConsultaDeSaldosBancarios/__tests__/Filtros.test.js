import { render, screen, fireEvent } from '@testing-library/react';
import { Filtros } from '../Filtros';

const props = {
  stateFiltros: {
    filtrar_por_unidade: '',
    filtrar_por_tipo_ue: ''
  },
  handleChangeFiltros: jest.fn(),
  handleSubmitFiltros: jest.fn(),
  tabelaAssociacoes: {
    tipos_unidade: [
      { id: '1', nome: 'Tipo 1' },
      { id: '2', nome: 'Tipo 2' }
    ]
  }
}

describe('Componente Filtros', () => {
  it('renderiza os filtros', () => {
    render(<Filtros {...props} />);
    const inputAssociacao = screen.getByLabelText(/Filtrar por associação/i);
    const selectTipoUE = screen.getByLabelText(/Filtrar pelo tipo de UE/i);
    const buttonFiltrar = screen.getByRole('button', { name: /Filtrar/i });

    fireEvent.change(inputAssociacao, { target: { value: 'Teste' } });
    expect(props.handleChangeFiltros).toHaveBeenCalledWith('filtrar_por_associacao', 'Teste');
    fireEvent.change(selectTipoUE, { target: { value: '1' } });
    expect(props.handleChangeFiltros).toHaveBeenCalledWith('filtrar_por_tipo_ue', '1');
    fireEvent.click(buttonFiltrar);
    expect(props.handleSubmitFiltros).toHaveBeenCalled();
  });
});