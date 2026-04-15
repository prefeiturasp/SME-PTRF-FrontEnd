import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUnidadesUsuario } from '../useUnidadesUsuario';
import { getUnidadesUsuario } from '../../../../../services/GestaoDeUsuarios.service';

jest.mock('../../../../../services/GestaoDeUsuarios.service', () => ({
    getUnidadesUsuario: jest.fn(),
}));

const createWrapper = (queryClient) => ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const USUARIO = { username: 'joao', id: 1 };

describe('useUnidadesUsuario', () => {
    let queryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });
        jest.clearAllMocks();
    });

    it('não deve chamar o serviço quando usuario é falsy (null)', () => {
        renderHook(() => useUnidadesUsuario(null, 'DRE', 'uuid-1'), {
            wrapper: createWrapper(queryClient),
        });

        expect(getUnidadesUsuario).not.toHaveBeenCalled();
    });

    it('não deve chamar o serviço quando usuario é undefined', () => {
        renderHook(() => useUnidadesUsuario(undefined, 'DRE', 'uuid-1'), {
            wrapper: createWrapper(queryClient),
        });

        expect(getUnidadesUsuario).not.toHaveBeenCalled();
    });

    it('não deve chamar o serviço quando visao_base é "UE"', () => {
        renderHook(() => useUnidadesUsuario(USUARIO, 'UE', 'uuid-1'), {
            wrapper: createWrapper(queryClient),
        });

        expect(getUnidadesUsuario).not.toHaveBeenCalled();
    });

    it('deve retornar data=[] e count=0 quando a query está desabilitada (usuario falsy)', async () => {
        const { result } = renderHook(
            () => useUnidadesUsuario(null, 'DRE', 'uuid-1'),
            { wrapper: createWrapper(queryClient) }
        );

        await act(async () => {});

        expect(result.current.data).toEqual([]);
        expect(result.current.count).toBe(0);
    });

    it('deve retornar data=[] e count=0 quando visao_base é "UE"', async () => {
        const { result } = renderHook(
            () => useUnidadesUsuario(USUARIO, 'UE', 'uuid-1'),
            { wrapper: createWrapper(queryClient) }
        );

        await act(async () => {});

        expect(result.current.data).toEqual([]);
        expect(result.current.count).toBe(0);
    });

    it('deve chamar o serviço com os parâmetros corretos quando habilitado', async () => {
        getUnidadesUsuario.mockResolvedValueOnce([]);

        renderHook(
            () => useUnidadesUsuario(USUARIO, 'DRE', 'uuid-123'),
            { wrapper: createWrapper(queryClient) }
        );

        await act(async () => {});

        expect(getUnidadesUsuario).toHaveBeenCalledWith(USUARIO.username, 'DRE', 'uuid-123');
    });

    it('deve chamar o serviço quando visao_base é "SME"', async () => {
        getUnidadesUsuario.mockResolvedValueOnce([]);

        renderHook(
            () => useUnidadesUsuario(USUARIO, 'SME', 'uuid-sme'),
            { wrapper: createWrapper(queryClient) }
        );

        await act(async () => {});

        expect(getUnidadesUsuario).toHaveBeenCalledWith(USUARIO.username, 'SME', 'uuid-sme');
    });

    it('deve retornar os dados do serviço após sucesso', async () => {
        const unidades = [{ uuid: 'uuid-1', nome: 'EMEF Teste' }];
        getUnidadesUsuario.mockResolvedValueOnce(unidades);

        const { result } = renderHook(
            () => useUnidadesUsuario(USUARIO, 'DRE', 'uuid-dre'),
            { wrapper: createWrapper(queryClient) }
        );

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.data).toEqual(unidades);
    });

    it('deve retornar count igual ao tamanho dos dados', async () => {
        const unidades = [{ uuid: 'a' }, { uuid: 'b' }];
        getUnidadesUsuario.mockResolvedValueOnce(unidades);

        const { result } = renderHook(
            () => useUnidadesUsuario(USUARIO, 'DRE', 'uuid-dre'),
            { wrapper: createWrapper(queryClient) }
        );

        await waitFor(() => expect(result.current.count).toBe(2));
    });

    it('deve expor isError=true quando o serviço rejeita', async () => {
        getUnidadesUsuario.mockRejectedValueOnce(new Error('Falha'));

        const { result } = renderHook(
            () => useUnidadesUsuario(USUARIO, 'DRE', 'uuid-1'),
            { wrapper: createWrapper(queryClient) }
        );

        await waitFor(() => expect(result.current.isError).toBe(true));
    });

    it('deve expor error quando o serviço rejeita', async () => {
        const erro = new Error('Erro de rede');
        getUnidadesUsuario.mockRejectedValueOnce(erro);

        const { result } = renderHook(
            () => useUnidadesUsuario(USUARIO, 'DRE', 'uuid-1'),
            { wrapper: createWrapper(queryClient) }
        );

        await waitFor(() => expect(result.current.error).not.toBeNull());

        expect(result.current.error?.message).toBe('Erro de rede');
    });

    it('deve expor a função refetch', () => {
        getUnidadesUsuario.mockResolvedValue([]);

        const { result } = renderHook(
            () => useUnidadesUsuario(USUARIO, 'DRE', 'uuid-1'),
            { wrapper: createWrapper(queryClient) }
        );

        expect(typeof result.current.refetch).toBe('function');
    });
});
