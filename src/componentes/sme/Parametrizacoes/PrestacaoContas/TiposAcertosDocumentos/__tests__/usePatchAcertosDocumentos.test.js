import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePatchAcertosDocumentos } from '../hooks/usePatchAcertosDocumentos';
import { AcertosDocumentosContext } from '../context/AcertosDocumentos';
import { putAtualizarAcertosDocumentos } from '../../../../../../services/sme/Parametrizacoes.service';
import { toastCustom } from '../../../../../Globais/ToastCustom';

// Mock das dependências externas
jest.mock('../../../../../../services/sme/Parametrizacoes.service');
jest.mock('../../../../../Globais/ToastCustom', () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

// Helper para envolver o hook com React Query e o Contexto
const createWrapper = (contextValue) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            mutations: { retry: false },
        },
    });

    return ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <AcertosDocumentosContext.Provider value={contextValue}>
                {children}
            </AcertosDocumentosContext.Provider>
        </QueryClientProvider>
    );
};

describe('Hook usePatchAcertosDocumentos', () => {
    const mockSetShowModalForm = jest.fn();
    const mockSetBloquearBtnSalvarForm = jest.fn();

    const mockContextValue = {
        setShowModalForm: mockSetShowModalForm,
        setBloquearBtnSalvarForm: mockSetBloquearBtnSalvarForm,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve atualizar o documento com sucesso, invalidar cache, fechar modal e liberar botão no onSettled', async () => {
        putAtualizarAcertosDocumentos.mockResolvedValue({});

        const { result } = renderHook(() => usePatchAcertosDocumentos(), {
            wrapper: createWrapper(mockContextValue),
        });

        const params = { uuid: 'doc-uuid-123', payload: { nome: 'Documento Editado' } };

        act(() => {
            result.current.mutationPatch.mutate(params);
        });

        await waitFor(() => expect(result.current.mutationPatch.isSuccess).toBe(true));

        expect(putAtualizarAcertosDocumentos).toHaveBeenCalledWith('doc-uuid-123', { nome: 'Documento Editado' });
        expect(mockSetShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Edição do tipo de acerto em documento realizado com sucesso.',
            'O tipo de acerto em documento foi editado no sistema com sucesso.'
        );
        // Garante que o onSettled rodou desbloqueando o botão
        expect(mockSetBloquearBtnSalvarForm).toHaveBeenCalledWith(false);
    });

    it('deve exibir toast com mensagem de erro específica (non_field_errors) ao falhar', async () => {
        const errorWithNonFieldErrors = {
            response: {
                data: { non_field_errors: 'O tipo de acerto em documento já existe.' },
            },
        };
        putAtualizarAcertosDocumentos.mockRejectedValue(errorWithNonFieldErrors);

        const { result } = renderHook(() => usePatchAcertosDocumentos(), {
            wrapper: createWrapper(mockContextValue),
        });

        act(() => {
            result.current.mutationPatch.mutate({ uuid: 'doc-123', payload: {} });
        });

        await waitFor(() => expect(result.current.mutationPatch.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao editar tipo de acerto em documento',
            'O tipo de acerto em documento já existe.'
        );
        expect(mockSetShowModalForm).not.toHaveBeenCalled();
        // Garante que o onSettled roda desbloqueando o botão mesmo após erro
        expect(mockSetBloquearBtnSalvarForm).toHaveBeenCalledWith(false);
    });

    it('deve exibir mensagem de erro genérica em falhas sem detalhes da API', async () => {
        putAtualizarAcertosDocumentos.mockRejectedValue(new Error('Erro de conexão'));

        const { result } = renderHook(() => usePatchAcertosDocumentos(), {
            wrapper: createWrapper(mockContextValue),
        });

        act(() => {
            result.current.mutationPatch.mutate({ uuid: 'doc-123', payload: {} });
        });

        await waitFor(() => expect(result.current.mutationPatch.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao editar tipo de acerto em documento',
            'Não foi possível editar o tipo de acerto em documento'
        );
        expect(mockSetBloquearBtnSalvarForm).toHaveBeenCalledWith(false);
    });
});