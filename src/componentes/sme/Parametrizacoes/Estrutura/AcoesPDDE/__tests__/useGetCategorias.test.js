import { renderHook, waitFor } from "@testing-library/react";
import { getAcoesPDDECategorias } from "../../../../../../services/sme/Parametrizacoes.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetCategorias } from "../hooks/useGetCategorias";
import { categoriasPDDE as mockCategoriasPDDE } from "../__fixtures__/mockData";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
  getAcoesPDDECategorias: jest.fn(),
}));


describe("useGetCategorias", () => {
    const createWrapper = () => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                retry: false, // Evita retries automáticos nos testes
                },
            },
        });
        return ({ children }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );
    };
  
  it("deve começar carregando", () => {
    getAcoesPDDECategorias.mockResolvedValueOnce([]);
    const { result } = renderHook(() => useGetCategorias(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);
  });

  it("deve retornar os dados corretamente após a requisição", async () => {
    getAcoesPDDECategorias.mockResolvedValueOnce(mockCategoriasPDDE);

    const { result } = renderHook(() => useGetCategorias(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockCategoriasPDDE);
  });

  it("deve lidar com erro na requisição", async () => {
    getAcoesPDDECategorias.mockRejectedValueOnce(new Error("Erro ao buscar categorias pdde"));

    const { result } = renderHook(() => useGetCategorias(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.message).toBe("Erro ao buscar categorias pdde");
  });

});
