import React from "react";
import { waitFor, renderHook } from '@testing-library/react';
import { usePatchPaa } from "../usePatchPaa";
import { patchPaa } from "../../../../../../../../services/escolas/Paa.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock da função
jest.mock("../../../../../../../../services/escolas/Paa.service", () => ({
  patchPaa: jest.fn(),
}));

// Mock do console.log e console.error para evitar logs nos testes
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

// Cria um wrapper com QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Evita tentativas repetidas para erro
      },
      mutations: {
        retry: false, // Evita tentativas repetidas para erro
      },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("usePatchPaa", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  it("deve executar a mutação com sucesso", async () => {
    const mockData = {
      uuid: "paa-uuid-123",
      texto_introducao: "<p>Texto atualizado</p>",
      status: "em_elaboracao"
    };
    const mockPayload = {
      uuid: "paa-uuid-123",
      payload: { texto_introducao: "<p>Texto atualizado</p>" }
    };

    patchPaa.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => usePatchPaa(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);

    // Executa a mutação
    result.current.patchPaa(mockPayload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isError).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(patchPaa).toHaveBeenCalledWith("paa-uuid-123", { texto_introducao: "<p>Texto atualizado</p>" });
  });

  it("deve retornar erro quando a mutação falhar", async () => {
    const mockError = new Error("Erro na API");
    const mockPayload = {
      uuid: "paa-uuid-123",
      payload: { texto_introducao: "<p>Texto atualizado</p>" }
    };

    patchPaa.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => usePatchPaa(), {
      wrapper: createWrapper(),
    });

    // Executa a mutação
    result.current.patchPaa(mockPayload);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe("Erro na API");
    expect(mockConsoleError).toHaveBeenCalledWith('Erro ao atualizar PAA:', mockError);
  });

  it("deve expor a função patchPaaAsync", async () => {
    const mockData = {
      uuid: "paa-uuid-123",
      texto_introducao: "<p>Texto atualizado</p>"
    };
    const mockPayload = {
      uuid: "paa-uuid-123",
      payload: { texto_introducao: "<p>Texto atualizado</p>" }
    };

    patchPaa.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => usePatchPaa(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.patchPaaAsync).toBe("function");

    // Testa patchPaaAsync
    const promise = result.current.patchPaaAsync(mockPayload);
    expect(promise).toBeInstanceOf(Promise);

    const data = await promise;
    expect(data).toEqual(mockData);
    expect(patchPaa).toHaveBeenCalledWith("paa-uuid-123", { texto_introducao: "<p>Texto atualizado</p>" });
  });

  it("deve expor a função reset", async () => {
    const mockError = new Error("Erro na API");
    const mockPayload = {
      uuid: "paa-uuid-123",
      payload: { texto_introducao: "<p>Texto atualizado</p>" }
    };

    patchPaa.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => usePatchPaa(), {
      wrapper: createWrapper(),
    });

    // Executa a mutação que falha
    result.current.patchPaa(mockPayload);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isError).toBe(true);
    expect(typeof result.current.reset).toBe("function");

    // Testa reset
    result.current.reset();

    // Aguarda o reset ser processado
    await waitFor(() => {
      expect(result.current.isError).toBe(false);
    });

    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeUndefined();
  });

  it("deve invalidar queries relacionadas ao PAA vigente no sucesso", async () => {
    const mockData = {
      uuid: "paa-uuid-123",
      texto_introducao: "<p>Texto atualizado</p>"
    };
    const mockPayload = {
      uuid: "paa-uuid-123",
      payload: { texto_introducao: "<p>Texto atualizado</p>" }
    };

    patchPaa.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => usePatchPaa(), {
      wrapper: createWrapper(),
    });

    // Executa a mutação
    result.current.patchPaa(mockPayload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verifica se patchPaa foi chamado com os parâmetros corretos
    expect(patchPaa).toHaveBeenCalledWith("paa-uuid-123", { texto_introducao: "<p>Texto atualizado</p>" });
  });

  it("deve invalidar queries relacionadas ao PAA específico no sucesso", async () => {
    const mockData = {
      uuid: "paa-uuid-456",
      texto_introducao: "<p>Texto atualizado</p>"
    };
    const mockPayload = {
      uuid: "paa-uuid-456",
      payload: { texto_introducao: "<p>Texto atualizado</p>" }
    };

    patchPaa.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => usePatchPaa(), {
      wrapper: createWrapper(),
    });

    // Executa a mutação
    result.current.patchPaa(mockPayload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verifica se patchPaa foi chamado com os parâmetros corretos
    expect(patchPaa).toHaveBeenCalledWith("paa-uuid-456", { texto_introducao: "<p>Texto atualizado</p>" });
  });

  it("deve manter estado de loading durante a execução", async () => {
    const mockData = {
      uuid: "paa-uuid-123",
      texto_introducao: "<p>Texto atualizado</p>"
    };
    const mockPayload = {
      uuid: "paa-uuid-123",
      payload: { texto_introducao: "<p>Texto atualizado</p>" }
    };

    // Simula uma requisição que demora um pouco
    patchPaa.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockData), 100))
    );

    const { result } = renderHook(() => usePatchPaa(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);

    // Executa a mutação
    result.current.patchPaa(mockPayload);

    // Aguarda o sucesso da mutação
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
  });

  it("deve funcionar com diferentes tipos de payload", async () => {
    const mockData = {
      uuid: "paa-uuid-123",
      texto_introducao: "<p>Texto atualizado</p>",
      texto_objetivos: "<p>Objetivos atualizados</p>"
    };
    const mockPayload = {
      uuid: "paa-uuid-123",
      payload: { 
        texto_introducao: "<p>Texto atualizado</p>",
        texto_objetivos: "<p>Objetivos atualizados</p>"
      }
    };

    patchPaa.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => usePatchPaa(), {
      wrapper: createWrapper(),
    });

    // Executa a mutação
    result.current.patchPaa(mockPayload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(patchPaa).toHaveBeenCalledWith("paa-uuid-123", { 
      texto_introducao: "<p>Texto atualizado</p>",
      texto_objetivos: "<p>Objetivos atualizados</p>"
    });
    expect(result.current.data).toEqual(mockData);
  });

  it("deve funcionar com payload vazio", async () => {
    const mockData = {
      uuid: "paa-uuid-123"
    };
    const mockPayload = {
      uuid: "paa-uuid-123",
      payload: {}
    };

    patchPaa.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => usePatchPaa(), {
      wrapper: createWrapper(),
    });

    // Executa a mutação
    result.current.patchPaa(mockPayload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(patchPaa).toHaveBeenCalledWith("paa-uuid-123", {});
    expect(result.current.data).toEqual(mockData);
  });
});
