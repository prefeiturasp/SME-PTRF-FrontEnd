import React from "react";
import { waitFor, renderHook } from '@testing-library/react';
import { useGetAcoesPDDE } from "../useGetAcoesPDDE"; // ajuste o path conforme sua estrutura
import { getAcoesPDDE } from "../../../../../../../../services/sme/Parametrizacoes.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock da função
jest.mock("../../../../../../../../services/sme/Parametrizacoes.service", () => ({
  getAcoesPDDE: jest.fn(),
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

describe("useGetAcoesPDDE", () => {
  it("deve retornar os dados corretamente quando a API retorna sucesso", async () => {
      const mockData = {
        results: [],
      };
      getAcoesPDDE.mockResolvedValueOnce(mockData);
  
      const { result } = renderHook(() => useGetAcoesPDDE({enabled: true}), {
        wrapper: createWrapper(),
      });
  
      expect(result.current.isLoading).toBe(true);
  
      await waitFor(() => expect(result.current.isLoading).toBe(false));
  
      expect(result.current.acoesPdde).toEqual(mockData);
      expect(result.current.isError).toBe(false);
    });
  
    it("deve retornar erro quando a API falhar", async () => {
      getAcoesPDDE.mockRejectedValueOnce(new Error("Erro na API"));
  
      const { result } = renderHook(() => useGetAcoesPDDE({ enabled: true }), {
        wrapper: createWrapper(),
      });
  
      expect(result.current.isLoading).toBe(true);
  
      await waitFor(() => expect(result.current.isError).toBe(true));
  
      expect(result.current.acoesPdde).toEqual({});
      expect(result.current.error).toBeInstanceOf(Error);
    });
});
