import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Filtros } from '../Filtros';
import { tabelas } from '../__fixtures__/mockData';


describe('Componente Filtros', () => {
    const mockHandleChangeFiltros = jest.fn();
    const mockHandleSubmitFiltros = jest.fn();
    const mockLimpaFiltros = jest.fn();

    const initialStateFiltros = {
        filtrar_por_nome_cod_eol: '',
        filtro_informacoes: []
    };
    const mockPropsFiltros = {
        stateFiltros: initialStateFiltros,
        handleChangeFiltros: mockHandleChangeFiltros,
        handleSubmitFiltros: mockHandleSubmitFiltros,
        limpaFiltros: mockLimpaFiltros,
        tabelaAssociacoes: tabelas
    };


    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('testa a as labels e botões', () => {
        render(
            <Filtros {...mockPropsFiltros} />
        );

        expect(screen.getByLabelText(/Filtrar por nome ou código EOL/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /filtrar/i })).toBeInTheDocument();
    });

    it('testa a reatividade ao alterar o campo de filtro', () => {
        render(
            <Filtros {...mockPropsFiltros} />
        );

        const input = screen.getByLabelText(/Filtrar por nome ou código EOL/i);
        fireEvent.change(input, { target: { name: 'filtrar_por_nome_cod_eol', value: 'Teste' } });

        expect(mockHandleChangeFiltros).toHaveBeenCalledWith('filtrar_por_nome_cod_eol', 'Teste');
    });

    it('testa a chamada de LimpaFiltros ao clicar em Limpar', () => {
        render(
            <Filtros {...mockPropsFiltros} />
        );

        const limparButton = screen.getByRole('button', { name: /limpar/i });
        fireEvent.click(limparButton);

        expect(mockLimpaFiltros).toHaveBeenCalledTimes(1);
    });
});
