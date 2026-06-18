import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Filtros } from '../Filtros';
import { tabelas, mockSelectAcoes } from '../__fixtures__/mockData';

jest.mock('../hooks/useAcoesDasAssociacoesContext', () => ({
  useAcoesDasAssociacoesContext: jest.fn(),
}));

jest.mock('../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext', () => ({
  useAbasPorRecursoContext: jest.fn(),
}));

const mockUseAcoesContext = require('../hooks/useAcoesDasAssociacoesContext').useAcoesDasAssociacoesContext;
const mockUseAbasContext = require('../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext').useAbasPorRecursoContext;

describe('Componente Filtros', () => {
    const mockSetFilters = jest.fn();

    const initialFilters = {
        page: 1,
        is_required_recurso_uuid: true,
        recurso_uuid: '',
        filtrar_por_nome_cod_eol: '',
        filtrar_por_acao: '',
        filtrar_por_status: '',
        filtro_informacoes: [],
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseAbasContext.mockReturnValue({ selectedRecurso: { uuid: 'r1' } });

        mockUseAcoesContext.mockReturnValue({
            setFilters: mockSetFilters,
            initialFilters,
            tabelaAssociacoes: tabelas,
            isLoadingTabela: false,
            listaTiposDeAcao: mockSelectAcoes,
            isLoadingTiposDeAcao: false,
        });
    });

    it('testa as labels e botões', () => {
        render(
            <Filtros />
        );

        expect(screen.getByLabelText(/Filtrar por nome ou código EOL/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /filtrar/i })).toBeInTheDocument();
    });

    it('testa a reatividade ao alterar o campo de filtro', async () => {
        render(
            <Filtros />
        );

        const input = screen.getByLabelText(/Filtrar por nome ou código EOL/i);
        fireEvent.change(input, { target: { value: 'Teste' } });

        await waitFor(() => {
            expect(input.value).toBe('Teste');
        });
    });

    it('testa a chamada de limpar Filtros ao clicar em Limpar', async () => {
        render(
            <Filtros />
        );

        const input = screen.getByLabelText(/Filtrar por nome ou código EOL/i);
        fireEvent.change(input, { target: { value: 'Valor' } });

        const limparButton = screen.getByRole('button', { name: /limpar/i });
        fireEvent.click(limparButton);

        await waitFor(() => {
            expect(mockSetFilters).toHaveBeenCalled();
            expect(input.value).toBe('');
        });
    });
});
