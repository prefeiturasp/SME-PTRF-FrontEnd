import { act } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePostNotificarPrestacaoContaReprovadaNaoApresentacao } from '../usePostNotificarPrestacaoContaReprovadaNaoApresentacao';
import { postNotificarPrestacaoContaReprovadaNaoApresentacao } from '../../../../../../services/dres/PrestacaoDeContasReprovadaNaoApresentacao.service';

jest.mock('../../../../../../services/dres/PrestacaoDeContasReprovadaNaoApresentacao.service', () => ({
    postNotificarPrestacaoContaReprovadaNaoApresentacao: jest.fn(),
}));

const createWrapper = () => {
    const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    return ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('usePostNotificarPrestacaoContaReprovadaNaoApresentacao', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        console.log.mockRestore();
    });

    it('chama o serviço de notificação com o payload informado', async () => {
        postNotificarPrestacaoContaReprovadaNaoApresentacao.mockResolvedValue({ data: { uuid: 'notificacao-1' } });

        const { result } = renderHook(() => usePostNotificarPrestacaoContaReprovadaNaoApresentacao(), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            await result.current.mutationPostNotificarPrestacaoContaReprovadaNaoApresentacao.mutateAsync({
                payload: { prestacao_conta_reprovada_nao_apresentacao: 'pc-1' },
            });
        });

        expect(postNotificarPrestacaoContaReprovadaNaoApresentacao).toHaveBeenCalledWith({
            prestacao_conta_reprovada_nao_apresentacao: 'pc-1',
        });
        await waitFor(() =>
            expect(result.current.mutationPostNotificarPrestacaoContaReprovadaNaoApresentacao.isSuccess).toBe(true)
        );
    });

    it('loga o erro quando a notificação falha', async () => {
        const erro = { response: { data: 'erro ao notificar' } };
        postNotificarPrestacaoContaReprovadaNaoApresentacao.mockRejectedValue(erro);

        const { result } = renderHook(() => usePostNotificarPrestacaoContaReprovadaNaoApresentacao(), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            try {
                await result.current.mutationPostNotificarPrestacaoContaReprovadaNaoApresentacao.mutateAsync({
                    payload: {},
                });
            } catch (e) {}
        });

        expect(console.log).toHaveBeenCalledWith(
            'Erro Notificar Prestacao de Contas Reprovada por não Apresentação ',
            erro.response
        );
    });
});
