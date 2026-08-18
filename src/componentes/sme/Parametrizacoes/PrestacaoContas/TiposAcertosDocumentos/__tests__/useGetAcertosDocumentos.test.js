import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetAcertosDocumentos } from '../hooks/useGetAcertosDocumentos';
import { AcertosDocumentosContext } from '../context/AcertosDocumentos';
import { 
    getListaDeAcertosDocumentos, 
    getAcertosDocumentosFiltrados 
} from '../../../../../../services/sme/Parametrizacoes.service';

// Mock das funções da API
jest.mock('../../../../../../services/sme/Parametrizacoes.service');

// Helper para encapsular o hook com React Query e o Contexto
const createWrapper = (contextValue) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
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

describe('Hook useGetAcertosDocumentos', () => {
    const defaultFilter = {
        filtrar_por_nome: '',
        filtrar_por_categoria: [],
        filtrar_por_ativo: false,
        filtrar_por_documento_relacionado: [],
        recurso_uuid: 'recurso-uuid-123',
    };

    const defaultContextValue = {
        filter: defaultFilter,
        currentPage: 1,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve buscar a lista sem filtros quando nenhum filtro for informado', async () => {
        const mockResponse = [
            { uuid: '1', nome: 'Documento 1' },
            { uuid: '2', nome: 'Documento 2' },
        ];
        getListaDeAcertosDocumentos.mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useGetAcertosDocumentos(), {
            wrapper: createWrapper(defaultContextValue),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(getListaDeAcertosDocumentos).toHaveBeenCalledWith('recurso-uuid-123');
        expect(getAcertosDocumentosFiltrados).not.toHaveBeenCalled();
        expect(result.current.data).toEqual(mockResponse);
        expect(result.current.totalAcertos).toBe(2);
    });

    it('deve chamar getAcertosDocumentosFiltrados formatando os dados quando houver filtros aplicados', async () => {
        const mockFilteredResponse = [{ uuid: '1', nome: 'Documento Filtrado' }];
        getAcertosDocumentosFiltrados.mockResolvedValue(mockFilteredResponse);

        const contextWithFilters = {
            currentPage: 1,
            filter: {
                filtrar_por_nome: 'Manual',
                filtrar_por_categoria: ['Categoria A'],
                filtrar_por_ativo: true,
                filtrar_por_documento_relacionado: ['doc-1', 'doc-2'],
                recurso_uuid: 'recurso-uuid-123',
            },
        };

        const { result } = renderHook(() => useGetAcertosDocumentos(), {
            wrapper: createWrapper(contextWithFilters),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Valida se o documento relacionado foi convertido com .join(',')
        expect(getAcertosDocumentosFiltrados).toHaveBeenCalledWith(
            'Manual',
            ['Categoria A'],
            true,
            'doc-1,doc-2',
            'recurso-uuid-123'
        );
        expect(getListaDeAcertosDocumentos).not.toHaveBeenCalled();
        expect(result.current.data).toEqual(mockFilteredResponse);
        expect(result.current.totalAcertos).toBe(1);
    });

    it('não deve fazer nenhuma requisição (query desabilitada) se recurso_uuid for uma string vazia', async () => {
        const contextWithoutRecurso = {
            currentPage: 1,
            filter: {
                ...defaultFilter,
                recurso_uuid: '',
            },
        };

        const { result } = renderHook(() => useGetAcertosDocumentos(), {
            wrapper: createWrapper(contextWithoutRecurso),
        });

        expect(getListaDeAcertosDocumentos).not.toHaveBeenCalled();
        expect(getAcertosDocumentosFiltrados).not.toHaveBeenCalled();
        expect(result.current.data).toEqual([]);
        expect(result.current.totalAcertos).toBe(0);
    });
});