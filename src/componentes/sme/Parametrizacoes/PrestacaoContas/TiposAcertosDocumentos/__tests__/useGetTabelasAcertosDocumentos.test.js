import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetTabelasAcertosDocumentos } from '../hooks/useGetTabelasAcertosDocumentos';
import { getTabelaDocumento } from '../../../../../../services/sme/Parametrizacoes.service';

// Mock do serviço de API
jest.mock('../../../../../../services/sme/Parametrizacoes.service');

// Helper para encapsular o Hook no QueryClientProvider
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
    return ({ children }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe('Hook useGetTabelasAcertosDocumentos', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve buscar os dados e converter o ID dos documentos para String', async () => {
        const mockApiResponse = {
            categorias: [{ id: 1, nome: 'Categoria 1' }],
            documentos: [
                { id: 10, nome: 'Documento A' },
                { id: '20', nome: 'Documento B' },
            ],
        };

        getTabelaDocumento.mockResolvedValue(mockApiResponse);

        const { result } = renderHook(() => useGetTabelasAcertosDocumentos(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(getTabelaDocumento).toHaveBeenCalledTimes(1);
        expect(result.current.isError).toBe(false);
        expect(result.current.data).toEqual({
            categorias: [{ id: 1, nome: 'Categoria 1' }],
            documentos: [
                { id: 10, nome: 'Documento A', id: '10' }, // ID convertido de Number (10) para String ('10')
                { id: '20', nome: 'Documento B', id: '20' },
            ],
        });
    });

    it('deve retornar a estrutura padrão vazia se a API retornar um objeto vazio ou undefined', async () => {
        // Cobre o fallback data.categorias || [] e data.documentos || []
        getTabelaDocumento.mockResolvedValue({});

        const { result } = renderHook(() => useGetTabelasAcertosDocumentos(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.data).toEqual({
            categorias: [],
            documentos: [],
        });
    });

    it('deve lidar corretamente com erros de requisição (isError = true)', async () => {
        const mockError = new Error('Erro ao carregar tabelas');
        getTabelaDocumento.mockRejectedValue(mockError);

        const { result } = renderHook(() => useGetTabelasAcertosDocumentos(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toEqual(mockError);
        // Garante que mesmo com erro ele mantém a estrutura padrão sem quebrar
        expect(result.current.data).toEqual({
            categorias: [],
            documentos: [],
        });
    });
});