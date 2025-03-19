import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Filtros } from '../../AssociacoesDaAcao/FormFiltros';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

const mockEstadoFiltros = {
    filtrar_por_nome: '',
    filtro_informacoes: []
};

const mockTabelaAssociacoes = {
    filtro_informacoes: [
        { id: '1', nome: 'Informação 1' },
        { id: '2', nome: 'Informação 2' }
    ]
};

const mockMudancasFiltros = jest.fn();
const mockEnviarFiltrosAssociacao = jest.fn((e) => e.preventDefault());
const mockLimparFiltros = jest.fn();
const mockHandleOnChangeMultipleSelectStatus = jest.fn();

describe('Filtros Component', () => {
    test('renderiza corretamente', () => {
        render(
            <Filtros 
                estadoFiltros={mockEstadoFiltros}
                mudancasFiltros={mockMudancasFiltros}
                enviarFiltrosAssociacao={mockEnviarFiltrosAssociacao}
                limparFiltros={mockLimparFiltros}
                handleOnChangeMultipleSelectStatus={mockHandleOnChangeMultipleSelectStatus}
                tabelaAssociacoes={mockTabelaAssociacoes}
            />
        );
        
        expect(screen.getByLabelText(/Pesquisar unidades vinculadas à ação/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Filtrar por informações/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Filtrar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Limpar filtro/i })).toBeInTheDocument();
    });

    test('chama mudancasFiltros ao digitar no input de pesquisa', () => {
        render(
            <Filtros 
                estadoFiltros={mockEstadoFiltros}
                mudancasFiltros={mockMudancasFiltros}
                enviarFiltrosAssociacao={mockEnviarFiltrosAssociacao}
                limparFiltros={mockLimparFiltros}
                handleOnChangeMultipleSelectStatus={mockHandleOnChangeMultipleSelectStatus}
                tabelaAssociacoes={mockTabelaAssociacoes}
            />
        );
        
        const input = screen.getByLabelText(/Pesquisar unidades vinculadas à ação/i);
        userEvent.type(input, 'Teste');
        
        expect(mockMudancasFiltros).toHaveBeenCalled();
    });

    test('chama limparFiltros ao clicar no botão "Limpar filtro"', () => {
        render(
            <Filtros 
                estadoFiltros={mockEstadoFiltros}
                mudancasFiltros={mockMudancasFiltros}
                enviarFiltrosAssociacao={mockEnviarFiltrosAssociacao}
                limparFiltros={mockLimparFiltros}
                handleOnChangeMultipleSelectStatus={mockHandleOnChangeMultipleSelectStatus}
                tabelaAssociacoes={mockTabelaAssociacoes}
            />
        );

        const button = screen.getByRole('button', { name: /Limpar filtro/i });
        fireEvent.click(button);

        expect(mockLimparFiltros).toHaveBeenCalled();
    });

    test('chama enviarFiltrosAssociacao ao submeter o formulário', () => {
        render(
            <Filtros 
                estadoFiltros={mockEstadoFiltros}
                mudancasFiltros={mockMudancasFiltros}
                enviarFiltrosAssociacao={mockEnviarFiltrosAssociacao}
                limparFiltros={mockLimparFiltros}
                handleOnChangeMultipleSelectStatus={mockHandleOnChangeMultipleSelectStatus}
                tabelaAssociacoes={mockTabelaAssociacoes}
            />
        );

        const button = screen.getByRole('button', { name: /Filtrar/i });
        fireEvent.click(button);

        expect(mockEnviarFiltrosAssociacao).toHaveBeenCalled();
    });
});
