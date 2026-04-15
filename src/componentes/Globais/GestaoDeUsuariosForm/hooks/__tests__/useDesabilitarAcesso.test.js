import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDesabilitarAcesso } from '../useDesabilitarAcesso';
import { patchDesabilitarAcesso } from '../../../../../services/GestaoDeUsuarios.service';
import { toastCustom } from '../../../ToastCustom';

jest.mock('../../../../../services/GestaoDeUsuarios.service', () => ({
    patchDesabilitarAcesso: jest.fn(),
}));

jest.mock('../../../ToastCustom', () => ({
    toastCustom: {
        ToastCustomColorInfo: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

const createWrapper = (queryClient) => ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useDesabilitarAcesso', () => {
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

    it('deve expor mutationDesabilitarAcesso com as propriedades esperadas', () => {
        const { result } = renderHook(() => useDesabilitarAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        expect(typeof result.current.mutationDesabilitarAcesso.mutate).toBe('function');
        expect(typeof result.current.mutationDesabilitarAcesso.mutateAsync).toBe('function');
    });

    it('deve chamar patchDesabilitarAcesso com o payload correto', async () => {
        const payload = { uuid: 'uuid-unidade', username: 'joao' };
        patchDesabilitarAcesso.mockResolvedValueOnce({
            data: { mensagem: 'Acesso desabilitado' },
        });

        const { result } = renderHook(() => useDesabilitarAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            await result.current.mutationDesabilitarAcesso.mutateAsync({ payload });
        });

        expect(patchDesabilitarAcesso).toHaveBeenCalledWith(payload);
    });

    it('deve exibir toast de informação com a mensagem da resposta após sucesso', async () => {
        patchDesabilitarAcesso.mockResolvedValueOnce({
            data: { mensagem: 'Acesso desabilitado com sucesso' },
        });

        const { result } = renderHook(() => useDesabilitarAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            await result.current.mutationDesabilitarAcesso.mutateAsync({
                payload: { uuid: 'uuid-1' },
            });
        });

        expect(toastCustom.ToastCustomColorInfo).toHaveBeenCalledWith(
            'Acesso desabilitado com sucesso',
            '',
            '#de9524',
            '#de9524'
        );
    });

    it('deve invalidar as queries corretas após sucesso', async () => {
        patchDesabilitarAcesso.mockResolvedValueOnce({ data: { mensagem: 'ok' } });
        jest.spyOn(queryClient, 'invalidateQueries');

        const { result } = renderHook(() => useDesabilitarAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            await result.current.mutationDesabilitarAcesso.mutateAsync({
                payload: { uuid: 'uuid-1' },
            });
        });

        expect(queryClient.invalidateQueries).toHaveBeenCalledWith(['unidades-usuario-list']);
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith(['grupos-disponiveis-acesso-usuario']);
    });

    it('deve exibir toast de erro quando patchDesabilitarAcesso rejeita', async () => {
        patchDesabilitarAcesso.mockRejectedValueOnce({ response: { data: 'Erro' } });

        const { result } = renderHook(() => useDesabilitarAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            result.current.mutationDesabilitarAcesso.mutate({ payload: { uuid: 'uuid-1' } });
        });

        await act(async () => {});

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith('Erro ao desativar acesso');
    });

    it('não deve exibir toast de informação quando ocorre erro', async () => {
        patchDesabilitarAcesso.mockRejectedValueOnce({ response: {} });

        const { result } = renderHook(() => useDesabilitarAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            result.current.mutationDesabilitarAcesso.mutate({ payload: {} });
        });

        await act(async () => {});

        expect(toastCustom.ToastCustomColorInfo).not.toHaveBeenCalled();
    });
});
