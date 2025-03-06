import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Filtros } from '../Filtros';

describe('Componente Filtros', () => {
    const handleChangeFiltros = jest.fn();
    const limpaFiltros = jest.fn();
    const handleSubmitFiltros = jest.fn();
    const stateFiltros = { filtrar_por_nome: '' };

    const propsFiltros = {
        stateFiltros: stateFiltros,
        handleChangeFiltros: handleChangeFiltros,
        handleSubmitFiltros: handleSubmitFiltros,
        limpaFiltros: limpaFiltros
    };

    it('Verificar elementos renderizados', () => {
        render(
            <Filtros {...propsFiltros} />
        );

        expect(screen.getByLabelText(/Filtrar por nome da ação/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /filtrar/i })).toBeInTheDocument();
    });

    it('deve chamar limpaFiltros ao clicar no botão "Limpar"', () => {
        render(
            <Filtros {...propsFiltros} />
        );
        const input = screen.getByLabelText(/Filtrar por nome da ação/i);
        fireEvent.change(input, { target: { name: 'filtrar_por_nome', value: 'Nome da acao' } });
        const botaoLimpar = screen.getByRole('button', { name: /Limpar/i });
        fireEvent.click(botaoLimpar);

        expect(handleChangeFiltros).toHaveBeenCalledTimes(1);
        expect(limpaFiltros).toHaveBeenCalledTimes(1);
    });

    it('deve chamar handleSubmitFiltros ao clicar no botão "Filtrar"', () => {
        render(
            <Filtros {...propsFiltros} />
        );
        const input = screen.getByLabelText(/Filtrar por nome da ação/i);
        fireEvent.change(input, { target: { name: 'filtrar_por_nome', value: 'Nome da acao' } });
        const botaoFiltrar = screen.getByRole('button', { name: /Filtrar/i });
        fireEvent.click(botaoFiltrar);

        expect(handleChangeFiltros).toHaveBeenCalledTimes(1);
        expect(handleSubmitFiltros).toHaveBeenCalledTimes(1);
    });
});