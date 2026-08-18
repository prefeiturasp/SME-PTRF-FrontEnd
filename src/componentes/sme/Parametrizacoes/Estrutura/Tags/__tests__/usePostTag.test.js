import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePostTag } from '../hooks/usePostTag';
import { postCreateTag } from '../../../../../../services/sme/Parametrizacoes.service';
import { toastCustom } from '../../../../../Globais/ToastCustom';

// Mock dos serviços e dos Toasts
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

describe('Hook usePostTag', () => {
    const mockSetModalForm = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve criar a tag vinculada ao recurso com sucesso, fechar o modal e exibir toast', async () => {
        postCreateTag.mockResolvedValue({ id: 1 });

        const { result } = renderHook(() => usePostTag(mockSetModalForm), {
            wrapper: createWrapper(),
        });

        // Payload contendo o recurso_uuid essencial para a criação
        const payload = {
            nome: 'Nova Tag',
            status: 'ATIVO',
            recurso_uuid: 'recurso-uuid-123',
        };

        act(() => {
            result.current.mutationPost.mutate({ payload });
        });

        await waitFor(() => expect(result.current.mutationPost.isSuccess).toBe(true));

        expect(postCreateTag).toHaveBeenCalledWith(payload);
        expect(mockSetModalForm).toHaveBeenCalledWith({ open: false });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Inclusão de etiqueta/tag realizada com sucesso.',
            'A etiqueta/tag foi adicionada ao sistema com sucesso.'
        );
    });

    it('deve exibir toast com erro específico de validação (non_field_errors)', async () => {
        const errorResponse = {
            response: {
                data: { non_field_errors: 'Já existe uma etiqueta com este nome para este recurso.' },
            },
        };
        postCreateTag.mockRejectedValue(errorResponse);

        const { result } = renderHook(() => usePostTag(mockSetModalForm), {
            wrapper: createWrapper(),
        });

        const payload = { nome: 'Tag Duplicada', recurso_uuid: 'recurso-uuid-123' };

        act(() => {
            result.current.mutationPost.mutate({ payload });
        });

        await waitFor(() => expect(result.current.mutationPost.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao criar etiqueta/tag',
            'Já existe uma etiqueta com este nome para este recurso.'
        );
        expect(mockSetModalForm).not.toHaveBeenCalled();
    });

    it('deve exibir mensagem de erro genérica quando a requisição falhar sem detalhes', async () => {
        postCreateTag.mockRejectedValue(new Error('Falha na rede'));

        const { result } = renderHook(() => usePostTag(mockSetModalForm), {
            wrapper: createWrapper(),
        });

        const payload = { nome: 'Tag Teste', recurso_uuid: 'recurso-uuid-123' };

        act(() => {
            result.current.mutationPost.mutate({ payload });
        });

        await waitFor(() => expect(result.current.mutationPost.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao criar etiqueta/tag',
            'Não foi possível criar a etiqueta/tag'
        );
    });
});