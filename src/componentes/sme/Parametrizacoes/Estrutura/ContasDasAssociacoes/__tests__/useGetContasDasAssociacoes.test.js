import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetContasDasAssociacoes } from "../hooks/useGetContasDasAssociacoes";
import { ContasDasAssociacoesContext } from "../context/ContasDasAssociacoesContext";
import { getContasAssociacoesFiltros } from "../../../../../../services/sme/Parametrizacoes.service";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
  getContasAssociacoesFiltros: jest.fn(),
}));

describe("useGetContasDasAssociacoes", () => {
  const renderCustomHook = (filter) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    return renderHook(() => useGetContasDasAssociacoes(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          <ContasDasAssociacoesContext.Provider value={{ filter }}>
            {children}
          </ContasDasAssociacoesContext.Provider>
        </QueryClientProvider>
      ),
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("busca contas usando os filtros do contexto", async () => {
    const data = { count: 1, results: [{ uuid: "conta-1" }] };
    getContasAssociacoesFiltros.mockResolvedValue(data);

    const { result } = renderCustomHook({
      page: 2,
      associacao_nome: "EMEF",
      tipo_conta_uuid: "tipo-1",
      status: "ATIVA",
      recurso_uuid: "recurso-1",
      is_required_recurso_uuid: true,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(getContasAssociacoesFiltros).toHaveBeenCalledWith(2, "EMEF", "tipo-1", "ATIVA", "recurso-1");
    expect(result.current.data).toEqual(data);
    expect(result.current.total).toBe(1);
    expect(result.current.count).toBe(1);
  });

  it("retorna lista vazia quando recurso é obrigatório e não foi informado", async () => {
    const { result } = renderCustomHook({
      page: 1,
      recurso_uuid: "",
      is_required_recurso_uuid: true,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(getContasAssociacoesFiltros).not.toHaveBeenCalled();
    expect(result.current.data).toEqual({ count: 0, results: [] });
  });
});
