import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDesabilitarGrupoAcesso } from '../useDesabilitarGrupoAcesso';
import { patchDesabilitarGrupoAcesso } from '../../../../../services/GestaoDeUsuarios.service';
import { toastCustom } from '../../../ToastCustom';

jest.mock('../../../../../services/GestaoDeUsuarios.service', () => ({
    patchDesabilitarGrupoAcesso: jest.fn(),
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

describe('useDesabilitarGrupoAcesso', () => {
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

    it('deve expor mutationDesabilitarGrupoAcesso com as propriedades esperadas', () => {
        const { result } = renderHook(() => useDesabilitarGrupoAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        expect(typeof result.current.mutationDesabilitarGrupoAcesso.mutate).toBe('function');
        expect(typeof result.current.mutationDesabilitarGrupoAcesso.mutateAsync).toBe('function');
    });

    it('deve chamar patchDesabilitarGrupoAcesso com o payload correto', async () => {
        const payload = { uuid: 'uuid-grupo', username: 'joao' };
        patchDesabilitarGrupoAcesso.mockResolvedValueOnce({
            data: { mensagem: 'Grupo desabilitado' },
        });

        const { result } = renderHook(() => useDesabilitarGrupoAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            await result.current.mutationDesabilitarGrupoAcesso.mutateAsync({ payload });
        });

        expect(patchDesabilitarGrupoAcesso).toHaveBeenCalledWith(payload);
    });

    it('deve exibir ToastCustomColorInfo com a mensagem da resposta após sucesso', async () => {
        patchDesabilitarGrupoAcesso.mockResolvedValueOnce({
            data: { mensagem: 'Grupo de acesso desabilitado' },
        });

        const { result } = renderHook(() => useDesabilitarGrupoAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            await result.current.mutationDesabilitarGrupoAcesso.mutateAsync({
                payload: { uuid: 'uuid-1' },
            });
        });

        expect(toastCustom.ToastCustomColorInfo).toHaveBeenCalledWith(
            'Grupo de acesso desabilitado',
            '',
            '#de9524',
            '#de9524'
        );
    });

    it('deve invalidar a query "grupos-disponiveis-acesso-usuario" após sucesso', async () => {
        patchDesabilitarGrupoAcesso.mockResolvedValueOnce({ data: { mensagem: 'ok' } });
        jest.spyOn(queryClient, 'invalidateQueries');

        const { result } = renderHook(() => useDesabilitarGrupoAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            await result.current.mutationDesabilitarGrupoAcesso.mutateAsync({
                payload: { uuid: 'uuid-1' },
            });
        });

        expect(queryClient.invalidateQueries).toHaveBeenCalledWith(['grupos-disponiveis-acesso-usuario']);
    });

    it('deve exibir toast de erro quando patchDesabilitarGrupoAcesso rejeita', async () => {
        patchDesabilitarGrupoAcesso.mockRejectedValueOnce({ response: { data: 'Erro' } });

        const { result } = renderHook(() => useDesabilitarGrupoAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            result.current.mutationDesabilitarGrupoAcesso.mutate({ payload: { uuid: 'uuid-1' } });
        });

        await act(async () => {});

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith('Erro ao desativar grupo de acesso');
    });

    it('não deve exibir ToastCustomColorInfo quando ocorre erro', async () => {
        patchDesabilitarGrupoAcesso.mockRejectedValueOnce({ response: {} });

        const { result } = renderHook(() => useDesabilitarGrupoAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            result.current.mutationDesabilitarGrupoAcesso.mutate({ payload: {} });
        });

        await act(async () => {});

        expect(toastCustom.ToastCustomColorInfo).not.toHaveBeenCalled();
    });
});
