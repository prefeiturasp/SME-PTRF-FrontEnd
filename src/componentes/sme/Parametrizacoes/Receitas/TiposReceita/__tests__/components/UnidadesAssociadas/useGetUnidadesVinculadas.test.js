import { renderHook, waitFor } from "@testing-library/react";
import { useGetUnidadesVinculadas } from '../../../components/UnidadesAssociadas/hooks/useGetUnidadesVinculadas';
import { getUnidadesTipoReceita } from '../../../../../../../../services/sme/Parametrizacoes.service';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock da função getUnidadesTipoReceita
jest.mock("../../../../../../../../services/sme/Parametrizacoes.service", () => ({
  getUnidadesTipoReceita: jest.fn(),
}));

describe('useGetUnidadesVinculadas', () => {
    let queryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
    });

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

  it('deve retornar dados quando a requisição for bem-sucedida', async () => {
    const mockData = { unidades: ['unidade1', 'unidade2'] };
    getUnidadesTipoReceita.mockResolvedValueOnce(mockData); // Simula a resposta bem-sucedida da API
    
    const { result } = renderHook(() => useGetUnidadesVinculadas("uuid", 1), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isError).toBe(false);
    expect(result.current.data).toEqual(mockData);

  });

  it("deve retornar erro quando a API falhar", async () => {
        getUnidadesTipoReceita.mockRejectedValueOnce(new Error("Erro na API"));

        const { result } = renderHook(() => useGetUnidadesVinculadas("uuid", 1), {wrapper});

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => expect(result.current.isError).toBe(true));
        
        expect(result.current.error).toBeInstanceOf(Error);
    });

  it('deve retornar estado de loading enquanto a requisição está em andamento', () => {
    getUnidadesTipoReceita.mockReturnValueOnce(new Promise(() => {})); // Simula uma requisição pendente
    
    const { result } = renderHook(() => useGetUnidadesVinculadas("uuid", 1), { wrapper });

    expect(result.current.isLoading).toBe(true); // Verifica se está carregando
    expect(result.current.isError).toBe(false); // Verifica que não houve erro
  });
});
