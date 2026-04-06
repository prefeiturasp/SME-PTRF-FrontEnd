import React from "react";
import { waitFor, renderHook } from '@testing-library/react';
import { useGetAcoesPDDEPrioridades } from "../useGetAcoesPDDEPrioridades";
import { getAcoesPDDEPrioridades } from "../../../../../../../../services/escolas/Paa.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock da função
jest.mock("../../../../../../../../services/escolas/Paa.service", () => ({
  getAcoesPDDEPrioridades: jest.fn(),
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

describe("useGetAcoesPDDEPrioridades", () => {
  it("deve retornar os dados corretamente quando a API retorna sucesso", async () => {
      const mockData = {
        results: [],
      };
      getAcoesPDDEPrioridades.mockResolvedValueOnce(mockData);

      const { result } = renderHook(() => useGetAcoesPDDEPrioridades({paa_uuid: '1234', options: { enabled: true }}), {
        wrapper: createWrapper(),
      });
  
      expect(result.current.isLoading).toBe(true);
  
      await waitFor(() => expect(result.current.isLoading).toBe(false));
  
      expect(result.current.acoesPdde).toEqual(mockData);
      expect(result.current.isError).toBe(false);
    });
  
    it("deve retornar erro quando a API falhar", async () => {
      getAcoesPDDEPrioridades.mockRejectedValueOnce(new Error("Erro na API"));

      const { result } = renderHook(() => useGetAcoesPDDEPrioridades({paa_uuid: '1234', options: { enabled: true }}), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.acoesPdde).toBeUndefined();
      expect(result.current.error).toBeInstanceOf(Error);
    });
});
