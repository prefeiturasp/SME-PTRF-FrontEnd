import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePostTipoConta } from '../hooks/usePostTiposdeConta';
import { toastCustom } from '../../../../../Globais/ToastCustom';
import { postTipoConta } from '../../../../../../services/sme/Parametrizacoes.service';

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

describe('Hook usePostTipoConta', () => {
    const mockSetShowModalForm = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve criar o tipo de conta vinculado ao recurso com sucesso, fechar o modal e exibir toast', async () => {
        postTipoConta.mockResolvedValue({ id: 1 });

        const { result } = renderHook(() => usePostTipoConta(mockSetShowModalForm), {
            wrapper: createWrapper(),
        });

        // Payload completo contendo o recurso_uuid associado
        const payload = {
            nome: 'Novo Tipo de Conta',
            recurso_uuid: 'recurso-uuid-123',
        };

        act(() => {
            result.current.mutationPost.mutate({ payload });
        });

        await waitFor(() => expect(result.current.mutationPost.isSuccess).toBe(true));

        expect(postTipoConta).toHaveBeenCalledWith(payload);
        expect(mockSetShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Inclusão do tipo de conta realizada com sucesso.',
            'O tipo de conta foi adicionado ao sistema com sucesso.'
        );
    });

    it('deve exibir toast com erro específico de validação (non_field_errors)', async () => {
        const errorResponse = {
            response: {
                data: {
                    non_field_errors: 'Já existe um tipo de conta com este nome para este recurso.',
                },
            },
        };
        postTipoConta.mockRejectedValue(errorResponse);

        const { result } = renderHook(() => usePostTipoConta(mockSetShowModalForm), {
            wrapper: createWrapper(),
        });

        const payload = {
            nome: 'Tipo Duplicado',
            recurso_uuid: 'recurso-uuid-123',
        };

        act(() => {
            result.current.mutationPost.mutate({ payload });
        });

        await waitFor(() => expect(result.current.mutationPost.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao criar tipo de conta.',
            'Já existe um tipo de conta com este nome para este recurso.'
        );
        expect(mockSetShowModalForm).not.toHaveBeenCalled();
    });

    it('deve exibir mensagem de erro genérica em falhas com response.data mas sem non_field_errors', async () => {
        // Envia estrutura válida em response.data para passar pelo `if (e.response.data && ...)` sem lançar TypeError
        const genericErrorResponse = {
            response: {
                data: {},
            },
        };
        postTipoConta.mockRejectedValue(genericErrorResponse);

        const { result } = renderHook(() => usePostTipoConta(mockSetShowModalForm), {
            wrapper: createWrapper(),
        });

        const payload = {
            nome: 'Tipo de Conta',
            recurso_uuid: 'recurso-uuid-123',
        };

        act(() => {
            result.current.mutationPost.mutate({ payload });
        });

        await waitFor(() => expect(result.current.mutationPost.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao criar tipo de conta.',
            'Houve um erro ao tentar criar o tipo de conta.'
        );
        expect(mockSetShowModalForm).not.toHaveBeenCalled();
    });
});