import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetContasComMovimentoDespesasPeriodosAnteriores } from '../useGetContasComMovimentoDespesasPeriodosAnteriores';
import { getContasComMovimentoDespesasPeriodosAnteriores } from '../../../../../../../services/dres/PrestacaoDeContas.service';

jest.mock('../../../../../../../services/dres/PrestacaoDeContas.service', () => ({
    getContasComMovimentoDespesasPeriodosAnteriores: jest.fn(),
}));

const createWrapper = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useGetContasComMovimentoDespesasPeriodosAnteriores', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('busca as contas com movimento a partir do uuid da prestação de contas', async () => {
        getContasComMovimentoDespesasPeriodosAnteriores.mockResolvedValue([{ uuid: 'conta-1' }]);

        const { result } = renderHook(
            () => useGetContasComMovimentoDespesasPeriodosAnteriores('pc-1'),
            { wrapper: createWrapper() }
        );

        expect(result.current.isLoading).toBe(true);
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(getContasComMovimentoDespesasPeriodosAnteriores).toHaveBeenCalledWith('pc-1');
        expect(result.current.data).toEqual([{ uuid: 'conta-1' }]);
        expect(result.current.isError).toBe(false);
    });

    it('retorna data como array vazio por padrão enquanto não há retorno', () => {
        getContasComMovimentoDespesasPeriodosAnteriores.mockResolvedValue([]);
        const { result } = renderHook(
            () => useGetContasComMovimentoDespesasPeriodosAnteriores('pc-2'),
            { wrapper: createWrapper() }
        );
        expect(result.current.data).toEqual([]);
    });

    it('expõe isError quando a busca falha', async () => {
        getContasComMovimentoDespesasPeriodosAnteriores.mockRejectedValue(new Error('falhou'));
        const { result } = renderHook(
            () => useGetContasComMovimentoDespesasPeriodosAnteriores('pc-3'),
            { wrapper: createWrapper() }
        );
        await waitFor(() => expect(result.current.isError).toBe(true));
    });
});
