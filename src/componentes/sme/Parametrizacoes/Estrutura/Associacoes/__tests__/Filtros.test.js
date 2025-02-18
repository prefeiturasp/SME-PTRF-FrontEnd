import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Filtros } from '../Filtros';
import {mockTabelaAssociacoes} from "../__fixtures__/mockData";

describe('Componente Filtros', () => {
    const mockHandleChangeFiltros = jest.fn();
    const mockHandleSubmitFiltros = jest.fn();
    const mockLimpaFiltros = jest.fn();
    const mockHandleOnChangeMultipleSelectStatus = jest.fn();

    const initialStateFiltros = {
        filtrar_por_associacao: "",
        filtrar_por_dre: "",
        filtrar_por_tipo_ue: "",
        filtrar_por_informacao: []

    };

    const mockPropsFiltros = {
        stateFiltros: initialStateFiltros,
        handleChangeFiltros: mockHandleChangeFiltros,
        handleSubmitFiltros: mockHandleSubmitFiltros,
        limpaFiltros: mockLimpaFiltros,
        tabelaAssociacoes: mockTabelaAssociacoes,
        handleOnChangeMultipleSelectStatus: mockHandleOnChangeMultipleSelectStatus
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('testa a renderização dos labels e botões', () => {
        render(
            <Filtros {...mockPropsFiltros} />
        );

        expect(screen.getByLabelText(/Filtrar por associação/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Filtrar por DRE/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Filtrar pelo tipo de UE/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Filtrar por informações/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /filtrar/i })).toBeInTheDocument();
    });

    it('testa a reatividade ao alterar o campo de filtro de associação', () => {
        render(
            <Filtros {...mockPropsFiltros} />
        );

        const input = screen.getByLabelText(/Filtrar por associação/i);
        fireEvent.change(input, { target: { name: 'filtrar_por_associacao', value: 'Associação 1' } });

        expect(mockHandleChangeFiltros).toHaveBeenCalledWith('filtrar_por_associacao', 'Associação 1');
    });

    it('testa a reatividade ao alterar o campo de filtro por dre', () => {
        render(
            <Filtros {...mockPropsFiltros} />
        );

        const input = screen.getByLabelText(/Filtrar por DRE/i);
        fireEvent.change(input, { target: { name: 'filtrar_por_dre', value: '63db6f59-e32c-4f2f-8c76-29ef40b16e7d' } });

        expect(mockHandleChangeFiltros).toHaveBeenCalledWith('filtrar_por_dre', '63db6f59-e32c-4f2f-8c76-29ef40b16e7d');
    });

    it('testa a reatividade ao alterar o campo de filtro por ue', () => {
        render(
            <Filtros {...mockPropsFiltros} />
        );

        const input = screen.getByLabelText(/Filtrar pelo tipo de UE/i);
        fireEvent.change(input, { target: { name: 'filtrar_por_tipo_ue', value: 'ADM' } });

        expect(mockHandleChangeFiltros).toHaveBeenCalledWith('filtrar_por_tipo_ue', 'ADM');
    });

    it('testa a chamada de LimpaFiltros ao clicar em Limpar', () => {
        render(
            <Filtros {...mockPropsFiltros} />
        );

        const limparButton = screen.getByRole('button', { name: /limpar/i });
        fireEvent.click(limparButton);

        expect(mockLimpaFiltros).toHaveBeenCalledTimes(1);
    });

    it('testa a chamada de SubmitFiltros ao clicar em Filtrar', () => {
        render(
            <Filtros {...mockPropsFiltros} />
        );

        const limparButton = screen.getByRole('button', { name: /Filtrar/i });
        fireEvent.click(limparButton);

        expect(mockHandleSubmitFiltros).toHaveBeenCalledTimes(1);
    });
});