import React from "react";
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePatchAcao } from "../hooks/usePatchAcao";
import { putAtualizarAcao } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

// Mocks dos serviços de API e do utilitário Toast Custom
jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
  putAtualizarAcao: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

describe("Hook usePatchAcao", () => {
  let queryClient;
  let mockSetModalForm;

  // Provider wrapper para injetar o QueryClient
  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    jest.spyOn(queryClient, "invalidateQueries");

    return ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSetModalForm = jest.fn();
  });

  test("deve atualizar a ação com sucesso, invalidar queries, fechar o modal e exibir toast de sucesso", async () => {
    const mockPayload = { nome: "Ação Atualizada" };
    const mockUUID = "uuid-123-acao";

    putAtualizarAcao.mockResolvedValueOnce({ status: 200, data: mockPayload });

    const { result } = renderHook(() => usePatchAcao(mockSetModalForm), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutationPatch.mutateAsync({
        UUID: mockUUID,
        payload: mockPayload,
      });
    });

    // 1. Verifica se o serviço de API foi chamado com os argumentos corretos
    expect(putAtualizarAcao).toHaveBeenCalledWith(mockUUID, mockPayload);

    // 2. Verifica se a chave 'acoes' foi invalidada no React Query
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith(["acoes"]);

    // 3. Verifica se fechou o modal
    expect(mockSetModalForm).toHaveBeenCalledWith({ open: false });

    // 4. Verifica o disparo do toast de sucesso
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Ação alterada com sucesso"
    );
  });

  test("deve tratar o erro e exibir ToastCustomError com a mensagem de 'non_field_errors'", async () => {
    const errorResponse = {
      response: {
        data: {
          non_field_errors: ["Já existe uma ação cadastrada com este nome."],
        },
      },
    };

    putAtualizarAcao.mockRejectedValueOnce(errorResponse);

    const { result } = renderHook(() => usePatchAcao(mockSetModalForm), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutationPatch.mutateAsync({
          UUID: "uuid-123-acao",
          payload: { nome: "Ação Duplicada" },
        });
      } catch (e) {
        // Captura a rejeição esperada
      }
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Erro ao atualizar ação",
      ["Já existe uma ação cadastrada com este nome."]
    );
    expect(mockSetModalForm).not.toHaveBeenCalled();
  });

  test("deve tratar erros genéricos e exibir ToastCustomError com mensagem de fallback padrão", async () => {
    const errorResponse = new Error("Network Error");

    putAtualizarAcao.mockRejectedValueOnce(errorResponse);

    const { result } = renderHook(() => usePatchAcao(mockSetModalForm), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutationPatch.mutateAsync({
          UUID: "uuid-123-acao",
          payload: { nome: "Nova Ação" },
        });
      } catch (e) {
        // Captura a rejeição esperada
      }
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Erro ao atualizar ação",
      "Houve um erro ao tentar completar a ação."
    );
    expect(mockSetModalForm).not.toHaveBeenCalled();
  });
});