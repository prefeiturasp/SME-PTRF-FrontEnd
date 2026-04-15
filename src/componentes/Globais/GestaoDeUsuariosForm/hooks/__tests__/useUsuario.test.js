import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsuario } from '../useUsuario';
import { getUsuarioById } from '../../../../../services/GestaoDeUsuarios.service';

jest.mock('../../../../../services/GestaoDeUsuarios.service', () => ({
    getUsuarioById: jest.fn(),
}));

const createWrapper = (queryClient) => ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useUsuario', () => {
    let queryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        console.log.mockRestore();
    });

    it('não deve chamar o serviço quando id é falsy (undefined)', () => {
        renderHook(() => useUsuario(undefined), {
            wrapper: createWrapper(queryClient),
        });

        expect(getUsuarioById).not.toHaveBeenCalled();
    });

    it('não deve chamar o serviço quando id é null', () => {
        renderHook(() => useUsuario(null), {
            wrapper: createWrapper(queryClient),
        });

        expect(getUsuarioById).not.toHaveBeenCalled();
    });

    it('deve retornar data=undefined quando id é falsy (query desabilitada)', async () => {
        const { result } = renderHook(() => useUsuario(undefined), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {});

        expect(result.current.data).toBeUndefined();
    });

    it('deve chamar getUsuarioById com o id correto quando id é fornecido', async () => {
        getUsuarioById.mockResolvedValueOnce({ id: 5, username: 'joao' });

        renderHook(() => useUsuario(5), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {});

        expect(getUsuarioById).toHaveBeenCalledWith(5);
    });

    it('deve retornar os dados do serviço após sucesso', async () => {
        const usuario = { id: 5, username: 'joao', email: 'joao@test.com' };
        getUsuarioById.mockResolvedValueOnce(usuario);

        const { result } = renderHook(() => useUsuario(5), {
            wrapper: createWrapper(queryClient),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.data).toEqual(usuario);
    });

    it('deve expor isError=true quando o serviço rejeita', async () => {
        getUsuarioById.mockRejectedValueOnce(new Error('Não encontrado'));

        const { result } = renderHook(() => useUsuario(99), {
            wrapper: createWrapper(queryClient),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
    });

    it('deve incluir a mensagem de erro quando o serviço rejeita', async () => {
        getUsuarioById.mockRejectedValueOnce(new Error('Não encontrado'));

        const { result } = renderHook(() => useUsuario(99), {
            wrapper: createWrapper(queryClient),
        });

        await waitFor(() => expect(result.current.error).not.toBeNull());

        expect(result.current.error?.message).toContain('Não encontrado');
    });
});
