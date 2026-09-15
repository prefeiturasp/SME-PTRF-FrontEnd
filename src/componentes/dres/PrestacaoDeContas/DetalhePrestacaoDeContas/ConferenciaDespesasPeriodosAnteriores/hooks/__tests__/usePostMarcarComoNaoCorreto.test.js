import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePostMarcarComoNaoCorreto } from '../usePostMarcarComoNaoCorreto';
import { postLancamentosParaConferenciaMarcarNaoConferido } from '../../../../../../../services/dres/PrestacaoDeContas.service';

jest.mock('../../../../../../../services/dres/PrestacaoDeContas.service', () => ({
    postLancamentosParaConferenciaMarcarNaoConferido: jest.fn(),
}));

const createWrapper = () => {
    const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    return ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('usePostMarcarComoNaoCorreto', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        console.log.mockRestore();
    });

    it('chama o serviço com prestacaoDeContasUUID e payload ao executar a mutation', async () => {
        postLancamentosParaConferenciaMarcarNaoConferido.mockResolvedValue({ sucesso: true });

        const { result } = renderHook(() => usePostMarcarComoNaoCorreto(), { wrapper: createWrapper() });

        await act(async () => {
            await result.current.mutationPostMarcarComoNaoCorreto.mutateAsync({
                prestacaoDeContasUUID: 'pc-1',
                payload: { uuid: 'lanc-1' },
            });
        });

        expect(postLancamentosParaConferenciaMarcarNaoConferido).toHaveBeenCalledWith('pc-1', { uuid: 'lanc-1' });
        await waitFor(() => expect(result.current.mutationPostMarcarComoNaoCorreto.isSuccess).toBe(true));
    });

    it('loga o erro quando a mutation falha', async () => {
        const erro = { response: { data: 'erro qualquer' } };
        postLancamentosParaConferenciaMarcarNaoConferido.mockRejectedValue(erro);

        const { result } = renderHook(() => usePostMarcarComoNaoCorreto(), { wrapper: createWrapper() });

        await act(async () => {
            try {
                await result.current.mutationPostMarcarComoNaoCorreto.mutateAsync({
                    prestacaoDeContasUUID: 'pc-1',
                    payload: {},
                });
            } catch (e) {}
        });

        expect(console.log).toHaveBeenCalledWith('Erro ao marcar como correto ', erro.response);
    });
});
