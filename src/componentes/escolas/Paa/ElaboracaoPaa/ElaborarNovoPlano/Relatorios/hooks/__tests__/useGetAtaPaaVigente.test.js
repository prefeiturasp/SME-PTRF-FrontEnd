import React from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetAtaPaaVigente } from '../useGetAtaPaaVigente';
import { iniciarAtaPaa } from '../../../../../../../../services/escolas/AtasPaa.service';

jest.mock('../../../../../../../../services/escolas/AtasPaa.service', () => ({
    iniciarAtaPaa: jest.fn(),
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
    return ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useGetAtaPaaVigente', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('retorna ataPaa, isLoading, isFetching, isError, error e refetch', async () => {
        iniciarAtaPaa.mockResolvedValueOnce({ uuid: 'ata-uuid-1' });

        const { result } = renderHook(() => useGetAtaPaaVigente('paa-uuid-1'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.ataPaa).toEqual({ uuid: 'ata-uuid-1' });
        expect(result.current.isFetching).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(result.current.error).toBeNull();
        expect(typeof result.current.refetch).toBe('function');
    });

    it('chama iniciarAtaPaa com o paaUuid correto', async () => {
        iniciarAtaPaa.mockResolvedValueOnce({ uuid: 'ata-uuid-1' });

        const { result } = renderHook(() => useGetAtaPaaVigente('paa-uuid-123'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(iniciarAtaPaa).toHaveBeenCalledWith('paa-uuid-123');
    });

    it('retorna ataPaa={} como valor padrão enquanto carrega', () => {
        iniciarAtaPaa.mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve({ uuid: 'ata' }), 500))
        );

        const { result } = renderHook(() => useGetAtaPaaVigente('paa-uuid-1'), {
            wrapper: createWrapper(),
        });

        expect(result.current.ataPaa).toEqual({});
        expect(result.current.isLoading).toBe(true);
        expect(result.current.isFetching).toBe(true);
    });

    it('não executa a query quando paaUuid é undefined', () => {
        const { result } = renderHook(() => useGetAtaPaaVigente(undefined), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.ataPaa).toEqual({});
        expect(iniciarAtaPaa).not.toHaveBeenCalled();
    });

    it('não executa a query quando paaUuid é null', () => {
        const { result } = renderHook(() => useGetAtaPaaVigente(null), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.ataPaa).toEqual({});
        expect(iniciarAtaPaa).not.toHaveBeenCalled();
    });

    it('não executa a query quando paaUuid é string vazia', () => {
        const { result } = renderHook(() => useGetAtaPaaVigente(''), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.ataPaa).toEqual({});
        expect(iniciarAtaPaa).not.toHaveBeenCalled();
    });

    it('retorna isError=true e error quando a API falha', async () => {
        const mockError = new Error('Erro na API');
        iniciarAtaPaa.mockRejectedValueOnce(mockError);

        const { result } = renderHook(() => useGetAtaPaaVigente('paa-uuid-1'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.ataPaa).toEqual({});
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error.message).toBe('Erro na API');
    });

    it('refaz a query quando paaUuid muda', async () => {
        const data1 = { uuid: 'ata-1' };
        const data2 = { uuid: 'ata-2' };
        iniciarAtaPaa.mockResolvedValueOnce(data1).mockResolvedValueOnce(data2);

        const { result, rerender } = renderHook(
            ({ uuid }) => useGetAtaPaaVigente(uuid),
            { wrapper: createWrapper(), initialProps: { uuid: 'paa-1' } }
        );

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.ataPaa).toEqual(data1);

        rerender({ uuid: 'paa-2' });

        await waitFor(() => expect(result.current.ataPaa).toEqual(data2));
        expect(iniciarAtaPaa).toHaveBeenCalledTimes(2);
        expect(iniciarAtaPaa).toHaveBeenNthCalledWith(1, 'paa-1');
        expect(iniciarAtaPaa).toHaveBeenNthCalledWith(2, 'paa-2');
    });
});
