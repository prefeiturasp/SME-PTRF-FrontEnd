import React from "react";
import { waitFor, renderHook } from '@testing-library/react';
import { useGetPAAsAnteriores } from "../useGetPAAsAnteriores";
import { getPAAsAnteriores } from "../../../../../../../../services/sme/Parametrizacoes.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock da função
jest.mock("../../../../../../../../services/sme/Parametrizacoes.service", () => ({
  getPAAsAnteriores: jest.fn(),
}));

// Cria um wrapper com QueryClientProvider
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

describe("useGetPAAsAnteriores", () => {
  it("deve retornar os dados corretamente quando a API retorna sucesso", async () => {
    const mockData = {
      results: [],
    };
    getPAAsAnteriores.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useGetPAAsAnteriores({enabled: true}), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(true);

    await waitFor(() => expect(result.current.isFetching).toBe(false));

    expect(result.current.paas_anteriores).toEqual(mockData);
    expect(result.current.isError).toBe(false);
  });
  
  it("deve retornar erro quando a API falhar", async () => {
    getPAAsAnteriores.mockRejectedValueOnce(new Error("Erro na API"));

    const { result } = renderHook(() => useGetPAAsAnteriores({ enabled: true }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(true);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.paas_anteriores).toEqual({});
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
