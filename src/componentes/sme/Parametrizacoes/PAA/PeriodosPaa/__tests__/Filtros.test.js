import React from 'react';
import { render, screen, fireEvent, userEvent } from '@testing-library/react';
import { Filtros } from '../Filtros';
import { PeriodosPaaContext } from '../context/index';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockSetFilter = jest.fn();
const mockSetCurrentPage = jest.fn();
const mockSetFirstPage = jest.fn();

const initialFilter = { referencia: '' };

const context = {
  setFilter: mockSetFilter,
  initialFilter,
  setCurrentPage: mockSetCurrentPage,
  setFirstPage: mockSetFirstPage,
}
describe('Filtros', () => {

  const renderComponent = () => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <PeriodosPaaContext.Provider value={context}>
          <Filtros />
        </PeriodosPaaContext.Provider>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  test('Deve renderizar os elementos corretamente', () => {
    renderComponent();

    expect(screen.getByLabelText('Filtrar por referência')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar por referência')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Limpar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Filtrar' })).toBeInTheDocument();
  });

  test('Deve atualizar o estado do filtro quando o input muda', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Buscar por referência');
    fireEvent.change(input, { target: { name: 'referencia', value: 'Teste' } });
    expect(input).toHaveValue('Teste');
  });

  test('Deve chamar setFilter, setCurrentPage e setFirstPage com os valores corretos quando o botão "Filtrar" é clicado', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Buscar por referência');
    fireEvent.change(input, { target: { name: 'referencia', value: 'Teste' } });

    const filtrarButton = screen.getByRole('button', { name: 'Filtrar' });
    fireEvent.click(filtrarButton);

    expect(mockSetFilter).toHaveBeenCalledTimes(1);
    expect(mockSetFilter).toHaveBeenCalledWith({ referencia: 'Teste' });
    expect(mockSetCurrentPage).toHaveBeenCalledTimes(1);
    expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
    expect(mockSetFirstPage).toHaveBeenCalledTimes(1);
    expect(mockSetFirstPage).toHaveBeenCalledWith(0);
  });

  test('Deve chamar setFilter, setCurrentPage e setFirstPage com o valor inicial quando o botão "Limpar" é clicado', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Buscar por referência');
    fireEvent.change(input, { target: { name: 'referencia', value: 'Teste' } });

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
