import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateUsuario } from '../useCreateUsuario';
import { postUsuario } from '../../../../../services/GestaoDeUsuarios.service';

jest.mock('../../../../../services/GestaoDeUsuarios.service', () => ({
    postUsuario: jest.fn(),
}));

const createWrapper = (queryClient) => ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useCreateUsuario', () => {
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
        const { result } = renderHook(() => useCreateUsuario(), {
            wrapper: createWrapper(queryClient),
        });

        expect(typeof result.current.mutate).toBe('function');
        expect(typeof result.current.mutateAsync).toBe('function');
    });

    it('deve chamar postUsuario com o payload correto', async () => {
        const payload = { username: 'joao', email: 'joao@test.com' };
        postUsuario.mockResolvedValueOnce({ id: 1, ...payload });

        const { result } = renderHook(() => useCreateUsuario(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            await result.current.mutateAsync(payload);
        });

        expect(postUsuario).toHaveBeenCalledWith(payload);
    });

    it('deve retornar null quando o payload é falsy (null)', async () => {
        const { result } = renderHook(() => useCreateUsuario(), {
            wrapper: createWrapper(queryClient),
        });

        let retorno;
        await act(async () => {
            retorno = await result.current.mutateAsync(null);
        });

        expect(postUsuario).not.toHaveBeenCalled();
        expect(retorno).toBeNull();
    });

    it('deve retornar null quando o payload é undefined', async () => {
        const { result } = renderHook(() => useCreateUsuario(), {
            wrapper: createWrapper(queryClient),
        });

        let retorno;
        await act(async () => {
            retorno = await result.current.mutateAsync(undefined);
        });

        expect(postUsuario).not.toHaveBeenCalled();
        expect(retorno).toBeNull();
    });

    it('deve retornar o resultado do serviço quando a chamada é bem-sucedida', async () => {
        const payload = { username: 'joao' };
        const resposta = { id: 42, username: 'joao' };
        postUsuario.mockResolvedValueOnce(resposta);

        const { result } = renderHook(() => useCreateUsuario(), {
            wrapper: createWrapper(queryClient),
        });

        let retorno;
        await act(async () => {
            retorno = await result.current.mutateAsync(payload);
        });

        expect(retorno).toEqual(resposta);
    });

    it('deve lançar erro quando postUsuario rejeita', async () => {
        postUsuario.mockRejectedValueOnce(new Error('Falha na API'));

        const { result } = renderHook(() => useCreateUsuario(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            result.current.mutate({ username: 'joao' });
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error?.message).toContain('Falha na API');
    });

    it('deve invalidar a query "usuarios-list" após sucesso', async () => {
        postUsuario.mockResolvedValueOnce({ id: 1 });
        jest.spyOn(queryClient, 'invalidateQueries');

        const { result } = renderHook(() => useCreateUsuario(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            await result.current.mutateAsync({ username: 'joao' });
        });

        expect(queryClient.invalidateQueries).toHaveBeenCalledWith('usuarios-list');
    });
});
