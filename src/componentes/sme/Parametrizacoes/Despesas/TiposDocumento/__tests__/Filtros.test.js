import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Filtros } from '../Filtros'; // Ajuste o caminho conforme necessário

describe('Componente Filtros', () => {
    const mockHandleChangeFiltros = jest.fn();
    const mockHandleSubmitFiltros = jest.fn();
    const mockLimpaFiltros = jest.fn();

    const initialStateFiltros = {
        filtrar_por_nome: '',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('testa a as labels e botões', () => {
        render(
            <Filtros
                stateFiltros={initialStateFiltros}
                handleChangeFiltros={mockHandleChangeFiltros}
                handleSubmitFiltros={mockHandleSubmitFiltros}
                limpaFiltros={mockLimpaFiltros}
            />
        );

        expect(screen.getByLabelText(/filtrar por nome/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/escreva o nome do tipo/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /filtrar/i })).toBeInTheDocument();
    });

    it('testa a reatividade ao alterar o campo de filtro', () => {
        render(
            <Filtros
                stateFiltros={initialStateFiltros}
                handleChangeFiltros={mockHandleChangeFiltros}
                handleSubmitFiltros={mockHandleSubmitFiltros}
                limpaFiltros={mockLimpaFiltros}
            />
        );

        const input = screen.getByLabelText(/filtrar por nome/i);
        fireEvent.change(input, { target: { name: 'filtrar_por_nome', value: 'Teste' } });

        expect(mockHandleChangeFiltros).toHaveBeenCalledWith('filtrar_por_nome', 'Teste');
    });

    it('testa a chamada de LimpaFiltros ao clicar em Limpar', () => {
        render(
            <Filtros
                stateFiltros={initialStateFiltros}
                handleChangeFiltros={mockHandleChangeFiltros}
                handleSubmitFiltros={mockHandleSubmitFiltros}
                limpaFiltros={mockLimpaFiltros}
            />
        );

        const limparButton = screen.getByRole('button', { name: /limpar/i });
        fireEvent.click(limparButton);

        expect(mockLimpaFiltros).toHaveBeenCalledTimes(1);
    });

    it('testa a chamada de handleSubmitFiltros quanto "Filtrar" é clicado', () => {
        render(
            <Filtros
                stateFiltros={initialStateFiltros}
                handleChangeFiltros={mockHandleChangeFiltros}
                handleSubmitFiltros={mockHandleSubmitFiltros}
                limpaFiltros={mockLimpaFiltros}
            />
        );

        const filtrarButton = screen.getByRole('button', { name: /filtrar/i });
        fireEvent.click(filtrarButton);

        expect(mockHandleSubmitFiltros).toHaveBeenCalledTimes(1);
    });

});
