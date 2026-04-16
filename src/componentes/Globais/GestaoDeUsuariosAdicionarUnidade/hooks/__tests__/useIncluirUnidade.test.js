import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useIncluirUnidade } from '../useIncluirUnidade';
import { GestaoDeUsuariosAdicionarUnidadeContext } from '../../context/GestaoUsuariosAdicionarUnidadeProvider';
import { postIncluirUnidade } from '../../../../../services/GestaoDeUsuarios.service';
import { toastCustom } from '../../../../Globais/ToastCustom';

jest.mock('../../../../../services/GestaoDeUsuarios.service', () => ({
    postIncluirUnidade: jest.fn(),
}));

jest.mock('../../../../Globais/ToastCustom', () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
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

describe('useIncluirUnidade', () => {
    let queryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        console.log.mockRestore();
    });

    it('deve retornar mutationIncluirUnidade com a função mutate', () => {
        const ctx = buildContext();

        const { result } = renderHook(
            () => useIncluirUnidade(),
            { wrapper: createWrapper(queryClient, ctx) }
        );

        expect(result.current.mutationIncluirUnidade).toBeDefined();
        expect(typeof result.current.mutationIncluirUnidade.mutate).toBe('function');
    });

    it('deve chamar postIncluirUnidade com o payload correto', async () => {
        const payload = { username: 'fulano', uuid_unidade: 'uuid-123' };
        postIncluirUnidade.mockResolvedValueOnce({ data: 'Acesso habilitado com sucesso' });

        const ctx = buildContext();

        const { result } = renderHook(
            () => useIncluirUnidade(),
            { wrapper: createWrapper(queryClient, ctx) }
        );

        await act(async () => {
            result.current.mutationIncluirUnidade.mutate({ payload });
        });

        expect(postIncluirUnidade).toHaveBeenCalledWith(payload);
    });

    it('deve chamar toastCustom.ToastCustomSuccess com a mensagem da resposta ao ter sucesso', async () => {
        const payload = { username: 'fulano', uuid_unidade: 'uuid-123' };
        postIncluirUnidade.mockResolvedValueOnce({ data: 'Acesso habilitado!' });

        const ctx = buildContext();

        const { result } = renderHook(
            () => useIncluirUnidade(),
            { wrapper: createWrapper(queryClient, ctx) }
        );

        await act(async () => {
            await result.current.mutationIncluirUnidade.mutateAsync({ payload });
        });

        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith('Acesso habilitado!', '');
    });

    it('deve chamar navigate(-1) ao ter sucesso', async () => {
        const payload = { username: 'fulano', uuid_unidade: 'uuid-123' };
        postIncluirUnidade.mockResolvedValueOnce({ data: 'ok' });

        const ctx = buildContext();

        const { result } = renderHook(
            () => useIncluirUnidade(),
            { wrapper: createWrapper(queryClient, ctx) }
        );

        await act(async () => {
            await result.current.mutationIncluirUnidade.mutateAsync({ payload });
        });

        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('deve invalidar a query "unidades-disponiveis-inclusao" com currentPage ao ter sucesso', async () => {
        const payload = { username: 'fulano', uuid_unidade: 'uuid-123' };
        postIncluirUnidade.mockResolvedValueOnce({ data: 'ok' });

        jest.spyOn(queryClient, 'invalidateQueries');

        const ctx = buildContext({ currentPage: 3 });

        const { result } = renderHook(
            () => useIncluirUnidade(),
            { wrapper: createWrapper(queryClient, ctx) }
        );

        await act(async () => {
            await result.current.mutationIncluirUnidade.mutateAsync({ payload });
        });

        expect(queryClient.invalidateQueries).toHaveBeenCalledWith(
            ['unidades-disponiveis-inclusao', 3]
        );
    });

    it('deve chamar toastCustom.ToastCustomError ao ter erro', async () => {
        const payload = { username: 'fulano', uuid_unidade: 'uuid-123' };
        postIncluirUnidade.mockRejectedValueOnce({
            response: { data: 'Erro interno' },
        });

        const ctx = buildContext();

        const { result } = renderHook(
            () => useIncluirUnidade(),
            { wrapper: createWrapper(queryClient, ctx) }
        );

        await act(async () => {
            result.current.mutationIncluirUnidade.mutate({ payload });
        });

        await act(async () => {});

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith('Erro ao habilitar acesso');
    });

    it('não deve chamar navigate ao ter erro', async () => {
        const payload = { username: 'fulano', uuid_unidade: 'uuid-123' };
        postIncluirUnidade.mockRejectedValueOnce({
            response: { data: 'Erro interno' },
        });

        const ctx = buildContext();

        const { result } = renderHook(
            () => useIncluirUnidade(),
            { wrapper: createWrapper(queryClient, ctx) }
        );

        await act(async () => {
            result.current.mutationIncluirUnidade.mutate({ payload });
        });

        await act(async () => {});

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('não deve chamar toastCustom.ToastCustomSuccess ao ter erro', async () => {
        const payload = { username: 'fulano', uuid_unidade: 'uuid-123' };
        postIncluirUnidade.mockRejectedValueOnce({
            response: { data: 'Erro' },
        });

        const ctx = buildContext();

        const { result } = renderHook(
            () => useIncluirUnidade(),
            { wrapper: createWrapper(queryClient, ctx) }
        );

        await act(async () => {
            result.current.mutationIncluirUnidade.mutate({ payload });
        });

        await act(async () => {});

        expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
    });

    it('deve usar currentPage=1 do contexto como padrão na invalidação', async () => {
        const payload = { username: 'fulano', uuid_unidade: 'uuid-abc' };
        postIncluirUnidade.mockResolvedValueOnce({ data: 'Acesso habilitado' });

        jest.spyOn(queryClient, 'invalidateQueries');

        const ctx = buildContext({ currentPage: 1 });

        const { result } = renderHook(
            () => useIncluirUnidade(),
            { wrapper: createWrapper(queryClient, ctx) }
        );

        await act(async () => {
            await result.current.mutationIncluirUnidade.mutateAsync({ payload });
        });

        expect(queryClient.invalidateQueries).toHaveBeenCalledWith(
            ['unidades-disponiveis-inclusao', 1]
        );
    });
});
