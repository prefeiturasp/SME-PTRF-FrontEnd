import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Filtros } from '../Filtros';
import { MotivosEstornoContext } from '../context/MotivosEstorno';

describe('Componente Filtros', () => {
    const mockContextValue = {
        initialFilter: {motivo: ''},
        stateFiltros: {motivo: ''},
        filtrar: jest.fn(),
        setFilter: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();

        render(
            <MotivosEstornoContext.Provider value={{...mockContextValue}}>
              <Filtros />
            </MotivosEstornoContext.Provider>
          )
    });

    it('testa a as labels e botões', () => {
        expect(screen.getByLabelText(/filtrar por nome/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/busque por motivo/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /filtrar/i })).toBeInTheDocument();
    });

    it('testa a reatividade ao alterar o campo de filtro', async () => {
        const input = screen.getByLabelText(/filtrar por nome/i);

        fireEvent.change(input, { target: { name: "motivo", value: "Teste" } });

        await waitFor(() => {
            expect(input.value).toBe("Teste");
        });
    });

    
    it('testa a chamada de LimpaFiltros ao clicar em Limpar', () => {
        const limparButton = screen.getByRole('button', { name: /limpar/i });
        fireEvent.click(limparButton);

        expect(mockContextValue.setFilter).toHaveBeenCalledWith(mockContextValue.initialFilter)
    });

    it('testa a chamada de Filtrar ao clicar em Filtrar', () => {
        const input = screen.getByLabelText(/filtrar por nome/i);
        fireEvent.change(input, { target: { name: "motivo", value: "Teste" } });

        const button = screen.getByRole('button', { name: /filtrar/i });
        fireEvent.click(button);

        expect(mockContextValue.setFilter).toHaveBeenCalledWith({ motivo: "Teste" });
    });
});
