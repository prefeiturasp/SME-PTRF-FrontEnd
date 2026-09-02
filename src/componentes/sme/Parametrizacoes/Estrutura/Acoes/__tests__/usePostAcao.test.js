import React from "react";
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePostAcao } from "../hooks/usePostAcao";
import { postAddAcao } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

// Mocks do serviço de API e do utilitário Toast Custom
jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
  postAddAcao: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

describe("Hook usePostAcao", () => {
  let queryClient;
  let mockSetModalForm;

  // Provider wrapper para injetar o QueryClient nos testes de hooks do React Query
  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Espia a invalidação de queries para testar a chamada no onSuccess
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

  test("deve criar uma nova ação com sucesso, invalidar queries, fechar o modal e exibir toast de sucesso", async () => {
    const mockPayload = {
      nome: "Nova Ação Exemplo",
      recurso: "uuid-recurso-123",
      e_recursos_proprios: false,
    };

    postAddAcao.mockResolvedValueOnce({ status: 201, data: mockPayload });

    const { result } = renderHook(() => usePostAcao(mockSetModalForm), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutationPost.mutateAsync({
        payload: mockPayload,
      });
    });

    // 1. Verifica se o serviço postAddAcao foi chamado com o payload correto
    expect(postAddAcao).toHaveBeenCalledWith(mockPayload);

    // 2. Verifica se a chave 'acoes' foi invalidada no cache do React Query
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith(["acoes"]);

    // 3. Verifica se o modal foi fechado
    expect(mockSetModalForm).toHaveBeenCalledWith({ open: false });

    // 4. Verifica o disparo do toast verde de sucesso
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Ação criada com sucesso"
    );
  });

  test("deve tratar o erro e exibir ToastCustomError com mensagens em 'non_field_errors'", async () => {
    const errorResponse = {
      response: {
        data: {
          non_field_errors: ["Já existe uma ação com este nome para o recurso informado."],
        },
      },
    };

    postAddAcao.mockRejectedValueOnce(errorResponse);

    const { result } = renderHook(() => usePostAcao(mockSetModalForm), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutationPost.mutateAsync({
          payload: { nome: "Ação Duplicada" },
        });
      } catch (e) {
        // Captura a rejeição esperada da mutação
      }
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Erro ao criar ação",
      ["Já existe uma ação com este nome para o recurso informado."]
    );
    expect(mockSetModalForm).not.toHaveBeenCalled();
  });

  test("deve tratar erros genéricos/de rede e exibir ToastCustomError com mensagem de fallback padrão", async () => {
    const errorResponse = new Error("Network Error");

    postAddAcao.mockRejectedValueOnce(errorResponse);

    const { result } = renderHook(() => usePostAcao(mockSetModalForm), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutationPost.mutateAsync({
          payload: { nome: "Ação Falha" },
        });
      } catch (e) {
        // Captura a rejeição esperada da mutação
      }
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Erro ao criar ação",
      "Não foi possível criar a ação"
    );
    expect(mockSetModalForm).not.toHaveBeenCalled();
  });
});