import React from "react";
import { waitFor, renderHook } from '@testing-library/react';
import { useGetPaaVigente } from "../useGetPaaVigente";
import { getPaaVigente } from "../../../../../../../../services/sme/Parametrizacoes.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock da função
jest.mock("../../../../../../../../services/sme/Parametrizacoes.service", () => ({
  getPaaVigente: jest.fn(),
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

describe("useGetPaaVigente", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar os dados corretamente quando a API retorna sucesso", async () => {
    const mockData = {
      uuid: "paa-uuid-123",
      texto_introducao: "<p>Texto de introdução do PAA</p>",
      associacao_uuid: "assoc-uuid-456",
      ano: 2024,
      status: "em_elaboracao"
    };
    getPaaVigente.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useGetPaaVigente("assoc-uuid-456"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.paaVigente).toEqual({});

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.paaVigente).toEqual(mockData);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(getPaaVigente).toHaveBeenCalledWith("assoc-uuid-456");
  });

  it("deve retornar erro quando a API falhar", async () => {
    const mockError = new Error("Erro na API");
    getPaaVigente.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useGetPaaVigente("assoc-uuid-456"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.paaVigente).toEqual({});

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.paaVigente).toEqual({});
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe("Erro na API");
  });

  it("não deve fazer a requisição quando associacaoUuid é undefined", () => {
    const { result } = renderHook(() => useGetPaaVigente(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.paaVigente).toEqual({});
    expect(getPaaVigente).not.toHaveBeenCalled();
  });

  it("não deve fazer a requisição quando associacaoUuid é null", () => {
    const { result } = renderHook(() => useGetPaaVigente(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.paaVigente).toEqual({});
    expect(getPaaVigente).not.toHaveBeenCalled();
  });

  it("não deve fazer a requisição quando associacaoUuid é string vazia", () => {
    const { result } = renderHook(() => useGetPaaVigente(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.paaVigente).toEqual({});
    expect(getPaaVigente).not.toHaveBeenCalled();
  });

  it("deve retornar dados vazios quando a API retorna null", async () => {
    getPaaVigente.mockResolvedValueOnce(null);

    const { result } = renderHook(() => useGetPaaVigente("assoc-uuid-456"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.paaVigente).toEqual(null);
    expect(result.current.isError).toBe(false);
  });

  it("deve retornar dados vazios quando a API retorna undefined", async () => {
    getPaaVigente.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useGetPaaVigente("assoc-uuid-456"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.paaVigente).toEqual({});
    expect(result.current.isError).toBe(true);
  });

  it("deve expor a função refetch", async () => {
    const mockData = {
      uuid: "paa-uuid-123",
      texto_introducao: "<p>Texto de introdução do PAA</p>"
    };
    getPaaVigente.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useGetPaaVigente("assoc-uuid-456"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(typeof result.current.refetch).toBe("function");
    expect(result.current.paaVigente).toEqual(mockData);
  });

  it("deve retornar isFetching como true durante a requisição", async () => {
    const mockData = {
      uuid: "paa-uuid-123",
      texto_introducao: "<p>Texto de introdução do PAA</p>"
    };
    
    // Simula uma requisição que demora um pouco
    getPaaVigente.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockData), 100))
    );

    const { result } = renderHook(() => useGetPaaVigente("assoc-uuid-456"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isFetching).toBe(false);
    expect(result.current.paaVigente).toEqual(mockData);
  });

  it("deve fazer nova requisição quando associacaoUuid muda", async () => {
    const mockData1 = {
      uuid: "paa-uuid-123",
      texto_introducao: "<p>PAA 1</p>"
    };
    const mockData2 = {
      uuid: "paa-uuid-456",
      texto_introducao: "<p>PAA 2</p>"
    };

    getPaaVigente
      .mockResolvedValueOnce(mockData1)
      .mockResolvedValueOnce(mockData2);

    const { result, rerender } = renderHook(
      ({ uuid }) => useGetPaaVigente(uuid),
      {
        wrapper: createWrapper(),
        initialProps: { uuid: "assoc-uuid-1" }
      }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.paaVigente).toEqual(mockData1);
    expect(getPaaVigente).toHaveBeenCalledTimes(1);

    // Muda o associacaoUuid
    rerender({ uuid: "assoc-uuid-2" });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.paaVigente).toEqual(mockData2);
    expect(getPaaVigente).toHaveBeenCalledTimes(2);
    expect(getPaaVigente).toHaveBeenNthCalledWith(1, "assoc-uuid-1");
    expect(getPaaVigente).toHaveBeenNthCalledWith(2, "assoc-uuid-2");
  });
});
