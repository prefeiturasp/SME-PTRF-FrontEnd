import React from "react";
import { waitFor, renderHook } from '@testing-library/react';
import { useGetTiposDespesaCusteio } from "../useGetTiposDespesaCusteio"; // ajuste o path conforme sua estrutura
import { getTodosTiposDeCusteio } from "../../../../../../../../services/sme/Parametrizacoes.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock da função
jest.mock("../../../../../../../../services/sme/Parametrizacoes.service", () => ({
  getTodosTiposDeCusteio: jest.fn(),
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

describe("useGetTiposDespesaCusteio", () => {
  it("deve retornar os dados corretamente quando a API retorna sucesso", async () => {
    const mockData = {
      results: [],
    };
    getTodosTiposDeCusteio.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useGetTiposDespesaCusteio(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.tipos_despesa_custeio).toEqual(mockData);
    expect(result.current.isError).toBe(false);
  });

  it("deve retornar erro quando a API falhar", async () => {
    getTodosTiposDeCusteio.mockRejectedValueOnce(new Error("Erro na API"));

    const { result } = renderHook(() => useGetTiposDespesaCusteio(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.tipos_despesa_custeio).toEqual({});
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
