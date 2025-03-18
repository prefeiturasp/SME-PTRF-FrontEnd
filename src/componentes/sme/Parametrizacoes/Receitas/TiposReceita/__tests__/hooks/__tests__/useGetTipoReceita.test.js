import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getTipoReceita } from "../../../../../../../../services/sme/Parametrizacoes.service";
import { useGetTipoReceita } from "../../../hooks/useGetTipoReceita";

jest.mock("../../../../../../../../services/sme/Parametrizacoes.service", () => ({
  getTipoReceita: jest.fn(),
}));

describe("useGetTipoReceita", () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    return ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  const uuid = "uuid-fake";
  const mockData = {
    uuid: "uuid-fake",
    descricao: "Receita Exemplo",
  };

  it("deve começar carregando", () => {
    getTipoReceita.mockResolvedValueOnce(null);
    const { result } = renderHook(() => useGetTipoReceita(uuid), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("deve retornar os dados corretamente após a requisição", async () => {
    getTipoReceita.mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useGetTipoReceita(uuid), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockData);
  });

  it("deve lidar com erro na requisição", async () => {
    getTipoReceita.mockRejectedValueOnce(new Error("Erro ao buscar tipo de receita"));
    const { result } = renderHook(() => useGetTipoReceita(uuid), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.message).toBe("Erro ao buscar tipo de receita");
  });

  it("deve permitir refetch manual", async () => {
    getTipoReceita.mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useGetTipoReceita(uuid), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockData);

    const newMockData = { uuid: "uuid-fake", descricao: "Nova Receita" };
    getTipoReceita.mockResolvedValueOnce(newMockData);
    await result.current.refetch();
    await waitFor(() => expect(result.current.data).toEqual(newMockData));
  });
});