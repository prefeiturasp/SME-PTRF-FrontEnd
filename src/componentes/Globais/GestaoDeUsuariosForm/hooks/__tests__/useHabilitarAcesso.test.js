import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHabilitarAcesso } from '../useHabilitarAcesso';
import { patchHabilitarAcesso } from '../../../../../services/GestaoDeUsuarios.service';
import { toastCustom } from '../../../ToastCustom';

jest.mock('../../../../../services/GestaoDeUsuarios.service', () => ({
    patchHabilitarAcesso: jest.fn(),
}));

jest.mock('../../../ToastCustom', () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

const createWrapper = (queryClient) => ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useHabilitarAcesso', () => {
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

    it('deve expor mutationHabilitarAcesso com as propriedades esperadas', () => {
        const { result } = renderHook(() => useHabilitarAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        expect(typeof result.current.mutationHabilitarAcesso.mutate).toBe('function');
        expect(typeof result.current.mutationHabilitarAcesso.mutateAsync).toBe('function');
    });

    it('deve chamar patchHabilitarAcesso com o payload correto', async () => {
        const payload = { uuid: 'uuid-unidade', username: 'joao' };
        patchHabilitarAcesso.mockResolvedValueOnce({
            data: { mensagem: 'Acesso habilitado' },
        });

        const { result } = renderHook(() => useHabilitarAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            await result.current.mutationHabilitarAcesso.mutateAsync({ payload });
        });

        expect(patchHabilitarAcesso).toHaveBeenCalledWith(payload);
    });

    it('deve exibir ToastCustomSuccess com a mensagem da resposta após sucesso', async () => {
        patchHabilitarAcesso.mockResolvedValueOnce({
            data: { mensagem: 'Acesso habilitado com sucesso' },
        });

        const { result } = renderHook(() => useHabilitarAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            await result.current.mutationHabilitarAcesso.mutateAsync({
                payload: { uuid: 'uuid-1' },
            });
        });

        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Acesso habilitado com sucesso',
            ''
        );
    });

    it('deve invalidar as queries corretas após sucesso', async () => {
        patchHabilitarAcesso.mockResolvedValueOnce({ data: { mensagem: 'ok' } });
        jest.spyOn(queryClient, 'invalidateQueries');

        const { result } = renderHook(() => useHabilitarAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            await result.current.mutationHabilitarAcesso.mutateAsync({
                payload: { uuid: 'uuid-1' },
            });
        });

        expect(queryClient.invalidateQueries).toHaveBeenCalledWith(['unidades-usuario-list']);
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith(['grupos-disponiveis-acesso-usuario']);
    });

    it('deve exibir toast de erro quando patchHabilitarAcesso rejeita', async () => {
        patchHabilitarAcesso.mockRejectedValueOnce({ response: { data: 'Erro' } });

        const { result } = renderHook(() => useHabilitarAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            result.current.mutationHabilitarAcesso.mutate({ payload: { uuid: 'uuid-1' } });
        });

        await act(async () => {});

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith('Erro ao ativar acesso');
    });

    it('não deve exibir ToastCustomSuccess quando ocorre erro', async () => {
        patchHabilitarAcesso.mockRejectedValueOnce({ response: {} });

        const { result } = renderHook(() => useHabilitarAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            result.current.mutationHabilitarAcesso.mutate({ payload: {} });
        });

        await act(async () => {});

        expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
    });
});
