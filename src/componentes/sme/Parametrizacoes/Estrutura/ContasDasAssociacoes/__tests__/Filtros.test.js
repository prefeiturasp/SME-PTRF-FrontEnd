import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Filtros } from '../Filtros';

describe('Componente Filtros', () => {
    const mockHandleChangeFiltros = jest.fn();
    const mockHandleSubmitFiltros = jest.fn();
    const mockLimpaFiltros = jest.fn();

    const initialStateFiltros = {
        filtrar_por_associacao_nome: '',
        filtrar_por_tipo_conta: '',
        filtrar_por_status: ''

    };
    const listaTiposDeContaData = [{
        uuid: 'ba8b96ef-f05c-41f3-af10-73753490c545',
        nome: 'Tipo 1',
    },
    {
        uuid: 'ba8b96ef-f05c-41f3-af10-73753490c543',
        nome: 'Tipo 2',
    }]
    const mockPropsFiltros = {
        stateFiltros: initialStateFiltros,
        handleChangeFiltros: mockHandleChangeFiltros,
        handleSubmitFiltros: mockHandleSubmitFiltros,
        limpaFiltros: mockLimpaFiltros,
        listaTiposDeConta: listaTiposDeContaData
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('testa a renderização dos labels e botões', () => {
        render(
            <Filtros {...mockPropsFiltros} />
        );

        expect(screen.getByLabelText(/Filtrar por associação/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Filtrar por tipo de conta/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Filtrar por status/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /filtrar/i })).toBeInTheDocument();
    });

    it('testa a reatividade ao alterar o campo de filtro de associação', () => {
        render(
            <Filtros {...mockPropsFiltros} />
        );

        const input = screen.getByLabelText(/por associação/i);
        fireEvent.change(input, { target: { name: 'filtrar_por_associacao_nome', value: 'Associação 1' } });

        expect(mockHandleChangeFiltros).toHaveBeenCalledWith('filtrar_por_associacao_nome', 'Associação 1');
    });

    it('testa a reatividade ao alterar o campo de filtro de tipo de conta', () => {
        render(
            <Filtros {...mockPropsFiltros} />
        );

        const input = screen.getByLabelText(/por tipo de conta/i);
        fireEvent.change(input, { target: { name: 'filtrar_por_tipo_conta', value: 'ba8b96ef-f05c-41f3-af10-73753490c545' } });

        expect(mockHandleChangeFiltros).toHaveBeenCalledWith('filtrar_por_tipo_conta', 'ba8b96ef-f05c-41f3-af10-73753490c545');
    });

    it('testa a reatividade ao alterar o campo de filtro de status', () => {
        render(
            <Filtros {...mockPropsFiltros} />
        );

        const input = screen.getByLabelText(/por status/i);
        fireEvent.change(input, { target: { name: 'filtrar_por_status', value: 'ATIVA' } });

        expect(mockHandleChangeFiltros).toHaveBeenCalledWith('filtrar_por_status', 'ATIVA');
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