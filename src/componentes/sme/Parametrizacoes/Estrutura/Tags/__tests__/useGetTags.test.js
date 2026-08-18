import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useGetTags } from '../hooks/useGetTags';
import { getTodasTags, getFiltrosTags } from '../../../../../../services/sme/Parametrizacoes.service';

// Mock dos serviços de API
jest.mock('../../../../../../services/sme/Parametrizacoes.service');

// Helper para encapsular o Hook no QueryClientProvider
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false, // Desabilita retentativas automaticas para agilizar os testes
            },
        },
    });
    return ({ children }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe('Hook useGetTags', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve buscar todas as tags do recurso quando nenhum filtro de nome/status for informado', async () => {
        const mockTags = [{ uuid: '1', nome: 'Tag 1' }, { uuid: '2', nome: 'Tag 2' }];
        getTodasTags.mockResolvedValue(mockTags);

        const filters = {
            recurso_uuid: 'recurso-123',
        };

        const { result } = renderHook(() => useGetTags({ filters }), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Garante que o recurso_uuid foi repassado para a função da API
        expect(getTodasTags).toHaveBeenCalledWith('recurso-123');
        expect(getFiltrosTags).not.toHaveBeenCalled();
        expect(result.current.data).toEqual(mockTags);
        expect(result.current.count).toBe(2);
    });

    it('deve chamar getFiltrosTags quando filtros de nome ou status forem passados', async () => {
        const mockFilteredTags = [{ uuid: '1', nome: 'Tag Filtrada', status: 'ATIVO' }];
        getFiltrosTags.mockResolvedValue(mockFilteredTags);

        const filters = {
            filtrar_por_nome: 'Tag',
            filtrar_por_status: 'ATIVO',
            recurso_uuid: '123-abc',
        };

        const { result } = renderHook(() => useGetTags({ filters }), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(getFiltrosTags).toHaveBeenCalledWith('Tag', 'ATIVO', '123-abc');
        expect(getTodasTags).not.toHaveBeenCalled();
        expect(result.current.data).toEqual(mockFilteredTags);
        expect(result.current.count).toBe(1);
    });

    it('deve pular as requisições se is_required_recurso_uuid for verdadeiro e recurso_uuid não for informado', async () => {
        const filters = {
            is_required_recurso_uuid: true,
            recurso_uuid: null,
        };

        const { result } = renderHook(() => useGetTags({ filters }), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(getTodasTags).not.toHaveBeenCalled();
        expect(getFiltrosTags).not.toHaveBeenCalled();
        expect(result.current.data).toEqual([]);
        expect(result.current.count).toBe(0);
    });
});