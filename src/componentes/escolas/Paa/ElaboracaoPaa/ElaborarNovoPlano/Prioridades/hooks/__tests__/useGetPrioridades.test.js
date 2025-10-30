import React from "react";
import { waitFor, renderHook } from '@testing-library/react';
import { useGetPrioridades } from "../useGetPrioridades";
import { getPrioridades } from "../../../../../../../../services/escolas/Paa.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock da função
jest.mock("../../../../../../../../services/escolas/Paa.service", () => ({
  getPrioridades: jest.fn(),
}));

// Cria um wrapper com QueryClientProvider
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

const filtros = {
  prioridade: "0",
};
const page = 1;

describe("useGetPrioridades", () => {
  it("deve retornar os dados com sucesso", async () => {
    const mockData = {
      results: [{
        valor_total: 1000
      }],
    };

    const expectedData = {
      ...mockData,
      results: mockData.results.map((item) => ({
        acao: item?.acao_associacao_objeto?.nome || item?.acao_pdde_objeto?.nome || "",
        valor_total: parseFloat(item.valor_total),
      })),
    }
    getPrioridades.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useGetPrioridades(filtros, page), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.prioridades).toEqual(expectedData.results);
    expect(result.current.isError).toBe(false);
    expect(getPrioridades).toHaveBeenCalledWith(filtros, page);
  });
    
  it("deve retornar erro quando a API falhar", async () => {
    getPrioridades.mockRejectedValueOnce(new Error("Erro na API"));
    
    const { result } = renderHook(() => useGetPrioridades(filtros, page), {
      wrapper: createWrapper(),
    });
    
    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => expect(result.current.isError).toBe(true));
    
    expect(result.current.prioridades).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(getPrioridades).toHaveBeenCalledWith(filtros, page);
  });
});
