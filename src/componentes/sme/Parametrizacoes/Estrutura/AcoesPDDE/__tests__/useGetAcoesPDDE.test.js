import { renderHook, waitFor } from "@testing-library/react";
import { getAcoesPDDE } from "../../../../../../services/sme/Parametrizacoes.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetAcoesPDDE } from "../hooks/useGetAcoesPDDE";
import { acoesPDDE as mockAcoesPDDE } from "../__fixtures__/mockData";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
  getAcoesPDDE: jest.fn(),
}));


describe("useGetAcoesPDDE", () => {
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
    getAcoesPDDE.mockResolvedValueOnce([]);
    const { result } = renderHook(() => useGetAcoesPDDE("", "", 1, 10), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);
  });

  it("deve retornar os dados corretamente após a requisição", async () => {
    getAcoesPDDE.mockResolvedValueOnce(mockAcoesPDDE);

    const { result } = renderHook(() => useGetAcoesPDDE("", "", 1, 10), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockAcoesPDDE);
  });

  it("deve lidar com erro na requisição", async () => {
    getAcoesPDDE.mockRejectedValueOnce(new Error("Erro ao buscar ações pdde"));

    const { result } = renderHook(() => useGetAcoesPDDE("", "", 1, 10), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.message).toBe("Erro ao buscar ações pdde");
  });

});
