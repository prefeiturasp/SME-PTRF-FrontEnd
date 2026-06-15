import React from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetStatusGeracaoDocumentoPaa } from '../useGetStatusGeracaoDocumentoPaa';
import { getStatusGeracaoDocumentoPaa } from '../../../../../../../../services/escolas/Paa.service';

jest.mock('../../../../../../../../services/escolas/Paa.service', () => ({
    getStatusGeracaoDocumentoPaa: jest.fn(),
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

describe('useGetStatusGeracaoDocumentoPaa', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('retorna isFetching, isError, error, data e refetch', async () => {
        const mockStatus = { status: 'CONCLUIDO', versao: 'PREVIA' };
        getStatusGeracaoDocumentoPaa.mockResolvedValueOnce(mockStatus);

        const { result } = renderHook(
            () => useGetStatusGeracaoDocumentoPaa('paa-uuid-1'),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isFetching).toBe(false));

        expect(result.current.data).toEqual(mockStatus);
        expect(result.current.isError).toBe(false);
        expect(result.current.error).toBeNull();
        expect(typeof result.current.refetch).toBe('function');
    });

    it('chama getStatusGeracaoDocumentoPaa com o uuid correto', async () => {
        getStatusGeracaoDocumentoPaa.mockResolvedValueOnce({ status: 'EM_PROCESSAMENTO' });

        const { result } = renderHook(
            () => useGetStatusGeracaoDocumentoPaa('paa-uuid-abc'),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isFetching).toBe(false));

        expect(getStatusGeracaoDocumentoPaa).toHaveBeenCalledWith('paa-uuid-abc');
    });

    it('não executa a query quando uuid é undefined', () => {
        const { result } = renderHook(
            () => useGetStatusGeracaoDocumentoPaa(undefined),
            { wrapper: createWrapper() }
        );

        expect(result.current.isFetching).toBe(false);
        expect(result.current.data).toBeUndefined();
        expect(getStatusGeracaoDocumentoPaa).not.toHaveBeenCalled();
    });

    it('não executa a query quando uuid é null', () => {
        const { result } = renderHook(
            () => useGetStatusGeracaoDocumentoPaa(null),
            { wrapper: createWrapper() }
        );

        expect(result.current.isFetching).toBe(false);
        expect(result.current.data).toBeUndefined();
        expect(getStatusGeracaoDocumentoPaa).not.toHaveBeenCalled();
    });

    it('não executa a query quando uuid é string vazia', () => {
        const { result } = renderHook(
            () => useGetStatusGeracaoDocumentoPaa(''),
            { wrapper: createWrapper() }
        );

        expect(result.current.isFetching).toBe(false);
        expect(result.current.data).toBeUndefined();
        expect(getStatusGeracaoDocumentoPaa).not.toHaveBeenCalled();
    });

    it('retorna isError=true e error quando a API falha', async () => {
        const mockError = new Error('Erro ao buscar status');
        getStatusGeracaoDocumentoPaa.mockRejectedValueOnce(mockError);

        const { result } = renderHook(
            () => useGetStatusGeracaoDocumentoPaa('paa-uuid-1'),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.data).toBeUndefined();
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error.message).toBe('Erro ao buscar status');
    });

    it('retorna isFetching=true durante a requisição', () => {
        getStatusGeracaoDocumentoPaa.mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve({ status: 'EM_PROCESSAMENTO' }), 500))
        );

        const { result } = renderHook(
            () => useGetStatusGeracaoDocumentoPaa('paa-uuid-1'),
            { wrapper: createWrapper() }
        );

        expect(result.current.isFetching).toBe(true);
    });

    it('refaz a query quando uuid muda', async () => {
        const status1 = { status: 'EM_PROCESSAMENTO' };
        const status2 = { status: 'CONCLUIDO', versao: 'FINAL' };
        getStatusGeracaoDocumentoPaa.mockResolvedValueOnce(status1).mockResolvedValueOnce(status2);

        const { result, rerender } = renderHook(
            ({ uuid }) => useGetStatusGeracaoDocumentoPaa(uuid),
            { wrapper: createWrapper(), initialProps: { uuid: 'paa-uuid-1' } }
        );

        await waitFor(() => expect(result.current.isFetching).toBe(false));
        expect(result.current.data).toEqual(status1);

        rerender({ uuid: 'paa-uuid-2' });

        await waitFor(() => expect(result.current.data).toEqual(status2));
        expect(getStatusGeracaoDocumentoPaa).toHaveBeenCalledTimes(2);
        expect(getStatusGeracaoDocumentoPaa).toHaveBeenNthCalledWith(1, 'paa-uuid-1');
        expect(getStatusGeracaoDocumentoPaa).toHaveBeenNthCalledWith(2, 'paa-uuid-2');
    });

    it('retorna status EM_PROCESSAMENTO corretamente', async () => {
        getStatusGeracaoDocumentoPaa.mockResolvedValueOnce({ status: 'EM_PROCESSAMENTO' });

        const { result } = renderHook(
            () => useGetStatusGeracaoDocumentoPaa('paa-uuid-1'),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isFetching).toBe(false));

        expect(result.current.data).toEqual({ status: 'EM_PROCESSAMENTO' });
    });

    it('retorna status CONCLUIDO com versao FINAL corretamente', async () => {
        const mockStatus = { status: 'CONCLUIDO', versao: 'FINAL', mensagem: 'Documento disponível' };
        getStatusGeracaoDocumentoPaa.mockResolvedValueOnce(mockStatus);

        const { result } = renderHook(
            () => useGetStatusGeracaoDocumentoPaa('paa-uuid-1'),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isFetching).toBe(false));

        expect(result.current.data).toEqual(mockStatus);
    });
});
