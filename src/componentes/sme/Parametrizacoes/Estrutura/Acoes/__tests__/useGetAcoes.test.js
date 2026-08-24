import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetAcoes } from "../hooks/useGetAcoes";
import {
  getListaDeAcoes,
  getAcoesFiltradas,
} from "../../../../../../services/sme/Parametrizacoes.service";

// Mock das funções de serviço de API
jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
  getListaDeAcoes: jest.fn(),
  getAcoesFiltradas: jest.fn(),
}));

describe("Hook useGetAcoes", () => {
  let queryClient;

  // Wrapper para fornecer o QueryClientProvider aos hooks renderizados
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
    // Simula token de autenticação padrão no localStorage
    localStorage.setItem("TOKEN", "fake-jwt-token");
  });

  test("deve buscar a lista normal de ações quando não houver filtro de nome", async () => {
    const mockData = [
      { id: "1", nome: "Ação 1" },
      { id: "2", nome: "Ação 2" },
    ];
    getListaDeAcoes.mockResolvedValueOnce(mockData);

    const filters = {
      filtrar_por_nome: "",
      recurso_uuid: "rec-123",
      is_required_recurso_uuid: true,
    };

    const { result } = renderHook(() => useGetAcoes({ filters }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(getListaDeAcoes).toHaveBeenCalledWith("rec-123");
    expect(getAcoesFiltradas).not.toHaveBeenCalled();
    expect(result.current.data).toEqual(mockData);
    expect(result.current.count).toBe(2);
  });

  test("deve chamar getAcoesFiltradas quando o filtro de nome estiver preenchido", async () => {
    const mockDataFiltrada = [{ id: "1", nome: "Ação Específica" }];
    getAcoesFiltradas.mockResolvedValueOnce(mockDataFiltrada);

    const filters = {
      filtrar_por_nome: "Específica",
      recurso_uuid: "rec-123",
      is_required_recurso_uuid: true,
    };

    const { result } = renderHook(() => useGetAcoes({ filters }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(getAcoesFiltradas).toHaveBeenCalledWith("Específica", "rec-123");
    expect(getListaDeAcoes).not.toHaveBeenCalled();
    expect(result.current.data).toEqual(mockDataFiltrada);
    expect(result.current.count).toBe(1);
  });

  test("NÃO deve executar a requisição se não houver TOKEN no localStorage", async () => {
    localStorage.removeItem("TOKEN"); // Garante que não há autenticação

    const filters = {
      filtrar_por_nome: "",
      recurso_uuid: "rec-123",
      is_required_recurso_uuid: false,
    };

    const { result } = renderHook(() => useGetAcoes({ filters }), {
      wrapper: createWrapper(),
    });

    // Como enabled = false, não haverá carregamento via API
    expect(getListaDeAcoes).not.toHaveBeenCalled();
    expect(getAcoesFiltradas).not.toHaveBeenCalled();
    expect(result.current.data).toEqual([]);
    expect(result.current.count).toBe(0);
  });

  test("NÃO deve executar a requisição se is_required_recurso_uuid for true e recurso_uuid estiver ausente", async () => {
    const filters = {
      filtrar_por_nome: "",
      recurso_uuid: "", // Vazio quando é obrigatório
      is_required_recurso_uuid: true,
    };

    const { result } = renderHook(() => useGetAcoes({ filters }), {
      wrapper: createWrapper(),
    });

    expect(getListaDeAcoes).not.toHaveBeenCalled();
    expect(getAcoesFiltradas).not.toHaveBeenCalled();
    expect(result.current.data).toEqual([]);
    expect(result.current.count).toBe(0);
  });

  test("deve permitir a execução manual da função refetch", async () => {
    getListaDeAcoes.mockResolvedValue([{ id: "1", nome: "Ação Refetch" }]);

    const filters = {
      filtrar_por_nome: "",
      recurso_uuid: "rec-123",
      is_required_recurso_uuid: true,
    };

    const { result } = renderHook(() => useGetAcoes({ filters }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(getListaDeAcoes).toHaveBeenCalledTimes(1);

    // Dispara o refetch manualmente
    await waitFor(() => result.current.refetch());

    expect(getListaDeAcoes).toHaveBeenCalledTimes(2);
  });
});