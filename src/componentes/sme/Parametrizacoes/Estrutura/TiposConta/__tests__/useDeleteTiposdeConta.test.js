import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeleteTipodeConta } from '../hooks/useDeleteTiposdeConta';
import { deleteTipoConta } from '../../../../../../services/sme/Parametrizacoes.service';
import { toastCustom } from '../../../../../Globais/ToastCustom';

// Mock do serviço de API e do Toast
jest.mock('../../../../../../services/sme/Parametrizacoes.service');
jest.mock('../../../../../Globais/ToastCustom', () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

// Helper para encapsular o Hook no QueryClientProvider
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            mutations: { retry: false },
        },
    });
    return ({ children }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe('Hook useDeleteTipodeConta', () => {
    const mockSetShowModalConfirmDeleteTipoConta = jest.fn();
    const mockSetShowModalForm = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve deletar o tipo de conta com sucesso, fechar os modais e exibir toast de sucesso', async () => {
        deleteTipoConta.mockResolvedValue({});

        const { result } = renderHook(
            () => useDeleteTipodeConta(mockSetShowModalConfirmDeleteTipoConta, mockSetShowModalForm),
            { wrapper: createWrapper() }
        );

        const targetUuid = 'tipo-conta-uuid-123';

        act(() => {
            result.current.mutationDelete.mutate(targetUuid);
        });

        await waitFor(() => expect(result.current.mutationDelete.isSuccess).toBe(true));

        expect(deleteTipoConta).toHaveBeenCalledWith(targetUuid);
        expect(mockSetShowModalConfirmDeleteTipoConta).toHaveBeenCalledWith(false);
        expect(mockSetShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Remoção do tipo de conta efetuada com sucesso.',
            'O tipo de conta foi removido do sistema com sucesso.'
        );
    });

    it('deve exibir mensagem de erro customizada vinda em e.response.data.erro e fechar o modal de confirmação', async () => {
        const errorResponse = {
            response: {
                data: {
                    erro: 'Não é possível remover pois existem registros vinculados a este tipo de conta.',
                },
            },
        };
        deleteTipoConta.mockRejectedValue(errorResponse);

        const { result } = renderHook(
            () => useDeleteTipodeConta(mockSetShowModalConfirmDeleteTipoConta, mockSetShowModalForm),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutationDelete.mutate('tipo-conta-uuid-123');
        });

        await waitFor(() => expect(result.current.mutationDelete.isError).toBe(true));

        expect(mockSetShowModalConfirmDeleteTipoConta).toHaveBeenCalledWith(false);
        expect(mockSetShowModalForm).not.toHaveBeenCalled();
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro na remoção do tipo de conta.',
            'Não é possível remover pois existem registros vinculados a este tipo de conta.'
        );
    });

    it('deve exibir mensagem de erro padrão quando e.response.data.erro for falsy', async () => {
        const genericErrorResponse = {
            response: {
                data: {},
            },
        };
        deleteTipoConta.mockRejectedValue(genericErrorResponse);

        const { result } = renderHook(
            () => useDeleteTipodeConta(mockSetShowModalConfirmDeleteTipoConta, mockSetShowModalForm),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutationDelete.mutate('tipo-conta-uuid-123');
        });

        await waitFor(() => expect(result.current.mutationDelete.isError).toBe(true));

        expect(mockSetShowModalConfirmDeleteTipoConta).toHaveBeenCalledWith(false);
        expect(mockSetShowModalForm).not.toHaveBeenCalled();
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro na remoção do tipo de conta.',
            'O tipo de conta não foi removido do sistema.'
        );
    });
});