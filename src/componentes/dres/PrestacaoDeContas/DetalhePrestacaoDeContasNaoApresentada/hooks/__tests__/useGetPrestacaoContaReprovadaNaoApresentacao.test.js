import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetPrestacaoContaReprovadaNaoApresentacao } from '../useGetPrestacaoContaReprovadaNaoApresentacao';
import { getPrestacaoContaReprovadaNaoApresentacao } from '../../../../../../services/dres/PrestacaoDeContasReprovadaNaoApresentacao.service';

jest.mock('../../../../../../services/dres/PrestacaoDeContasReprovadaNaoApresentacao.service', () => ({
    getPrestacaoContaReprovadaNaoApresentacao: jest.fn(),
}));

const createWrapper = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useGetPrestacaoContaReprovadaNaoApresentacao', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('busca a prestação de contas reprovada por não apresentação usando o uuid informado', async () => {
        getPrestacaoContaReprovadaNaoApresentacao.mockResolvedValue({ uuid: 'pc-1', status: 'REPROVADA' });

        const { result } = renderHook(
            () => useGetPrestacaoContaReprovadaNaoApresentacao('pc-1'),
            { wrapper: createWrapper() }
        );

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(getPrestacaoContaReprovadaNaoApresentacao).toHaveBeenCalledWith('pc-1');
        expect(result.current.data).toEqual({ uuid: 'pc-1', status: 'REPROVADA' });
        expect(result.current.isError).toBe(false);
    });

    it('retorna isError quando a busca falha', async () => {
        const erro = new Error('falha ao buscar');
        getPrestacaoContaReprovadaNaoApresentacao.mockRejectedValue(erro);

        const { result } = renderHook(
            () => useGetPrestacaoContaReprovadaNaoApresentacao('pc-2'),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.isError).toBe(true);
        expect(result.current.error).toBe(erro);
    });
});
