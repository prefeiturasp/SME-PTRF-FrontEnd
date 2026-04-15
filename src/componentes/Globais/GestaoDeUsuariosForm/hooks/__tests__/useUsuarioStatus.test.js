import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsuarioStatus } from '../useUsuarioStatus';
import { getUsuarioStatus } from '../../../../../services/GestaoDeUsuarios.service';

jest.mock('../../../../../services/GestaoDeUsuarios.service', () => ({
    getUsuarioStatus: jest.fn(),
}));

const createWrapper = (queryClient) => ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useUsuarioStatus', () => {
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

    it('não deve chamar o serviço quando username é falsy', () => {
        renderHook(() => useUsuarioStatus(null, true, 'uuid-123'), {
            wrapper: createWrapper(queryClient),
        });

        expect(getUsuarioStatus).not.toHaveBeenCalled();
    });

    it('não deve chamar o serviço quando e_servidor é falsy', () => {
        renderHook(() => useUsuarioStatus('joao', null, 'uuid-123'), {
            wrapper: createWrapper(queryClient),
        });

        expect(getUsuarioStatus).not.toHaveBeenCalled();
    });

    it('não deve chamar o serviço quando uuid_unidade é falsy', () => {
        renderHook(() => useUsuarioStatus('joao', true, null), {
            wrapper: createWrapper(queryClient),
        });

        expect(getUsuarioStatus).not.toHaveBeenCalled();
    });

    it('não deve chamar o serviço quando todos os parâmetros são falsy', () => {
        renderHook(() => useUsuarioStatus(undefined, undefined, undefined), {
            wrapper: createWrapper(queryClient),
        });

        expect(getUsuarioStatus).not.toHaveBeenCalled();
    });

    it('deve retornar data=undefined quando os parâmetros são falsy (query desabilitada)', async () => {
        const { result } = renderHook(() => useUsuarioStatus(null, true, 'uuid'), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {});

        expect(result.current.data).toBeUndefined();
    });

    it('deve chamar o serviço com os parâmetros corretos quando todos são fornecidos', async () => {
        getUsuarioStatus.mockResolvedValueOnce({ status: 'ativo' });

        renderHook(() => useUsuarioStatus('joao', true, 'uuid-123'), {
            wrapper: createWrapper(queryClient),
        });

        await act(async () => {});

        expect(getUsuarioStatus).toHaveBeenCalledWith('joao', true, 'uuid-123');
    });

    it('deve retornar os dados do serviço após sucesso', async () => {
        const statusData = { status: 'ativo', mensagem: 'Usuário ativo' };
        getUsuarioStatus.mockResolvedValueOnce(statusData);

        const { result } = renderHook(() => useUsuarioStatus('joao', true, 'uuid-123'), {
            wrapper: createWrapper(queryClient),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.data).toEqual(statusData);
    });

    it('deve expor isError=true quando o serviço rejeita', async () => {
        getUsuarioStatus.mockRejectedValueOnce(new Error('Erro de status'));

        const { result } = renderHook(() => useUsuarioStatus('joao', true, 'uuid-123'), {
            wrapper: createWrapper(queryClient),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
    });

    it('deve incluir a mensagem de erro quando o serviço rejeita', async () => {
        getUsuarioStatus.mockRejectedValueOnce(new Error('Serviço indisponível'));

        const { result } = renderHook(() => useUsuarioStatus('joao', true, 'uuid-123'), {
            wrapper: createWrapper(queryClient),
        });

        await waitFor(() => expect(result.current.error).not.toBeNull());

        expect(result.current.error?.message).toContain('Serviço indisponível');
    });
});
