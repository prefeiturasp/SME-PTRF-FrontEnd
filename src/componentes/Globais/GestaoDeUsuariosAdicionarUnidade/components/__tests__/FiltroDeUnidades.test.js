import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FiltroDeUnidades } from '../FiltroDeUnidades';
import { GestaoDeUsuariosAdicionarUnidadeContext } from '../../context/GestaoUsuariosAdicionarUnidadeProvider';

const buildWrapper = (contextValue) => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

    return ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <GestaoDeUsuariosAdicionarUnidadeContext.Provider value={contextValue}>
                {children}
            </GestaoDeUsuariosAdicionarUnidadeContext.Provider>
        </QueryClientProvider>
    );
};

const buildContext = (overrides = {}) => ({
    search: '',
    setSearch: jest.fn(),
    submitFiltro: false,
    setSubmitFiltro: jest.fn(),
    currentPage: 1,
    setCurrentPage: jest.fn(),
    firstPage: 1,
    setFirstPage: jest.fn(),
    ...overrides,
});

describe('FiltroDeUnidades', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o campo de busca', () => {
        const ctx = buildContext();
        render(<FiltroDeUnidades />, { wrapper: buildWrapper(ctx) });
        expect(screen.getByPlaceholderText(/escreva o nome ou código/i)).toBeInTheDocument();
    });

    it('deve renderizar os botões "Limpar" e "Filtrar"', () => {
        const ctx = buildContext();
        render(<FiltroDeUnidades />, { wrapper: buildWrapper(ctx) });
        expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /filtrar/i })).toBeInTheDocument();
    });

    it('deve chamar setSearch e setSubmitFiltro(false) ao digitar no campo', () => {
        const ctx = buildContext();
        render(<FiltroDeUnidades />, { wrapper: buildWrapper(ctx) });

        fireEvent.change(screen.getByPlaceholderText(/escreva o nome ou código/i), {
            target: { value: 'EMEF' },
        });

        expect(ctx.setSearch).toHaveBeenCalledWith('EMEF');
        expect(ctx.setSubmitFiltro).toHaveBeenCalledWith(false);
    });

    it('deve chamar setFirstPage, setCurrentPage e setSubmitFiltro(true) ao submeter com search preenchido', () => {
        const ctx = buildContext({ search: 'EMEF São Paulo' });
        render(<FiltroDeUnidades />, { wrapper: buildWrapper(ctx) });

        fireEvent.submit(screen.getByRole('button', { name: /filtrar/i }).closest('form'));

        expect(ctx.setFirstPage).toHaveBeenCalledWith(1);
        expect(ctx.setCurrentPage).toHaveBeenCalledWith(1);
        expect(ctx.setSubmitFiltro).toHaveBeenCalledWith(true);
    });

    it('não deve chamar setSubmitFiltro ao submeter com search vazio', () => {
        const ctx = buildContext({ search: '' });
        render(<FiltroDeUnidades />, { wrapper: buildWrapper(ctx) });

        fireEvent.submit(screen.getByRole('button', { name: /filtrar/i }).closest('form'));

        expect(ctx.setSubmitFiltro).not.toHaveBeenCalled();
    });

    it('deve chamar setSearch("") ao clicar em "Limpar"', () => {
        const ctx = buildContext({ search: 'algo' });
        render(<FiltroDeUnidades />, { wrapper: buildWrapper(ctx) });

        fireEvent.click(screen.getByRole('button', { name: /limpar/i }));

        expect(ctx.setSearch).toHaveBeenCalledWith('');
    });

    it('deve zerar count e results da query cache ao limpar quando dados existem', () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });

        const cachedData = { count: 5, results: [{ uuid: '1' }] };
        queryClient.setQueryData(['unidades-disponiveis-inclusao', 1], cachedData);

        const ctx = buildContext({ search: 'algo' });

        const wrapper = ({ children }) => (
            <QueryClientProvider client={queryClient}>
                <GestaoDeUsuariosAdicionarUnidadeContext.Provider value={ctx}>
                    {children}
                </GestaoDeUsuariosAdicionarUnidadeContext.Provider>
            </QueryClientProvider>
        );

        render(<FiltroDeUnidades />, { wrapper });
        fireEvent.click(screen.getByRole('button', { name: /limpar/i }));

        expect(cachedData.count).toBe(0);
        expect(cachedData.results).toEqual([]);
    });

    it('não deve falhar ao limpar quando não há dados em cache', () => {
        const ctx = buildContext({ search: 'algo', currentPage: 99 });
        render(<FiltroDeUnidades />, { wrapper: buildWrapper(ctx) });

        expect(() => {
            fireEvent.click(screen.getByRole('button', { name: /limpar/i }));
        }).not.toThrow();
    });
});
