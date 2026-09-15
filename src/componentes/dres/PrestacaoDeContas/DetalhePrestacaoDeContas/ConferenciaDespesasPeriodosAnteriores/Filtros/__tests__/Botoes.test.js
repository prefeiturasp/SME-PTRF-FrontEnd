import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Botoes } from '../Botoes';

describe('Botoes (ConferenciaDespesasPeriodosAnteriores/Filtros)', () => {
    it('exibe "Mais Filtros" quando btnMaisFiltros é false e alterna ao clicar', () => {
        const setBtnMaisFiltros = jest.fn();
        render(<Botoes btnMaisFiltros={false} setBtnMaisFiltros={setBtnMaisFiltros} limpaFiltros={jest.fn()} handleSubmitFiltros={jest.fn()} />);

        const botao = screen.getByText('Mais Filtros');
        fireEvent.click(botao);
        expect(setBtnMaisFiltros).toHaveBeenCalledWith(true);
    });

    it('exibe "Menos filtros" quando btnMaisFiltros é true e alterna ao clicar', () => {
        const setBtnMaisFiltros = jest.fn();
        render(<Botoes btnMaisFiltros={true} setBtnMaisFiltros={setBtnMaisFiltros} limpaFiltros={jest.fn()} handleSubmitFiltros={jest.fn()} />);

        const botao = screen.getByText('Menos filtros');
        fireEvent.click(botao);
        expect(setBtnMaisFiltros).toHaveBeenCalledWith(false);
    });

    it('chama limpaFiltros ao clicar em Limpar', () => {
        const limpaFiltros = jest.fn();
        render(<Botoes btnMaisFiltros={false} setBtnMaisFiltros={jest.fn()} limpaFiltros={limpaFiltros} handleSubmitFiltros={jest.fn()} />);

        fireEvent.click(screen.getByText('Limpar'));
        expect(limpaFiltros).toHaveBeenCalledTimes(1);
    });

    it('chama handleSubmitFiltros ao clicar em Filtrar', () => {
        const handleSubmitFiltros = jest.fn();
        render(<Botoes btnMaisFiltros={false} setBtnMaisFiltros={jest.fn()} limpaFiltros={jest.fn()} handleSubmitFiltros={handleSubmitFiltros} />);

        fireEvent.click(screen.getByText('Filtrar'));
        expect(handleSubmitFiltros).toHaveBeenCalledTimes(1);
    });
});
