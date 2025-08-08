import React from "react";
import { waitFor, renderHook } from '@testing-library/react';
import { useGetPrioridadeTabelas } from "../useGetPrioridadeTabelas";
import { getPrioridadesTabelas } from "../../../../../../../../services/escolas/Paa.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


jest.mock("../../../../../../../../services/escolas/Paa.service", () => ({
  getPrioridadesTabelas: jest.fn(),
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

describe("useGetPrioridadeTabelas", () => {
  it("deve retornar os dados com sucesso", async () => {
    const mockData = {
      prioridades: [],
      recursos: [],
      tipos_aplicacao: []
    };

    getPrioridadesTabelas.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useGetPrioridadeTabelas(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.prioridadesTabelas).toEqual(mockData.prioridades);
    expect(result.current.recursos).toEqual(mockData.recursos);
    expect(result.current.tipos_aplicacao).toEqual(mockData.tipos_aplicacao);
    expect(result.current.isError).toBe(false);
    expect(getPrioridadesTabelas).toHaveBeenCalledWith();
  });
    
  it("deve retornar erro quando a API falhar", async () => {
    getPrioridadesTabelas.mockRejectedValueOnce(new Error("Erro na API"));
    
    const { result } = renderHook(() => useGetPrioridadeTabelas(), {
      wrapper: createWrapper(),
    });
    
    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => expect(result.current.isError).toBe(true));
    
    expect(result.current.error).toBeInstanceOf(Error);
    expect(getPrioridadesTabelas).toHaveBeenCalledWith();
  });
});
