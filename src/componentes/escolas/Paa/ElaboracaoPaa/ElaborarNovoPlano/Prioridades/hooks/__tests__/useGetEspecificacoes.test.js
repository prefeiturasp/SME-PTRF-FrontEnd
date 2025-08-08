import React from "react";
import { waitFor, renderHook } from '@testing-library/react';
import { useGetEspecificacoes } from "../useGetEspecificacoes"; // ajuste o path conforme sua estrutura
import { getEspecificacoesCapital, getEspecificacoesCusteio } from "../../../../../../../../services/escolas/Despesas.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock da função
jest.mock("../../../../../../../../services/escolas/Despesas.service", () => ({
  getEspecificacoesCapital: jest.fn(),
  getEspecificacoesCusteio: jest.fn(),
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

describe("useGetEspecificacoes para tipo CAPITAL", () => {
  it("deve retornar os dados de especificacoes corretamente quando tipo for CAPITAL", async () => {
    const mockData = {
      results: [],
    };
    getEspecificacoesCapital.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useGetEspecificacoes('CAPITAL'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.especificacoes).toEqual(mockData);
    expect(result.current.isError).toBe(false);
    expect(getEspecificacoesCapital).toHaveBeenCalledWith();
  });
  
  it("deve retornar erro quando a API falhar", async () => {
    getEspecificacoesCapital.mockRejectedValueOnce(new Error("Erro na API"));
    
    const { result } = renderHook(() => useGetEspecificacoes('CAPITAL'), {
      wrapper: createWrapper(),
    });
    
    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => expect(result.current.isError).toBe(true));
    
    expect(result.current.especificacoes).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(getEspecificacoesCapital).toHaveBeenCalledWith();
  });
});

describe("useGetEspecificacoes para tipo CUSTEIO", () => {
  it("deve retornar os dados de especificacoes corretamente quando tipo for CUSTEIO", async () => {
    const mockData = {
      results: [],
    };
    getEspecificacoesCusteio.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useGetEspecificacoes('CUSTEIO', 1), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.especificacoes).toEqual(mockData);
    expect(result.current.isError).toBe(false);
    expect(getEspecificacoesCusteio).toHaveBeenCalledWith(1);
  });

  it("deve retornar erro quando a API falhar em especificacoes CUSTEIO", async () => {
    getEspecificacoesCusteio.mockRejectedValueOnce(new Error("Erro na API"));

    const { result } = renderHook(() => useGetEspecificacoes('CUSTEIO', 1), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.especificacoes).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(getEspecificacoesCusteio).toHaveBeenCalledWith(1);
  });
});
