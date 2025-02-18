import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Filtros } from '../Filtros';

describe('Componente Filtros', () => {
    const mockHandleChangeFiltros = jest.fn();
    const mockHandleSubmitFiltros = jest.fn();
    const mockLimpaFiltros = jest.fn();

    const initialStateFiltros = {
        filtrar_por_nome: '',
        filtrar_por_status: ''
    };
    const mockPropsFiltros = {
        stateFiltros: initialStateFiltros,
        handleChangeFiltros: mockHandleChangeFiltros,
        handleSubmitFiltros: mockHandleSubmitFiltros,
        limpaFiltros: mockLimpaFiltros,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Testa a as labels e botões', () => {
        render(
            <Filtros {...mockPropsFiltros} />
        );

        expect(screen.getByLabelText(/filtrar por etiqueta\/tag/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/filtrar por status/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/escreva o nome da etiqueta\/tag/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/escreva o nome da etiqueta\/tag/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /filtrar/i })).toBeInTheDocument();
    });

    it('Testa a reatividade ao alterar o campo de filtro', () => {
        render(
            <Filtros {...mockPropsFiltros} />
        );

        const input = screen.getByLabelText(/filtrar por etiqueta\/tag/i);
        fireEvent.change(input, { target: { name: 'filtrar_por_nome', value: 'Teste' } });

        expect(mockHandleChangeFiltros).toHaveBeenCalledWith('filtrar_por_nome', 'Teste');
    });

    it('Testa a chamada de LimpaFiltros ao clicar em Limpar', () => {
        render(
            <Filtros {...mockPropsFiltros} />
        );

        const limparButton = screen.getByRole('button', { name: /limpar/i });
        fireEvent.click(limparButton);

        expect(mockLimpaFiltros).toHaveBeenCalledTimes(1);
    });
});
