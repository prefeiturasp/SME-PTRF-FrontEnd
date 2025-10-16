import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Filtros } from '../Filtros';
import { ObjetivosPaaContext } from '../context/index';
import '@testing-library/jest-dom';

const mockSetFilter = jest.fn();
const mockSetCurrentPage = jest.fn();
const mockSetFirstPage = jest.fn();

const initialFilter = { nome: '' };

const context = {
  setFilter: mockSetFilter,
  initialFilter,
  setCurrentPage: mockSetCurrentPage,
  setFirstPage: mockSetFirstPage,
}
describe('Filtros', () => {

  const renderComponent = () => {
    return render(
      <ObjetivosPaaContext.Provider value={context}>
        <Filtros />
      </ObjetivosPaaContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve renderizar os elementos corretamente', () => {
    renderComponent();

    expect(screen.getByLabelText('Filtrar por nome do objetivo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite o nome do objetivo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Limpar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Filtrar' })).toBeInTheDocument();
  });

  test('Deve atualizar o estado do filtro quando o input muda', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Digite o nome do objetivo');
    fireEvent.change(input, { target: { name: 'nome', value: 'Teste' } });
    expect(input).toHaveValue('Teste');
  });

  test('Deve chamar setFilter, setCurrentPage e setFirstPage com os valores corretos quando o botão "Filtrar" é clicado', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Digite o nome do objetivo');
    fireEvent.change(input, { target: { name: 'nome', value: 'Teste' } });

    const filtrarButton = screen.getByRole('button', { name: 'Filtrar' });
    fireEvent.click(filtrarButton);

    expect(mockSetFilter).toHaveBeenCalledTimes(1);
    expect(mockSetFilter).toHaveBeenCalledWith({ nome: 'Teste' });
    expect(mockSetCurrentPage).toHaveBeenCalledTimes(1);
    expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
    expect(mockSetFirstPage).toHaveBeenCalledTimes(1);
    expect(mockSetFirstPage).toHaveBeenCalledWith(0);
  });

  test('Deve chamar setFilter, setCurrentPage e setFirstPage com o valor inicial quando o botão "Limpar" é clicado', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Digite o nome do objetivo');
    fireEvent.change(input, { target: { name: 'nome', value: 'Teste' } });

    const limparButton = screen.getByRole('button', { name: 'Limpar' });
    fireEvent.click(limparButton);

    expect(mockSetFilter).toHaveBeenCalled();
    expect(mockSetFilter).toHaveBeenCalledWith(initialFilter);
    expect(mockSetCurrentPage).toHaveBeenCalled();
    expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
    expect(mockSetFirstPage).toHaveBeenCalled();
    expect(mockSetFirstPage).toHaveBeenCalledWith(0);
    expect(input.value).toBe("");
  });

});
