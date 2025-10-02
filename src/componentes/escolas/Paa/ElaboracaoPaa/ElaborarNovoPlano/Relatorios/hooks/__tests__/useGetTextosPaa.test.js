import React from "react";
import { waitFor, renderHook } from '@testing-library/react';
import { useGetTextosPaa } from "../useGetTextosPaa";
import { getTextosPaaUe } from "../../../../../../../../services/escolas/PrestacaoDeContas.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock da função
jest.mock("../../../../../../../../services/escolas/PrestacaoDeContas.service", () => ({
  getTextosPaaUe: jest.fn(),
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

describe("useGetTextosPaa", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar os dados corretamente quando a API retorna sucesso", async () => {
    const mockData = {
      introducao_do_paa_ue_1: "<p>Texto de introdução 1</p>",
      introducao_do_paa_ue_2: "<p>Texto de introdução 2</p>",
      conclusao_do_paa_ue_1: "<p>Texto de conclusão 1</p>",
      conclusao_do_paa_ue_2: "<p>Texto de conclusão 2</p>",
      texto_pagina_paa_ue: "<p>Texto da página PAA</p>"
    };
    getTextosPaaUe.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useGetTextosPaa(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.textosPaa).toEqual({});

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.textosPaa).toEqual(mockData);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(getTextosPaaUe).toHaveBeenCalledTimes(1);
  });

  it("deve retornar erro quando a API falhar", async () => {
    const mockError = new Error("Erro na API");
    getTextosPaaUe.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useGetTextosPaa(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.textosPaa).toEqual({});

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.textosPaa).toEqual({});
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe("Erro na API");
  });

  it("deve retornar dados vazios quando a API retorna null", async () => {
    getTextosPaaUe.mockResolvedValueOnce(null);

    const { result } = renderHook(() => useGetTextosPaa(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.textosPaa).toEqual(null);
    expect(result.current.isError).toBe(false);
  });

  it("deve retornar dados vazios quando a API retorna undefined", async () => {
    getTextosPaaUe.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useGetTextosPaa(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.textosPaa).toEqual({});
    expect(result.current.isError).toBe(true);
  });

  it("deve expor a função refetch", async () => {
    const mockData = {
      introducao_do_paa_ue_1: "<p>Texto de introdução 1</p>",
      introducao_do_paa_ue_2: "<p>Texto de introdução 2</p>"
    };
    getTextosPaaUe.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useGetTextosPaa(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(typeof result.current.refetch).toBe("function");
    expect(result.current.textosPaa).toEqual(mockData);
  });

  it("deve retornar isFetching como true durante a requisição", async () => {
    const mockData = {
      introducao_do_paa_ue_1: "<p>Texto de introdução 1</p>"
    };
    
    // Simula uma requisição que demora um pouco
    getTextosPaaUe.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockData), 100))
    );

    const { result } = renderHook(() => useGetTextosPaa(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isFetching).toBe(false);
    expect(result.current.textosPaa).toEqual(mockData);
  });

  it("deve sempre estar habilitado (enabled: true)", async () => {
    const mockData = {
      introducao_do_paa_ue_1: "<p>Texto de introdução 1</p>"
    };
    getTextosPaaUe.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useGetTextosPaa(), {
      wrapper: createWrapper(),
    });

    // O hook deve sempre fazer a requisição imediatamente
    expect(result.current.isLoading).toBe(true);
    expect(getTextosPaaUe).toHaveBeenCalledTimes(1);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.textosPaa).toEqual(mockData);
  });

  it("deve retornar dados parciais quando alguns campos estão vazios", async () => {
    const mockData = {
      introducao_do_paa_ue_1: "<p>Texto de introdução 1</p>",
      introducao_do_paa_ue_2: null,
      conclusao_do_paa_ue_1: "<p>Texto de conclusão 1</p>",
      conclusao_do_paa_ue_2: "",
      texto_pagina_paa_ue: null
    };
    getTextosPaaUe.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useGetTextosPaa(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.textosPaa).toEqual(mockData);
    expect(result.current.textosPaa.introducao_do_paa_ue_1).toBe("<p>Texto de introdução 1</p>");
    expect(result.current.textosPaa.introducao_do_paa_ue_2).toBeNull();
    expect(result.current.textosPaa.conclusao_do_paa_ue_1).toBe("<p>Texto de conclusão 1</p>");
    expect(result.current.textosPaa.conclusao_do_paa_ue_2).toBe("");
    expect(result.current.textosPaa.texto_pagina_paa_ue).toBeNull();
  });

  it("deve fazer nova requisição quando refetch é chamado", async () => {
    const mockData1 = {
      introducao_do_paa_ue_1: "<p>Texto 1</p>"
    };
    const mockData2 = {
      introducao_do_paa_ue_1: "<p>Texto 2 atualizado</p>"
    };

    getTextosPaaUe
      .mockResolvedValueOnce(mockData1)
      .mockResolvedValueOnce(mockData2);

    const { result } = renderHook(() => useGetTextosPaa(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.textosPaa).toEqual(mockData1);
    expect(getTextosPaaUe).toHaveBeenCalledTimes(1);

    // Chama refetch
    result.current.refetch();

    // Aguarda a nova requisição ser concluída
    await waitFor(() => expect(result.current.textosPaa).toEqual(mockData2));
    expect(getTextosPaaUe).toHaveBeenCalledTimes(2);
  });
});
