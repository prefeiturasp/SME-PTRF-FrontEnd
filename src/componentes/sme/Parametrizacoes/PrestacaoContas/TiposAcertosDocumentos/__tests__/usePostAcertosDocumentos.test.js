import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePostAcertosDocumentos } from '../hooks/usePostAcertosDocumentos';
import { AcertosDocumentosContext } from '../context/AcertosDocumentos';
import { postAddAcertosDocumentos } from '../../../../../../services/sme/Parametrizacoes.service';
import { toastCustom } from '../../../../../Globais/ToastCustom';

// Mock do serviço de API e do Toast
jest.mock('../../../../../../services/sme/Parametrizacoes.service');
jest.mock('../../../../../Globais/ToastCustom', () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

// Helper para encapsular o hook com React Query e Contexto
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

describe('Hook usePostAcertosDocumentos', () => {
    const mockSetShowModalForm = jest.fn();
    const mockSetBloquearBtnSalvarForm = jest.fn();

    const mockContextValue = {
        setShowModalForm: mockSetShowModalForm,
        setBloquearBtnSalvarForm: mockSetBloquearBtnSalvarForm,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve criar a acerto em documento vinculando o recurso com sucesso, fechar o modal e desbloquear o botão', async () => {
        postAddAcertosDocumentos.mockResolvedValue({});

        const { result } = renderHook(() => usePostAcertosDocumentos(), {
            wrapper: createWrapper(mockContextValue),
        });

        // Payload completo incluindo a vinculação obrigatória com o recurso
        const payload = {
            nome: 'Novo Acerto',
            descricao: 'Descrição do acerto',
            recurso_uuid: 'recurso-uuid-123',
        };

        act(() => {
            result.current.mutationPost.mutate({ payload });
        });

        await waitFor(() => expect(result.current.mutationPost.isSuccess).toBe(true));

        expect(postAddAcertosDocumentos).toHaveBeenCalledWith(payload);
        expect(mockSetShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Inclusão de tipo de acerto em documento realizado com sucesso.',
            'O tipo de acerto em documento foi adicionado ao sistema com sucesso.'
        );
        expect(mockSetBloquearBtnSalvarForm).toHaveBeenCalledWith(false);
    });

    it('deve tratar erro de validação do tipo non_field_errors', async () => {
        const errorResponse = {
            response: {
                data: { non_field_errors: 'Já existe um tipo de acerto com esse nome para este recurso.' },
            },
        };
        postAddAcertosDocumentos.mockRejectedValue(errorResponse);

        const { result } = renderHook(() => usePostAcertosDocumentos(), {
            wrapper: createWrapper(mockContextValue),
        });

        const payload = { nome: 'Acerto Duplicado', recurso_uuid: 'recurso-uuid-123' };

        act(() => {
            result.current.mutationPost.mutate({ payload });
        });

        await waitFor(() => expect(result.current.mutationPost.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao criar tipo de acerto em documento',
            'Já existe um tipo de acerto com esse nome para este recurso.'
        );
        expect(mockSetShowModalForm).not.toHaveBeenCalled();
        expect(mockSetBloquearBtnSalvarForm).toHaveBeenCalledWith(false);
    });

    it('deve tratar erro com detalhe específico vindo em response.data.detail', async () => {
        const errorResponse = {
            response: {
                data: { detail: 'Você não tem permissão para adicionar neste recurso.' },
            },
        };
        postAddAcertosDocumentos.mockRejectedValue(errorResponse);

        const { result } = renderHook(() => usePostAcertosDocumentos(), {
            wrapper: createWrapper(mockContextValue),
        });

        const payload = { nome: 'Acerto Sem Permissão', recurso_uuid: 'recurso-uuid-123' };

        act(() => {
            result.current.mutationPost.mutate({ payload });
        });

        await waitFor(() => expect(result.current.mutationPost.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao criar tipo de acerto em documento',
            'Você não tem permissão para adicionar neste recurso.'
        );
        expect(mockSetBloquearBtnSalvarForm).toHaveBeenCalledWith(false);
    });

    it('deve exibir mensagem genérica quando o erro não possuir detalhe nem non_field_errors', async () => {
        postAddAcertosDocumentos.mockRejectedValue(new Error('Servidor indisponível'));

        const { result } = renderHook(() => usePostAcertosDocumentos(), {
            wrapper: createWrapper(mockContextValue),
        });

        const payload = { nome: 'Acerto Generico', recurso_uuid: 'recurso-uuid-123' };

        act(() => {
            result.current.mutationPost.mutate({ payload });
        });

        await waitFor(() => expect(result.current.mutationPost.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao criar tipo de acerto em documento',
            'Erro ao processar a solicitação.'
        );
        expect(mockSetBloquearBtnSalvarForm).toHaveBeenCalledWith(false);
    });
});