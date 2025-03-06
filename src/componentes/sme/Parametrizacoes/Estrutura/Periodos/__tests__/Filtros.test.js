import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Filtros } from '../Filtros';

describe('Filtros', () => {
    const propsMock = {
        stateFiltros: {filtrar_por_referencia: ''},
        handleChangeFiltros: jest.fn(),
        handleSubmitFiltros: jest.fn(),
        limpaFiltros: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();

        render(
            <Filtros {...propsMock}/>
          )
    });

    it('testa a as labels e botões', () => {
        expect(screen.getByLabelText(/Pesquisar/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Busque por referência/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /filtrar/i })).toBeInTheDocument();
    });

    it('testa a reatividade ao alterar o campo de filtro', async () => {
        const input = screen.getByLabelText(/Pesquisar/i);
        fireEvent.change(input, { target: { name: "filtrar_por_referencia", value: "2025.1" } });
        
        expect(propsMock.handleChangeFiltros).toHaveBeenCalled()
    });

    it('testa a chamada de LimpaFiltros ao clicar em Limpar', () => {
        const limparButton = screen.getByRole('button', { name: /limpar/i });
        fireEvent.click(limparButton);

        expect(propsMock.limpaFiltros).toHaveBeenCalled()
    });

    it('testa a chamada de Filtrar ao clicar em Filtrar', () => {
        const input = screen.getByLabelText(/Pesquisar/i);
        fireEvent.change(input, { target: { name: "filtrar_por_referencia", value: "Teste" } });

        const button = screen.getByRole('button', { name: /filtrar/i });
        fireEvent.click(button);

        expect(propsMock.handleSubmitFiltros).toHaveBeenCalled();
    });
});
