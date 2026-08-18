import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePatchTag } from '../hooks/usePatchTag';
import { patchAlterarTag } from '../../../../../../services/sme/Parametrizacoes.service';
import { toastCustom } from '../../../../../Globais/ToastCustom';

// Mock dos serviços de API e do componente de Toast
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

describe('Hook usePatchTag', () => {
    const mockSetModalForm = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve atualizar a tag com sucesso, fechar o modal e exibir toast de sucesso', async () => {
        patchAlterarTag.mockResolvedValue({});

        const { result } = renderHook(() => usePatchTag(mockSetModalForm), {
            wrapper: createWrapper(),
        });

        const params = { UUID: 'tag-123', payload: { nome: 'Tag Atualizada' } };

        act(() => {
            result.current.mutationPatch.mutate(params);
        });

        await waitFor(() => expect(result.current.mutationPatch.isSuccess).toBe(true));

        expect(patchAlterarTag).toHaveBeenCalledWith('tag-123', { nome: 'Tag Atualizada' });
        expect(mockSetModalForm).toHaveBeenCalledWith({ open: false });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Edição da etiqueta/tag realizado com sucesso.',
            'A etiqueta/tag foi editada no sistema com sucesso.'
        );
    });

    it('deve exibir toast de erro contendo non_field_errors retornado pela API', async () => {
        const errorWithNonFieldErrors = {
            response: {
                data: { non_field_errors: 'Já existe uma etiqueta com esse nome.' },
            },
        };
        patchAlterarTag.mockRejectedValue(errorWithNonFieldErrors);

        const { result } = renderHook(() => usePatchTag(mockSetModalForm), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.mutationPatch.mutate({ UUID: 'tag-123', payload: {} });
        });

        await waitFor(() => expect(result.current.mutationPatch.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Edição de etiqueta/tag não permitida.',
            'Já existe uma etiqueta com esse nome.'
        );
        expect(mockSetModalForm).not.toHaveBeenCalled();
    });

    it('deve exibir mensagem de erro genérica em caso de falha padrão sem detalhes', async () => {
        patchAlterarTag.mockRejectedValue(new Error('Erro de conexão'));

        const { result } = renderHook(() => usePatchTag(mockSetModalForm), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.mutationPatch.mutate({ UUID: 'tag-123', payload: {} });
        });

        await waitFor(() => expect(result.current.mutationPatch.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao atualizar etiqueta/tag',
            'Houve um erro ao tentar completar a ação.'
        );
    });
});