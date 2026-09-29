import { act } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNavigate, MemoryRouter } from 'react-router-dom';
import { usePostPrestacaoContaReprovadaNaoApresentacao } from '../usePostPrestacaoContaReprovadaNaoApresentacao';
import { postPrestacaoContaReprovadaNaoApresentacao } from '../../../../../../services/dres/PrestacaoDeContasReprovadaNaoApresentacao.service';
import { toastCustom } from '../../../../../Globais/ToastCustom';

jest.mock('../../../../../../services/dres/PrestacaoDeContasReprovadaNaoApresentacao.service', () => ({
    postPrestacaoContaReprovadaNaoApresentacao: jest.fn(),
}));

jest.mock('../../../../../Globais/ToastCustom', () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('usePostPrestacaoContaReprovadaNaoApresentacao', () => {
    let queryClient;
    let navigate;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {});
        queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
        navigate = jest.fn();
        useNavigate.mockReturnValue(navigate);
        localStorage.setItem('prestacao_de_contas_nao_apresentada', JSON.stringify({ uuid: 'pc-1' }));
    });

    afterEach(() => {
        console.log.mockRestore();
        localStorage.clear();
    });

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>{children}</MemoryRouter>
        </QueryClientProvider>
    );

    it('cria a prestação de contas reprovada, remove o localStorage, exibe toast e navega para a nova rota', async () => {
        postPrestacaoContaReprovadaNaoApresentacao.mockResolvedValue({ data: { uuid: 'pc-reprovada-1' } });

        const { result } = renderHook(() => usePostPrestacaoContaReprovadaNaoApresentacao(), { wrapper });

        await act(async () => {
            await result.current.mutationPostPrestacaoContaReprovadaNaoApresentacao.mutateAsync({
                payload: { periodo: 'periodo-1', associacao: 'assoc-1' },
            });
        });

        expect(postPrestacaoContaReprovadaNaoApresentacao).toHaveBeenCalledWith({
            periodo: 'periodo-1',
            associacao: 'assoc-1',
        });
        expect(localStorage.getItem('prestacao_de_contas_nao_apresentada')).toBeNull();
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Status alterado com sucesso',
            'Prestação de contas concluída como "Rejeitada"'
        );
        expect(navigate).toHaveBeenCalledWith(
            '/dre-detalhe-prestacao-de-contas-reprovada-nao-apresentacao/pc-reprovada-1/'
        );
    });

    it('exibe toast de erro com a mensagem de non_field_errors concatenada quando presente', async () => {
        const erro = {
            response: {
                data: {
                    non_field_errors: ['Erro A. ', 'Erro B.'],
                },
            },
        };
        postPrestacaoContaReprovadaNaoApresentacao.mockRejectedValue(erro);

        const { result } = renderHook(() => usePostPrestacaoContaReprovadaNaoApresentacao(), { wrapper });

        await act(async () => {
            try {
                await result.current.mutationPostPrestacaoContaReprovadaNaoApresentacao.mutateAsync({
                    payload: {},
                });
            } catch (e) {}
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao criar Prestação de Contas Rejeitada por não Apresentação.',
            'Erro A. Erro B.'
        );
        expect(navigate).not.toHaveBeenCalled();
    });

    it('exibe toast de erro usando detail quando não há non_field_errors', async () => {
        const erro = {
            response: {
                data: {
                    detail: 'Mensagem de detalhe do erro',
                },
            },
        };
        postPrestacaoContaReprovadaNaoApresentacao.mockRejectedValue(erro);

        const { result } = renderHook(() => usePostPrestacaoContaReprovadaNaoApresentacao(), { wrapper });

        await act(async () => {
            try {
                await result.current.mutationPostPrestacaoContaReprovadaNaoApresentacao.mutateAsync({
                    payload: {},
                });
            } catch (e) {}
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao criar Prestação de Contas Rejeitada por não Apresentação.',
            'Mensagem de detalhe do erro'
        );
    });

    it('trata non_field_errors vazio usando o detail como mensagem', async () => {
        const erro = {
            response: {
                data: {
                    non_field_errors: [],
                    detail: 'Detalhe alternativo',
                },
            },
        };
        postPrestacaoContaReprovadaNaoApresentacao.mockRejectedValue(erro);

        const { result } = renderHook(() => usePostPrestacaoContaReprovadaNaoApresentacao(), { wrapper });

        await act(async () => {
            try {
                await result.current.mutationPostPrestacaoContaReprovadaNaoApresentacao.mutateAsync({
                    payload: {},
                });
            } catch (e) {}
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao criar Prestação de Contas Rejeitada por não Apresentação.',
            'Detalhe alternativo'
        );
    });
});
