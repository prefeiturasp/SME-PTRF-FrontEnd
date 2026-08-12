import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeleteAcertosDocumentos } from '../hooks/useDeleteAcertosDocumentos';
import { AcertosDocumentosContext } from '../context/AcertosDocumentos';
import { deleteAcertosDocumentos } from '../../../../../../services/sme/Parametrizacoes.service';
import { toastCustom } from '../../../../../Globais/ToastCustom';

// Mock dos serviços de API e dos Toasts
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

describe('Hook useDeleteAcertosDocumentos', () => {
    const mockSetShowModalForm = jest.fn();
    const mockSetBloquearBtnSalvarForm = jest.fn();

    const mockContextValue = {
        setShowModalForm: mockSetShowModalForm,
        setBloquearBtnSalvarForm: mockSetBloquearBtnSalvarForm,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve remover o acerto em documento com sucesso passando o UUID, fechar o modal e desbloquear o botão', async () => {
        deleteAcertosDocumentos.mockResolvedValue({});

        const { result } = renderHook(() => useDeleteAcertosDocumentos(), {
            wrapper: createWrapper(mockContextValue),
        });

        const targetUuid = 'acerto-documento-uuid-123';

        act(() => {
            result.current.mutationDelete.mutate(targetUuid);
        });

        await waitFor(() => expect(result.current.mutationDelete.isSuccess).toBe(true));

        expect(deleteAcertosDocumentos).toHaveBeenCalledWith(targetUuid);
        expect(mockSetShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Remoção do tipo de acerto em documento efetuado com sucesso.',
            'O tipo de acerto em documento foi removido do sistema com sucesso.'
        );
        expect(mockSetBloquearBtnSalvarForm).toHaveBeenCalledWith(false);
    });

    it('deve exibir toast com a mensagem específica retornada pela API em error.response.data.mensagem', async () => {
        const errorResponse = {
            response: {
                data: { mensagem: 'O tipo de acerto está associado a registros ativos e não pode ser excluído.' },
            },
        };
        deleteAcertosDocumentos.mockRejectedValue(errorResponse);

        const { result } = renderHook(() => useDeleteAcertosDocumentos(), {
            wrapper: createWrapper(mockContextValue),
        });

        act(() => {
            result.current.mutationDelete.mutate('acerto-documento-uuid-123');
        });

        await waitFor(() => expect(result.current.mutationDelete.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao remover tipo de acerto em documento',
            'O tipo de acerto está associado a registros ativos e não pode ser excluído.'
        );
        expect(mockSetShowModalForm).not.toHaveBeenCalled();
        expect(mockSetBloquearBtnSalvarForm).toHaveBeenCalledWith(false);
    });

    it('deve exibir mensagem de erro padrão quando a resposta da API não contiver o campo mensagem', async () => {
        deleteAcertosDocumentos.mockRejectedValue(new Error('Erro interno do servidor'));

        const { result } = renderHook(() => useDeleteAcertosDocumentos(), {
            wrapper: createWrapper(mockContextValue),
        });

        act(() => {
            result.current.mutationDelete.mutate('acerto-documento-uuid-123');
        });

        await waitFor(() => expect(result.current.mutationDelete.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao remover tipo de acerto em documento',
            'Não foi possível apagar o tipo de acerto em documento'
        );
        expect(mockSetBloquearBtnSalvarForm).toHaveBeenCalledWith(false);
    });
});