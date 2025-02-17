import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Filtros } from '../Filtros';

describe('Componente Filtros', () => {
    const mockHandleChangeFiltros = jest.fn();
    const mockLimpaFiltros = jest.fn();
    const initialStateFiltros = {
        filtrar_por_cnpj: '',
        filtrar_por_nome: '',
    };
    const mockPropsFiltros = {
        stateFiltros: initialStateFiltros,
        handleChangeFiltros: mockHandleChangeFiltros,
        limpaFiltros: mockLimpaFiltros,
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('testa as labels e botões', () => {
        render(
            <Filtros {...mockPropsFiltros} />
        );
        expect(screen.getByLabelText(/filtrar por cnpj/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/filtrar por razão social/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/busque por cnpj/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /filtrar/i })).toBeInTheDocument();
    });
    it('testa a reatividade ao alterar o campo de filtro', () => {
        render(
            <Filtros {...mockPropsFiltros} />
        );
        const cnpj = screen.getByLabelText(/filtrar por cnpj/i);
        const razao = screen.getByLabelText(/filtrar por razão social/i);
        fireEvent.change(cnpj, { target: { name: 'filtrar_por_cpf_cnpj', value: 'Teste' } });
        fireEvent.change(razao, { target: { name: 'filtrar_por_nome', value: 'Teste' } });
        const button = screen.getByRole('button', { name: /filtrar/i });
        fireEvent.click(button);
        expect(mockHandleChangeFiltros).toHaveBeenCalled();
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