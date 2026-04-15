import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Paginacao } from '../Paginacao';
import { GestaoDeUsuariosAdicionarUnidadeContext } from '../../context/GestaoUsuariosAdicionarUnidadeProvider';

jest.mock('primereact/paginator', () => ({
    Paginator: ({ onPageChange, first, rows, totalRecords }) => (
        <button
            data-testid="paginator"
            data-first={first}
            data-rows={rows}
            data-total={totalRecords}
            onClick={() => onPageChange({ page: 1, first: 10 })}
        >
            Paginator
        </button>
    ),
}));

const buildWrapper = (contextValue) => ({ children }) => (
    <GestaoDeUsuariosAdicionarUnidadeContext.Provider value={contextValue}>
        {children}
    </GestaoDeUsuariosAdicionarUnidadeContext.Provider>
);

const buildContext = (overrides = {}) => ({
    search: '',
    setSearch: jest.fn(),
    submitFiltro: false,
    setSubmitFiltro: jest.fn(),
    currentPage: 1,
    setCurrentPage: jest.fn(),
    firstPage: 0,
    setFirstPage: jest.fn(),
    showModalLegendaInformacao: false,
    setShowModalLegendaInformacao: jest.fn(),
    ...overrides,
});

describe('Paginacao', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o Paginator com o total correto', () => {
        const ctx = buildContext({ firstPage: 0 });
        render(<Paginacao count={50} />, { wrapper: buildWrapper(ctx) });

        const paginator = screen.getByTestId('paginator');
        expect(paginator).toBeInTheDocument();
        expect(paginator).toHaveAttribute('data-total', '50');
    });

    it('deve passar firstPage do contexto ao Paginator', () => {
        const ctx = buildContext({ firstPage: 10 });
        render(<Paginacao count={50} />, { wrapper: buildWrapper(ctx) });

        expect(screen.getByTestId('paginator')).toHaveAttribute('data-first', '10');
    });

    it('deve passar rows=10 ao Paginator', () => {
        const ctx = buildContext();
        render(<Paginacao count={30} />, { wrapper: buildWrapper(ctx) });

        expect(screen.getByTestId('paginator')).toHaveAttribute('data-rows', '10');
    });

    it('deve chamar setCurrentPage(page + 1) ao mudar de página', () => {
        const ctx = buildContext();
        render(<Paginacao count={30} />, { wrapper: buildWrapper(ctx) });

        fireEvent.click(screen.getByTestId('paginator'));

        // page=1 → setCurrentPage(2)
        expect(ctx.setCurrentPage).toHaveBeenCalledWith(2);
    });

    it('deve chamar setFirstPage com event.first ao mudar de página', () => {
        const ctx = buildContext();
        render(<Paginacao count={30} />, { wrapper: buildWrapper(ctx) });

        fireEvent.click(screen.getByTestId('paginator'));

        expect(ctx.setFirstPage).toHaveBeenCalledWith(10);
    });

    it('deve renderizar dentro do wrapper com data-qa correto', () => {
        const ctx = buildContext();
        const { container } = render(<Paginacao count={20} />, { wrapper: buildWrapper(ctx) });

        expect(container.querySelector('[data-qa="paginacao-composicao"]')).toBeInTheDocument();
    });
});
