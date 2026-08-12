import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetTiposContas } from '../hooks/useGetTiposdeConta';
import { 
    getTiposContas, 
    getFiltroTiposContas 
} from '../../../../../../services/sme/Parametrizacoes.service';

// Mock das funções de API
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

describe('Hook useGetTiposContas', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar lista vazia sem chamar a API se recurso_uuid não for fornecido', async () => {
        const filters = { recurso_uuid: '', nome: '' };

        const { result } = renderHook(() => useGetTiposContas(filters), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(getTiposContas).not.toHaveBeenCalled();
        expect(getFiltroTiposContas).not.toHaveBeenCalled();
        expect(result.current.data).toEqual([]);
        expect(result.current.count).toBe(0);
    });

    it('deve buscar todos os tipos de contas do recurso_uuid quando nome não for informado', async () => {
        const mockResponse = [
            { id: 1, nome: 'Conta Corrente' },
            { id: 2, nome: 'Conta Poupança' },
        ];
        getTiposContas.mockResolvedValue(mockResponse);

        const filters = { recurso_uuid: 'recurso-uuid-123' };

        const { result } = renderHook(() => useGetTiposContas(filters), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(getTiposContas).toHaveBeenCalledWith('recurso-uuid-123');
        expect(getFiltroTiposContas).not.toHaveBeenCalled();
        expect(result.current.data).toEqual(mockResponse);
        expect(result.current.count).toBe(2);
    });

    it('deve chamar getFiltroTiposContas com nome e recurso_uuid quando ambos forem informados', async () => {
        const mockFilteredResponse = [{ id: 1, nome: 'Conta Corrente' }];
        getFiltroTiposContas.mockResolvedValue(mockFilteredResponse);

        const filters = { 
            recurso_uuid: 'recurso-uuid-123', 
            nome: 'Corrente' 
        };

        const { result } = renderHook(() => useGetTiposContas(filters), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(getFiltroTiposContas).toHaveBeenCalledWith('Corrente', 'recurso-uuid-123');
        expect(getTiposContas).not.toHaveBeenCalled();
        expect(result.current.data).toEqual(mockFilteredResponse);
        expect(result.current.count).toBe(1);
    });
});