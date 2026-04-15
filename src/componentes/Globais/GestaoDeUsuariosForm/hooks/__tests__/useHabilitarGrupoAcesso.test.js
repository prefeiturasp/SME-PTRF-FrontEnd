import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHabilitarGrupoAcesso } from '../useHabilitarGrupoAcesso';
import { patchHabilitarGrupoAcesso } from '../../../../../services/GestaoDeUsuarios.service';
import { toastCustom } from '../../../ToastCustom';

jest.mock('../../../../../services/GestaoDeUsuarios.service', () => ({
    patchHabilitarGrupoAcesso: jest.fn(),
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

describe('useHabilitarGrupoAcesso', () => {
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

    it('deve expor mutationHabilitarGrupoAcesso com as propriedades esperadas', () => {
        const { result } = renderHook(() => useHabilitarGrupoAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        expect(typeof result.current.mutationHabilitarGrupoAcesso.mutate).toBe('function');
        expect(typeof result.current.mutationHabilitarGrupoAcesso.mutateAsync).toBe('function');
    });

    it('deve chamar patchHabilitarGrupoAcesso com o payload correto', async () => {
        const payload = { uuid: 'uuid-grupo', username: 'joao' };
        patchHabilitarGrupoAcesso.mockResolvedValueOnce({
            data: { mensagem: 'Grupo habilitado' },
        });

        const { result } = renderHook(() => useHabilitarGrupoAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            await result.current.mutationHabilitarGrupoAcesso.mutateAsync({ payload });
        });

        expect(patchHabilitarGrupoAcesso).toHaveBeenCalledWith(payload);
    });

    it('deve exibir ToastCustomSuccess com a mensagem da resposta após sucesso', async () => {
        patchHabilitarGrupoAcesso.mockResolvedValueOnce({
            data: { mensagem: 'Grupo de acesso habilitado' },
        });

        const { result } = renderHook(() => useHabilitarGrupoAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            await result.current.mutationHabilitarGrupoAcesso.mutateAsync({
                payload: { uuid: 'uuid-1' },
            });
        });

        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Grupo de acesso habilitado',
            ''
        );
    });

    it('deve invalidar a query "grupos-disponiveis-acesso-usuario" após sucesso', async () => {
        patchHabilitarGrupoAcesso.mockResolvedValueOnce({ data: { mensagem: 'ok' } });
        jest.spyOn(queryClient, 'invalidateQueries');

        const { result } = renderHook(() => useHabilitarGrupoAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            await result.current.mutationHabilitarGrupoAcesso.mutateAsync({
                payload: { uuid: 'uuid-1' },
            });
        });

        expect(queryClient.invalidateQueries).toHaveBeenCalledWith(['grupos-disponiveis-acesso-usuario']);
    });

    it('deve exibir toast de erro quando patchHabilitarGrupoAcesso rejeita', async () => {
        patchHabilitarGrupoAcesso.mockRejectedValueOnce({ response: { data: 'Erro' } });

        const { result } = renderHook(() => useHabilitarGrupoAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            result.current.mutationHabilitarGrupoAcesso.mutate({ payload: { uuid: 'uuid-1' } });
        });

        await act(async () => {});

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith('Erro ao ativar grupo de acesso');
    });

    it('não deve exibir ToastCustomSuccess quando ocorre erro', async () => {
        patchHabilitarGrupoAcesso.mockRejectedValueOnce({ response: {} });

        const { result } = renderHook(() => useHabilitarGrupoAcesso(), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {
            result.current.mutationHabilitarGrupoAcesso.mutate({ payload: {} });
        });

        await act(async () => {});

        expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
    });
});
