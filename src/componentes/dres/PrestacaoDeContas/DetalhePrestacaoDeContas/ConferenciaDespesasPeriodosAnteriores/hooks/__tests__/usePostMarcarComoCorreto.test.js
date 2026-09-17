import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePostMarcarComoCorreto } from '../usePostMarcarComoCorreto';
import { postLancamentosParaConferenciaMarcarComoCorreto } from '../../../../../../../services/dres/PrestacaoDeContas.service';

jest.mock('../../../../../../../services/dres/PrestacaoDeContas.service', () => ({
    postLancamentosParaConferenciaMarcarComoCorreto: jest.fn(),
}));

const createWrapper = () => {
    const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    return ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('usePostMarcarComoCorreto', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        console.log.mockRestore();
    });

    it('chama o serviço com prestacaoDeContasUUID e payload ao executar a mutation', async () => {
        postLancamentosParaConferenciaMarcarComoCorreto.mockResolvedValue({ sucesso: true });

        const { result } = renderHook(() => usePostMarcarComoCorreto(), { wrapper: createWrapper() });

        await act(async () => {
            await result.current.mutationPostMarcarComoCorreto.mutateAsync({
                prestacaoDeContasUUID: 'pc-1',
                payload: { uuid: 'lanc-1' },
            });
        });

        expect(postLancamentosParaConferenciaMarcarComoCorreto).toHaveBeenCalledWith('pc-1', { uuid: 'lanc-1' });
        await waitFor(() => expect(result.current.mutationPostMarcarComoCorreto.isSuccess).toBe(true));
    });

    it('loga o erro quando a mutation falha', async () => {
        const erro = { response: { data: 'erro qualquer' } };
        postLancamentosParaConferenciaMarcarComoCorreto.mockRejectedValue(erro);

        const { result } = renderHook(() => usePostMarcarComoCorreto(), { wrapper: createWrapper() });

        await act(async () => {
            try {
                await result.current.mutationPostMarcarComoCorreto.mutateAsync({
                    prestacaoDeContasUUID: 'pc-1',
                    payload: {},
                });
            } catch (e) {}
        });

        expect(console.log).toHaveBeenCalledWith('Erro ao marcar como correto ', erro.response);
    });
});
