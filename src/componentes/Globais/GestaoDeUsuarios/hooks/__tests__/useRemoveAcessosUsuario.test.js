import React from 'react';
import { act } from 'react';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRemoveAcessosUsuario } from '../useRemoveAcessosUsuario';
import { removerAcessosUnidadeBase } from '../../../../../services/GestaoDeUsuarios.service';

jest.mock('../../../../../services/GestaoDeUsuarios.service', () => ({
    removerAcessosUnidadeBase: jest.fn(),
}));

const createWrapper = (queryClient) => ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useRemoveAcessosUsuario', () => {
    let callOnSuccess;
    let callOnError;
    let queryClient;

    beforeEach(() => {
        callOnSuccess = jest.fn();
        callOnError = jest.fn();
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        });
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        console.log.mockRestore();
    });

    it('deve chamar removerAcessosUnidadeBase e invocar callOnSuccess com visao ao ter sucesso', async () => {
        removerAcessosUnidadeBase.mockResolvedValueOnce({ status: 200 });

        const { result } = renderHook(
            () => useRemoveAcessosUsuario(callOnSuccess, callOnError, 'ue'),
            { wrapper: createWrapper(queryClient) }
        );

        await act(async () => {
            await result.current.mutateAsync({ id: 1, uuidUnidadeBase: 'uuid-123' });
        });

        expect(removerAcessosUnidadeBase).toHaveBeenCalledWith(1, 'uuid-123');
        expect(callOnSuccess).toHaveBeenCalledWith('ue');
        expect(callOnError).not.toHaveBeenCalled();
    });

    it('deve retornar null e não chamar o serviço quando id é falsy', async () => {
        const { result } = renderHook(
            () => useRemoveAcessosUsuario(callOnSuccess, callOnError, 'ue'),
            { wrapper: createWrapper(queryClient) }
        );

        await act(async () => {
            await result.current.mutateAsync({ id: null, uuidUnidadeBase: 'uuid-123' });
        });

        expect(removerAcessosUnidadeBase).not.toHaveBeenCalled();
        expect(callOnSuccess).toHaveBeenCalledWith('ue');
    });

    it('deve retornar null e não chamar o serviço quando uuidUnidadeBase é falsy', async () => {
        const { result } = renderHook(
            () => useRemoveAcessosUsuario(callOnSuccess, callOnError, 'dre'),
            { wrapper: createWrapper(queryClient) }
        );

        await act(async () => {
            await result.current.mutateAsync({ id: 1, uuidUnidadeBase: '' });
        });

        expect(removerAcessosUnidadeBase).not.toHaveBeenCalled();
        expect(callOnSuccess).toHaveBeenCalledWith('dre');
    });

    it('deve invocar callOnError quando o serviço rejeita', async () => {
        removerAcessosUnidadeBase.mockRejectedValueOnce(new Error('Falha na API'));

        const { result } = renderHook(
            () => useRemoveAcessosUsuario(callOnSuccess, callOnError, 'ue'),
            { wrapper: createWrapper(queryClient) }
        );

        await act(async () => {
            result.current.mutate({ id: 1, uuidUnidadeBase: 'uuid-123' });
        });

        await act(async () => {});

        expect(removerAcessosUnidadeBase).toHaveBeenCalledWith(1, 'uuid-123');
        expect(callOnError).toHaveBeenCalled();
        expect(callOnSuccess).not.toHaveBeenCalled();
    });

    it('deve passar o visao correto para callOnSuccess', async () => {
        removerAcessosUnidadeBase.mockResolvedValueOnce({});

        const { result } = renderHook(
            () => useRemoveAcessosUsuario(callOnSuccess, callOnError, 'sme'),
            { wrapper: createWrapper(queryClient) }
        );

        await act(async () => {
            await result.current.mutateAsync({ id: 42, uuidUnidadeBase: 'uuid-abc' });
        });

        expect(callOnSuccess).toHaveBeenCalledWith('sme');
    });

    it('deve invalidar a query "usuarios-list" ao ter sucesso', async () => {
        removerAcessosUnidadeBase.mockResolvedValueOnce({});
        jest.spyOn(queryClient, 'invalidateQueries');

        const { result } = renderHook(
            () => useRemoveAcessosUsuario(callOnSuccess, callOnError, 'ue'),
            { wrapper: createWrapper(queryClient) }
        );

        await act(async () => {
            await result.current.mutateAsync({ id: 1, uuidUnidadeBase: 'uuid-123' });
        });

        expect(queryClient.invalidateQueries).toHaveBeenCalledWith('usuarios-list');
    });
});
