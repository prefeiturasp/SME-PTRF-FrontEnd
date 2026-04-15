import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateUsuario } from '../useUpdateUsuario';
import { putUsuario } from '../../../../../services/GestaoDeUsuarios.service';

jest.mock('../../../../../services/GestaoDeUsuarios.service', () => ({
    putUsuario: jest.fn(),
}));

const createWrapper = (queryClient) => ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useUpdateUsuario', () => {
    let queryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        });
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        console.log.mockRestore();
    });

    it('deve expor a mutation com as propriedades esperadas', () => {
        const { result } = renderHook(() => useUpdateUsuario(), {
            wrapper: createWrapper(queryClient),
        });

        expect(typeof result.current.mutate).toBe('function');
        expect(typeof result.current.mutateAsync).toBe('function');
    });

    it('deve chamar putUsuario com id e payload corretos', async () => {
        const id = 10;
        const payload = { username: 'maria', email: 'maria@test.com' };
        putUsuario.mockResolvedValueOnce({ id, ...payload });

        const { result } = renderHook(() => useUpdateUsuario(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            await result.current.mutateAsync({ id, payload });
        });

        expect(putUsuario).toHaveBeenCalledWith(id, payload);
    });

    it('deve retornar null quando payload é null', async () => {
        const { result } = renderHook(() => useUpdateUsuario(), {
            wrapper: createWrapper(queryClient),
        });

        let retorno;
        await act(async () => {
            retorno = await result.current.mutateAsync({ id: 5, payload: null });
        });

        expect(putUsuario).not.toHaveBeenCalled();
        expect(retorno).toBeNull();
    });

    it('deve retornar null quando payload é undefined', async () => {
        const { result } = renderHook(() => useUpdateUsuario(), {
            wrapper: createWrapper(queryClient),
        });

        let retorno;
        await act(async () => {
            retorno = await result.current.mutateAsync({ id: 5, payload: undefined });
        });

        expect(putUsuario).not.toHaveBeenCalled();
        expect(retorno).toBeNull();
    });

    it('deve retornar o resultado do serviço quando a chamada é bem-sucedida', async () => {
        const resposta = { id: 10, username: 'maria' };
        putUsuario.mockResolvedValueOnce(resposta);

        const { result } = renderHook(() => useUpdateUsuario(), {
            wrapper: createWrapper(queryClient),
        });

        let retorno;
        await act(async () => {
            retorno = await result.current.mutateAsync({ id: 10, payload: { username: 'maria' } });
        });

        expect(retorno).toEqual(resposta);
    });

    it('deve lançar erro e expor isError=true quando putUsuario rejeita', async () => {
        putUsuario.mockRejectedValueOnce(new Error('Erro de servidor'));

        const { result } = renderHook(() => useUpdateUsuario(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            result.current.mutate({ id: 1, payload: { username: 'x' } });
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error?.message).toContain('Erro de servidor');
    });

    it('deve invalidar a query "usuarios-list" após sucesso', async () => {
        putUsuario.mockResolvedValueOnce({ id: 1 });
        jest.spyOn(queryClient, 'invalidateQueries');

        const { result } = renderHook(() => useUpdateUsuario(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            await result.current.mutateAsync({ id: 1, payload: { username: 'x' } });
        });

        expect(queryClient.invalidateQueries).toHaveBeenCalledWith('usuarios-list');
    });
});
