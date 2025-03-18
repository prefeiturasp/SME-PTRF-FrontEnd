import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getTabelasReceita } from "../../../../../../../../../services/escolas/Receitas.service";
import { useGetTabelasReceitas } from "../../../hooks/useGetTabelasReceitas";
import { act } from "react";

jest.mock("../../../../../../../../../services/escolas/Receitas.service");

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

describe("useGetTabelasReceitas", () => {
  it("deve retornar os dados corretamente quando a API retorna sucesso", async () => {
    const mockData = {
      data: { acoes_associacao: [{ nome: "Recurso 1", valor: 1000 }] },
    };
    getTabelasReceita.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useGetTabelasReceitas(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData.data);
    expect(result.current.isError).toBe(false);
  });

  it("deve retornar erro quando a API falhar", async () => {
    getTabelasReceita.mockRejectedValueOnce(new Error("Erro na API"));

    const { result } = renderHook(() => useGetTabelasReceitas(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toEqual({ acoes_associacao: [] });
    expect(result.current.error).toBeInstanceOf(Error);
  });

    it("deve chamar `refetch` para buscar os dados novamente", async () => {
    // Mock da primeira resposta
    getTabelasReceita.mockResolvedValueOnce({
        data: { acoes_associacao: [{ nome: "Recurso 1", valor: 1000 }] },
    });

    const { result } = renderHook(() => useGetTabelasReceitas(), {
        wrapper: createWrapper(),
    });

    // Aguarda a primeira resposta carregar
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual({
        acoes_associacao: [{ nome: "Recurso 1", valor: 1000 }],
    });

    // Mock da nova resposta
    getTabelasReceita.mockResolvedValueOnce({
        data: { acoes_associacao: [{ nome: "Recurso 2", valor: 2000 }] },
    });

    // Chama o refetch e aguarda os novos dados serem processados
    act(() => {
        result.current.refetch();
    });

    await waitFor(() =>
        expect(result.current.data).toEqual({
        acoes_associacao: [{ nome: "Recurso 2", valor: 2000 }],
        })
    );
    });
});
