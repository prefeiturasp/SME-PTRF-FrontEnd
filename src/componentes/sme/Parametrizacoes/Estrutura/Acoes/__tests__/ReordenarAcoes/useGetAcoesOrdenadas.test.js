import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetAcoesOrdenadas } from "../../components/ReordenarAcoes/hooks/useGetAcoesOrdenadas";
import { getListaDeAcoesOrdenadasPorOrdemDeExibicao } from "../../../../../../../services/sme/Parametrizacoes.service";

// Mock do serviço de API
jest.mock(
  "../../../../../../../services/sme/Parametrizacoes.service",
  () => ({
    getListaDeAcoesOrdenadasPorOrdemDeExibicao: jest.fn(),
  })
);

describe("Hook useGetAcoesOrdenadas", () => {
  let queryClient;

  // Wrapper para injetar o QueryClientProvider no hook testado
  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
        },
      },
    });

    return ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    // Simula usuário autenticado com TOKEN no localStorage por padrão
    localStorage.setItem("TOKEN", "fake-jwt-token");
  });

  test("deve buscar a lista de ações ordenadas e retornar o count correto quando recurso_uuid for fornecido e usuário estiver autenticado", async () => {
    const mockData = [
      { uuid: "acao-1", nome: "Ação 1", ordem_exibicao: 1 },
      { uuid: "acao-2", nome: "Ação 2", ordem_exibicao: 2 },
    ];

    getListaDeAcoesOrdenadasPorOrdemDeExibicao.mockResolvedValueOnce(mockData);

    const filters = { recurso_uuid: "rec-123-uuid" };

    const { result } = renderHook(() => useGetAcoesOrdenadas({ filters }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(getListaDeAcoesOrdenadasPorOrdemDeExibicao).toHaveBeenCalledTimes(1);
    expect(getListaDeAcoesOrdenadasPorOrdemDeExibicao).toHaveBeenCalledWith("rec-123-uuid");
    expect(result.current.data).toEqual(mockData);
    expect(result.current.count).toBe(2);
    expect(result.current.isError).toBe(false);
  });

  test("NÃO deve executar a requisição se não houver TOKEN no localStorage", async () => {
    localStorage.removeItem("TOKEN");

    const filters = { recurso_uuid: "rec-123-uuid" };

    const { result } = renderHook(() => useGetAcoesOrdenadas({ filters }), {
      wrapper: createWrapper(),
    });

    expect(getListaDeAcoesOrdenadasPorOrdemDeExibicao).not.toHaveBeenCalled();
    expect(result.current.data).toEqual([]);
    expect(result.current.count).toBe(0);
  });

  test("NÃO deve executar a requisição se recurso_uuid estiver ausente ou for falsy (shouldSkip)", async () => {
    const filters = { recurso_uuid: "" };

    const { result } = renderHook(() => useGetAcoesOrdenadas({ filters }), {
      wrapper: createWrapper(),
    });

    expect(getListaDeAcoesOrdenadasPorOrdemDeExibicao).not.toHaveBeenCalled();
    expect(result.current.data).toEqual([]);
    expect(result.current.count).toBe(0);
  });

  test("deve permitir a execução manual da função refetch", async () => {
    getListaDeAcoesOrdenadasPorOrdemDeExibicao.mockResolvedValue([
      { uuid: "acao-1", nome: "Ação 1" },
    ]);

    const filters = { recurso_uuid: "rec-123-uuid" };

    const { result } = renderHook(() => useGetAcoesOrdenadas({ filters }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(getListaDeAcoesOrdenadasPorOrdemDeExibicao).toHaveBeenCalledTimes(1);

    // Dispara o refetch manualmente
    await waitFor(() => result.current.refetch());

    expect(getListaDeAcoesOrdenadasPorOrdemDeExibicao).toHaveBeenCalledTimes(2);
  });
});