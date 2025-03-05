import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Filtros } from '../components/Filtros';
import { MotivosAprovacaoPcRessalvaContext } from '../context/MotivosAprovacaoPcRessalva';
import '@testing-library/jest-dom';

describe('Filtros', () => {
  const mockSetFilter = jest.fn();
  const mockSetCurrentPage = jest.fn();
  const mockSetFirstPage = jest.fn();
  const initialFilter = { motivo: '' };

  const renderComponent = () => {
    return render(
      <MotivosAprovacaoPcRessalvaContext.Provider
        value={{
          setFilter: mockSetFilter,
          initialFilter,
          setCurrentPage: mockSetCurrentPage,
          setFirstPage: mockSetFirstPage,
        }}
      >
        <Filtros />
      </MotivosAprovacaoPcRessalvaContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve renderizar os elementos corretamente', () => {
    renderComponent();

    expect(screen.getByLabelText('Filtrar por motivo de aprovação de PC com ressalvas')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Busque por motivo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Limpar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Filtrar' })).toBeInTheDocument();
  });

  test('Deve atualizar o estado do filtro quando o input muda', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Busque por motivo');
    fireEvent.change(input, { target: { name: 'motivo', value: 'Teste' } });
    expect(input.value).toBe('Teste');
  });

  test('Deve chamar setFilter, setCurrentPage e setFirstPage com os valores corretos quando o botão "Filtrar" é clicado', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Busque por motivo');
    fireEvent.change(input, { target: { name: 'motivo', value: 'Teste' } });

    const filtrarButton = screen.getByRole('button', { name: 'Filtrar' });
    fireEvent.click(filtrarButton);

    expect(mockSetFilter).toHaveBeenCalledTimes(1);
    expect(mockSetFilter).toHaveBeenCalledWith({ motivo: 'Teste' });
    expect(mockSetCurrentPage).toHaveBeenCalledTimes(1);
    expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
    expect(mockSetFirstPage).toHaveBeenCalledTimes(1);
    expect(mockSetFirstPage).toHaveBeenCalledWith(0);
  });

  test('Deve chamar setFilter, setCurrentPage e setFirstPage com o valor inicial quando o botão "Limpar" é clicado', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Busque por motivo');
    fireEvent.change(input, { target: { name: 'motivo', value: 'Teste' } });

    const limparButton = screen.getByRole('button', { name: 'Limpar' });
    fireEvent.click(limparButton);

    expect(mockSetFilter).toHaveBeenCalledTimes(1);
    expect(mockSetFilter).toHaveBeenCalledWith(initialFilter);
    expect(mockSetCurrentPage).toHaveBeenCalledTimes(1);
    expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
    expect(mockSetFirstPage).toHaveBeenCalledTimes(1);
    expect(mockSetFirstPage).toHaveBeenCalledWith(0);
    expect(input.value).toBe("");
  });

  test("Verifica se as classes estão corretas", () => {
        renderComponent()
        const divPrincipal = screen.getByRole('button', { name: 'Filtrar' }).parentElement.parentElement
        const input = screen.getByPlaceholderText('Busque por motivo')
        const form = input.parentElement

        expect(divPrincipal).toHaveClass('d-flex')
        expect(divPrincipal).toHaveClass('bd-highlight')
        expect(divPrincipal).toHaveClass('align-items-end')
        expect(divPrincipal).toHaveClass('mt-2')

        expect(form).toBeInTheDocument()
        expect(form).toBeInstanceOf(HTMLFormElement)

        expect(input).toHaveClass('form-control')
  })
});
