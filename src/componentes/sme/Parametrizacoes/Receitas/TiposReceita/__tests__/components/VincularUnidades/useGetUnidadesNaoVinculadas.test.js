import { renderHook, waitFor } from "@testing-library/react";
import { useGetUnidadesNaoVinculadas } from '../../../components/VincularUnidades/hooks/useGetUnidadesNaoVinculadas';
import { getUnidadesNaoVinculadasTipoReceita } from '../../../../../../../../services/sme/Parametrizacoes.service';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../../../../../../../../services/sme/Parametrizacoes.service", () => ({
    getUnidadesNaoVinculadasTipoReceita: jest.fn(),
}));

describe('useGetUnidadesNaoVinculadas', () => {
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
    getUnidadesNaoVinculadasTipoReceita.mockResolvedValueOnce(mockData); // Simula a resposta bem-sucedida da API
    
    const { result } = renderHook(() => useGetUnidadesNaoVinculadas("uuid", 1), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isError).toBe(false);
    expect(result.current.data).toEqual(mockData);

  });

  it("deve retornar erro quando a API falhar", async () => {
        getUnidadesNaoVinculadasTipoReceita.mockRejectedValueOnce(new Error("Erro na API"));

        const { result } = renderHook(() => useGetUnidadesNaoVinculadas("uuid", 1), {wrapper});

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => expect(result.current.isError).toBe(true));
        
        expect(result.current.error).toBeInstanceOf(Error);
    });

  it('deve retornar estado de loading enquanto a requisição está em andamento', () => {
    getUnidadesNaoVinculadasTipoReceita.mockReturnValueOnce(new Promise(() => {})); // Simula uma requisição pendente
    
    const { result } = renderHook(() => useGetUnidadesNaoVinculadas("uuid", 1), { wrapper });

    expect(result.current.isLoading).toBe(true); // Verifica se está carregando
    expect(result.current.isError).toBe(false); // Verifica que não houve erro
  });
});
