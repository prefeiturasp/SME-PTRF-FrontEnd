import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getAcoesAssociacao } from "../../../../../../../../services/escolas/Associacao.service";
import { useGetAcoesAssociacao } from "../../hooks/useGetAcoesAssociacao";

jest.mock("../../../../../../../../services/escolas/Associacao.service");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Evita tentativas repetidas para erro
      },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useGetAcoesAssociacao", () => {
  it("deve retornar os dados corretamente quando a API retorna sucesso", async () => {
    const mockData = {
      results: [{ acao: { nome: "Recurso 1" } }],
    };
    getAcoesAssociacao.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useGetAcoesAssociacao(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData.results);
    expect(result.current.isError).toBe(false);
  });

  it("deve retornar erro quando a API falhar", async () => {
    getAcoesAssociacao.mockRejectedValueOnce(new Error("Erro na API"));

    const { result } = renderHook(() => useGetAcoesAssociacao(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
