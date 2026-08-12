import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePatchTiposDeConta } from '../hooks/usePatchTiposdeConta';
import { patchTipoConta } from '../../../../../../services/sme/Parametrizacoes.service';
import { toastCustom } from '../../../../../Globais/ToastCustom';

// Mock do serviço de API e do Toast Customizado
jest.mock('../../../../../../services/sme/Parametrizacoes.service');
jest.mock('../../../../../Globais/ToastCustom', () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

// Helper para encapsular o Hook com React Query Provider
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

describe('Hook usePatchTiposDeConta', () => {
    const mockSetShowModalForm = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve atualizar o tipo de conta com sucesso passando o recurso no payload, fechar o modal e exibir toast', async () => {
        patchTipoConta.mockResolvedValue({});

        const { result } = renderHook(() => usePatchTiposDeConta(mockSetShowModalForm), {
            wrapper: createWrapper(),
        });

        // Payload contendo dados do formulário e o vínculo com o recurso
        const params = {
            UUID: 'tipo-conta-uuid-123',
            payload: {
                nome: 'Tipo de Conta Editado',
                recurso_uuid: 'recurso-uuid-456',
            },
        };

        act(() => {
            result.current.mutationPatch.mutate(params);
        });

        await waitFor(() => expect(result.current.mutationPatch.isSuccess).toBe(true));

        expect(patchTipoConta).toHaveBeenCalledWith('tipo-conta-uuid-123', params.payload);
        expect(mockSetShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Edição do tipo de conta realizada com sucesso.',
            'O tipo de conta foi editado no sistema com sucesso.'
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
        patchTipoConta.mockRejectedValue(errorResponse);

        const { result } = renderHook(() => usePatchTiposDeConta(mockSetShowModalForm), {
            wrapper: createWrapper(),
        });

        const params = {
            UUID: 'tipo-conta-uuid-123',
            payload: {
                nome: 'Tipo Duplicado',
                recurso_uuid: 'recurso-uuid-456',
            },
        };

        act(() => {
            result.current.mutationPatch.mutate(params);
        });

        await waitFor(() => expect(result.current.mutationPatch.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao editar tipo de conta.',
            'Já existe um tipo de conta com este nome para este recurso.'
        );
        expect(mockSetShowModalForm).not.toHaveBeenCalled();
    });

    it('deve exibir mensagem de erro genérica em falhas sem e.response.data.non_field_errors', async () => {
        patchTipoConta.mockRejectedValue(new Error('Erro interno no servidor'));

        const { result } = renderHook(() => usePatchTiposDeConta(mockSetShowModalForm), {
            wrapper: createWrapper(),
        });

        const params = {
            UUID: 'tipo-conta-uuid-123',
            payload: {
                nome: 'Tipo de Conta',
                recurso_uuid: 'recurso-uuid-456',
            },
        };

        act(() => {
            result.current.mutationPatch.mutate(params);
        });

        await waitFor(() => expect(result.current.mutationPatch.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao editar tipo de conta.',
            'Houve um erro ao tentar editar o tipo de conta.'
        );
        expect(mockSetShowModalForm).not.toHaveBeenCalled();
    });
});