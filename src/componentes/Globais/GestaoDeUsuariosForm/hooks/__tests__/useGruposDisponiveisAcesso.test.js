import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGruposDisponiveisAcesso } from '../useGruposDisponiveisAcesso';
import { getGruposDisponiveisAcessoUsuario } from '../../../../../services/GestaoDeUsuarios.service';

jest.mock('../../../../../services/GestaoDeUsuarios.service', () => ({
    getGruposDisponiveisAcessoUsuario: jest.fn(),
}));

const createWrapper = (queryClient) => ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const USUARIO = { username: 'joao', id: 1 };

describe('useGruposDisponiveisAcesso', () => {
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

    it('não deve chamar o serviço quando usuario é falsy (null)', () => {
        renderHook(() => useGruposDisponiveisAcesso(null, 'UE', 'uuid-1'), {
            wrapper: createWrapper(queryClient),
        });

        expect(getGruposDisponiveisAcessoUsuario).not.toHaveBeenCalled();
    });

    it('não deve chamar o serviço quando usuario é undefined', () => {
        renderHook(() => useGruposDisponiveisAcesso(undefined, 'UE', 'uuid-1'), {
            wrapper: createWrapper(queryClient),
        });

        expect(getGruposDisponiveisAcessoUsuario).not.toHaveBeenCalled();
    });

    it('deve retornar data=[] e count=0 quando usuario é falsy', async () => {
        const { result } = renderHook(
            () => useGruposDisponiveisAcesso(null, 'UE', 'uuid-1'),
            { wrapper: createWrapper(queryClient) }
        );

        await act(async () => {});

        expect(result.current.data).toEqual([]);
        expect(result.current.count).toBe(0);
    });

    it('deve chamar o serviço com os parâmetros corretos quando usuario é fornecido', async () => {
        getGruposDisponiveisAcessoUsuario.mockResolvedValueOnce([]);

        renderHook(
            () => useGruposDisponiveisAcesso(USUARIO, 'DRE', 'uuid-123'),
            { wrapper: createWrapper(queryClient) }
        );

        await act(async () => {});

        expect(getGruposDisponiveisAcessoUsuario).toHaveBeenCalledWith(
            USUARIO.username,
            'DRE',
            'uuid-123'
        );
    });

    it('deve retornar os dados do serviço após sucesso', async () => {
        const grupos = [{ id: 1, nome: 'Admin' }, { id: 2, nome: 'Leitura' }];
        getGruposDisponiveisAcessoUsuario.mockResolvedValueOnce(grupos);

        const { result } = renderHook(
            () => useGruposDisponiveisAcesso(USUARIO, 'DRE', 'uuid-123'),
            { wrapper: createWrapper(queryClient) }
        );

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.data).toEqual(grupos);
    });

    it('deve retornar count igual ao tamanho dos dados', async () => {
        const grupos = [{ id: 1 }, { id: 2 }, { id: 3 }];
        getGruposDisponiveisAcessoUsuario.mockResolvedValueOnce(grupos);

        const { result } = renderHook(
            () => useGruposDisponiveisAcesso(USUARIO, 'SME', 'uuid-123'),
            { wrapper: createWrapper(queryClient) }
        );

        await waitFor(() => expect(result.current.count).toBe(3));
    });

    it('deve expor isLoading como booleano', async () => {
        getGruposDisponiveisAcessoUsuario.mockResolvedValueOnce([]);

        const { result } = renderHook(
            () => useGruposDisponiveisAcesso(USUARIO, 'DRE', 'uuid-1'),
            { wrapper: createWrapper(queryClient) }
        );

        await act(async () => {});

        expect(typeof result.current.isLoading).toBe('boolean');
    });

    it('deve expor isError=true quando o serviço rejeita', async () => {
        getGruposDisponiveisAcessoUsuario.mockRejectedValueOnce(new Error('Falha'));

        const { result } = renderHook(
            () => useGruposDisponiveisAcesso(USUARIO, 'DRE', 'uuid-1'),
            { wrapper: createWrapper(queryClient) }
        );

        await waitFor(() => expect(result.current.isError).toBe(true));
    });

    it('deve expor error quando o serviço rejeita', async () => {
        const erro = new Error('Erro de rede');
        getGruposDisponiveisAcessoUsuario.mockRejectedValueOnce(erro);

        const { result } = renderHook(
            () => useGruposDisponiveisAcesso(USUARIO, 'DRE', 'uuid-1'),
            { wrapper: createWrapper(queryClient) }
        );

        await waitFor(() => expect(result.current.error).not.toBeNull());

        expect(result.current.error?.message).toBe('Erro de rede');
    });

    it('deve expor a função refetch', () => {
        getGruposDisponiveisAcessoUsuario.mockResolvedValue([]);

        const { result } = renderHook(
            () => useGruposDisponiveisAcesso(USUARIO, 'DRE', 'uuid-1'),
            { wrapper: createWrapper(queryClient) }
        );

        expect(typeof result.current.refetch).toBe('function');
    });
});
