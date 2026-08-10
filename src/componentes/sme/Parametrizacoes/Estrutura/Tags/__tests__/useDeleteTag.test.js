import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeleteTag } from '../hooks/useDeleteTag';
import { deleteTag } from '../../../../../../services/sme/Parametrizacoes.service';
import { toastCustom } from '../../../../../Globais/ToastCustom';

// Mock do serviço de API e dos Toasts
jest.mock('../../../../../../services/sme/Parametrizacoes.service');
jest.mock('../../../../../Globais/ToastCustom', () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

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

describe('Hook useDeleteTag', () => {
    const mockSetModalForm = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve deletar a tag com sucesso, fechar o modal e exibir toast de sucesso', async () => {
        deleteTag.mockResolvedValue({});

        const { result } = renderHook(() => useDeleteTag(mockSetModalForm), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.mutationDelete.mutate('uuid-123');
        });

        await waitFor(() => expect(result.current.mutationDelete.isSuccess).toBe(true));

        expect(deleteTag).toHaveBeenCalledWith('uuid-123');
        expect(mockSetModalForm).toHaveBeenCalledWith({ open: false });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Remoção da etiqueta/tag efetuada com sucesso.",
            "A etiqueta/tag foi removida do sistema com sucesso."
        );
    });

    it('deve exibir mensagem detalhada do servidor ao falhar com e.response.data.detail', async () => {
        const errorWithDetail = {
            response: {
                data: { detail: 'Tag está associada a outros registros.' },
            },
        };
        deleteTag.mockRejectedValue(errorWithDetail);

        const { result } = renderHook(() => useDeleteTag(mockSetModalForm), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.mutationDelete.mutate('uuid-123');
        });

        await waitFor(() => expect(result.current.mutationDelete.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Exclusão de etiqueta/tag não permitida.",
            "Tag está associada a outros registros."
        );
        expect(mockSetModalForm).not.toHaveBeenCalled();
    });

    it('deve exibir mensagem genérica ao falhar sem detalhes da API', async () => {
        deleteTag.mockRejectedValue(new Error('Erro interno'));

        const { result } = renderHook(() => useDeleteTag(mockSetModalForm), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.mutationDelete.mutate('uuid-123');
        });

        await waitFor(() => expect(result.current.mutationDelete.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao excluir etiqueta/tag",
            "Houve um erro ao tentar completar a ação."
        );
    });
});