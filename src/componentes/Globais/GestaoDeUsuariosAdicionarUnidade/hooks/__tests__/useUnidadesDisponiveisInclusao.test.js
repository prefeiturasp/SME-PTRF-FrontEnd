import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUnidadesDisponiveisInclusao } from '../useUnidadesDisponiveisInclusao';
import { GestaoDeUsuariosAdicionarUnidadeContext } from '../../context/GestaoUsuariosAdicionarUnidadeProvider';
import { getUnidadesDisponiveisInclusao } from '../../../../../services/GestaoDeUsuarios.service';

jest.mock('../../../../../services/GestaoDeUsuarios.service', () => ({
    getUnidadesDisponiveisInclusao: jest.fn(),
}));

const buildContext = (overrides = {}) => ({
    search: '',
    submitFiltro: false,
    currentPage: 1,
    setSearch: jest.fn(),
    setSubmitFiltro: jest.fn(),
    setCurrentPage: jest.fn(),
    firstPage: 1,
    setFirstPage: jest.fn(),
    showModalLegendaInformacao: false,
    setShowModalLegendaInformacao: jest.fn(),
    ...overrides,
});

const createWrapper = (queryClient, contextValue) => ({ children }) => (
    <QueryClientProvider client={queryClient}>
        <GestaoDeUsuariosAdicionarUnidadeContext.Provider value={contextValue}>
            {children}
        </GestaoDeUsuariosAdicionarUnidadeContext.Provider>
    </QueryClientProvider>
);

const USUARIO = { username: 'fulano', id: 42 };

describe('useUnidadesDisponiveisInclusao', () => {
    let queryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
            },
        });
        jest.clearAllMocks();
    });

    it('deve retornar dados padrão quando a query está desabilitada (submitFiltro=false)', () => {
        const ctx = buildContext({ submitFiltro: false });

        const { result } = renderHook(
            () => useUnidadesDisponiveisInclusao(USUARIO),
            { wrapper: createWrapper(queryClient, ctx) }
        );

        expect(result.current.data).toEqual({ count: 0, results: [] });
        expect(result.current.count).toBe(0);
        expect(getUnidadesDisponiveisInclusao).not.toHaveBeenCalled();
    });

    it('deve retornar dados padrão quando usuario é falsy (null)', () => {
        const ctx = buildContext({ submitFiltro: true });

        const { result } = renderHook(
            () => useUnidadesDisponiveisInclusao(null),
            { wrapper: createWrapper(queryClient, ctx) }
        );

        expect(result.current.data).toEqual({ count: 0, results: [] });
        expect(getUnidadesDisponiveisInclusao).not.toHaveBeenCalled();
    });

    it('deve executar a query quando usuario existe e submitFiltro=true', async () => {
        getUnidadesDisponiveisInclusao.mockResolvedValueOnce({ data: { count: 2, results: [] } });

        const ctx = buildContext({ submitFiltro: true, search: 'EMEF', currentPage: 2 });

        renderHook(
            () => useUnidadesDisponiveisInclusao(USUARIO),
            { wrapper: createWrapper(queryClient, ctx) }
        );

        await act(async () => {});

        expect(getUnidadesDisponiveisInclusao).toHaveBeenCalledWith(
            USUARIO.username,
            'EMEF',
            2
        );
    });

    it('deve retornar count=0 enquanto query está desabilitada', () => {
        const ctx = buildContext({ submitFiltro: false });

        const { result } = renderHook(
            () => useUnidadesDisponiveisInclusao(USUARIO),
            { wrapper: createWrapper(queryClient, ctx) }
        );

        expect(result.current.count).toBe(0);
    });

    it('deve expor isLoading igual a isFetching', async () => {
        getUnidadesDisponiveisInclusao.mockResolvedValueOnce({ data: { count: 0, results: [] } });

        const ctx = buildContext({ submitFiltro: true });

        const { result } = renderHook(
            () => useUnidadesDisponiveisInclusao(USUARIO),
            { wrapper: createWrapper(queryClient, ctx) }
        );

        await act(async () => {});

        expect(result.current.isLoading).toBe(result.current.isFetching);
    });

    it('deve expor isError=true quando o serviço rejeita', async () => {
        getUnidadesDisponiveisInclusao.mockRejectedValueOnce(new Error('Falha na API'));

        const ctx = buildContext({ submitFiltro: true });

        const { result } = renderHook(
            () => useUnidadesDisponiveisInclusao(USUARIO),
            { wrapper: createWrapper(queryClient, ctx) }
        );

        await waitFor(() => expect(result.current.isError).toBe(true));
    });

    it('deve expor error quando o serviço rejeita', async () => {
        const erro = new Error('Erro de rede');
        getUnidadesDisponiveisInclusao.mockRejectedValueOnce(erro);

        const ctx = buildContext({ submitFiltro: true });

        const { result } = renderHook(
            () => useUnidadesDisponiveisInclusao(USUARIO),
            { wrapper: createWrapper(queryClient, ctx) }
        );

        await waitFor(() => expect(result.current.error).toBe(erro));
    });

    it('deve usar currentPage do contexto como chave da query', async () => {
        getUnidadesDisponiveisInclusao.mockResolvedValueOnce({ data: { count: 0, results: [] } });

        const ctx = buildContext({ submitFiltro: true, currentPage: 3 });

        renderHook(
            () => useUnidadesDisponiveisInclusao(USUARIO),
            { wrapper: createWrapper(queryClient, ctx) }
        );

        await act(async () => {});

        expect(getUnidadesDisponiveisInclusao).toHaveBeenCalledWith(
            USUARIO.username,
            '',
            3
        );
    });

    it('deve passar search do contexto para o serviço', async () => {
        getUnidadesDisponiveisInclusao.mockResolvedValueOnce({ data: { count: 0, results: [] } });

        const ctx = buildContext({ submitFiltro: true, search: 'Paulista' });

        renderHook(
            () => useUnidadesDisponiveisInclusao(USUARIO),
            { wrapper: createWrapper(queryClient, ctx) }
        );

        await act(async () => {});

        expect(getUnidadesDisponiveisInclusao).toHaveBeenCalledWith(
            USUARIO.username,
            'Paulista',
            1
        );
    });

    it('deve manter isError=false e error=null enquanto a query está desabilitada', () => {
        const ctx = buildContext({ submitFiltro: false });

        const { result } = renderHook(
            () => useUnidadesDisponiveisInclusao(USUARIO),
            { wrapper: createWrapper(queryClient, ctx) }
        );

        expect(result.current.isError).toBe(false);
        expect(result.current.error).toBeNull();
    });
});
