import React from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetObjetivosPaa } from '../useGetObjetivosPaa';
import { getObjetivosPaa } from '../../../../../../../../services/escolas/Paa.service';

jest.mock('../../../../../../../../services/escolas/Paa.service', () => ({
    getObjetivosPaa: jest.fn(),
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            // retryDelay:0 garante que a retentativa do hook (retry:1) ocorra sem aguardar o
            // backoff exponencial padrão de 1 s, evitando estouro do timeout do waitFor
            queries: { retry: false, retryDelay: 0 },
        },
    });
    return ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useGetObjetivosPaa', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('retorna data, isLoading, isFetching, isError, error e refetch', async () => {
        const mockData = [{ uuid: 'obj-1', descricao: 'Objetivo 1' }];
        getObjetivosPaa.mockResolvedValueOnce(mockData);

        const { result } = renderHook(() => useGetObjetivosPaa(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.data).toEqual(mockData);
        expect(result.current.isFetching).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(result.current.error).toBeNull();
        expect(typeof result.current.refetch).toBe('function');
    });

    it('chama getObjetivosPaa sem argumentos', async () => {
        getObjetivosPaa.mockResolvedValueOnce([]);

        const { result } = renderHook(() => useGetObjetivosPaa(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(getObjetivosPaa).toHaveBeenCalledTimes(1);
        expect(getObjetivosPaa).toHaveBeenCalledWith();
    });

    it('retorna data=[] como valor padrão enquanto carrega', () => {
        getObjetivosPaa.mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve([]), 500))
        );

        const { result } = renderHook(() => useGetObjetivosPaa(), {
            wrapper: createWrapper(),
        });

        expect(result.current.data).toEqual([]);
        expect(result.current.isLoading).toBe(true);
        expect(result.current.isFetching).toBe(true);
    });

    it('executa a query automaticamente (enabled=true, sem parâmetros)', async () => {
        getObjetivosPaa.mockResolvedValueOnce([{ uuid: 'obj-2' }]);

        renderHook(() => useGetObjetivosPaa(), { wrapper: createWrapper() });

        await waitFor(() => expect(getObjetivosPaa).toHaveBeenCalledTimes(1));
    });

    it('retorna isError=true e error quando a API falha', async () => {
        const mockError = new Error('Erro na API');
        // retry: 1 no hook exige rejeição em todas as tentativas
        getObjetivosPaa.mockRejectedValue(mockError);

        const { result } = renderHook(() => useGetObjetivosPaa(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.data).toEqual([]);
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error.message).toBe('Erro na API');
    });

    it('retorna lista de objetivos corretamente', async () => {
        const mockData = [
            { uuid: 'obj-1', descricao: 'Objetivo 1' },
            { uuid: 'obj-2', descricao: 'Objetivo 2' },
            { uuid: 'obj-3', descricao: 'Objetivo 3' },
        ];
        getObjetivosPaa.mockResolvedValueOnce(mockData);

        const { result } = renderHook(() => useGetObjetivosPaa(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.data).toHaveLength(3);
        expect(result.current.data).toEqual(mockData);
    });

    it('expõe refetch funcional', async () => {
        const mockData = [{ uuid: 'obj-1' }];
        getObjetivosPaa.mockResolvedValue(mockData);

        const { result } = renderHook(() => useGetObjetivosPaa(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(typeof result.current.refetch).toBe('function');

        result.current.refetch();
        await waitFor(() => expect(getObjetivosPaa).toHaveBeenCalledTimes(2));
    });
});
