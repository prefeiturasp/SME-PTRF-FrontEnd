import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDeleteAcao } from "../hooks/useDeleteAcao";
import { deleteAcao } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

// Mocks dos serviços e do utilitário de Toast
jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
  deleteAcao: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

describe("Hook useDeleteAcao", () => {
  let queryClient;
  let mockSetModalForm;

  // Wrapper auxiliar para fornecer o QueryClientProvider ao hook renderizado
  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Espia o método invalidateQueries para verificar se é chamado no onSuccess
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

  test("deve disparar a exclusão com o UUID correto e executar as ações de sucesso (onSuccess)", async () => {
    deleteAcao.mockResolvedValueOnce({ status: 204 });

    const { result } = renderHook(() => useDeleteAcao(mockSetModalForm), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutationDelete.mutateAsync("uuid-acao-123");
    });

    // Verifica se a API de deleção foi chamada com o parâmetro esperado
    expect(deleteAcao).toHaveBeenCalledWith("uuid-acao-123");

    // Verifica a invalidação das queries da chave 'acoes'
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith(["acoes"]);

    // Verifica o fechamento do modal
    expect(mockSetModalForm).toHaveBeenCalledWith({ open: false });

    // Verifica a exibição do toast de sucesso
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Ação excluída com sucesso"
    );
  });

  test("deve tratar o erro e exibir ToastCustomError com e.response.data.detail", async () => {
    const errorResponse = {
      response: {
        data: {
          detail: "Ação associada a um recurso ativo e não pode ser excluída.",
        },
      },
    };

    deleteAcao.mockRejectedValueOnce(errorResponse);

    const { result } = renderHook(() => useDeleteAcao(mockSetModalForm), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutationDelete.mutateAsync("uuid-acao-123");
      } catch (e) {
        // Captura o erro rejeitado da mutation
      }
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Exclusão de ação não permitida",
      "Ação associada a um recurso ativo e não pode ser excluída."
    );
  });

  test("deve tratar o erro e exibir ToastCustomError com e.response.data.mensagem quando detail não existir", async () => {
    const errorResponse = {
      response: {
        data: {
          mensagem: "Mensagem alternativa de erro vinda do backend.",
        },
      },
    };

    deleteAcao.mockRejectedValueOnce(errorResponse);

    const { result } = renderHook(() => useDeleteAcao(mockSetModalForm), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutationDelete.mutateAsync("uuid-acao-123");
      } catch (e) {
        // Captura a rejeição
      }
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Exclusão de ação não permitida",
      "Mensagem alternativa de erro vinda do backend."
    );
  });

  test("deve tratar erro genérico de rede/desconhecido com a mensagem de fallback padrão", async () => {
    const errorResponse = new Error("Network Error");

    deleteAcao.mockRejectedValueOnce(errorResponse);

    const { result } = renderHook(() => useDeleteAcao(mockSetModalForm), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutationDelete.mutateAsync("uuid-acao-123");
      } catch (e) {
        // Captura a rejeição
      }
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Erro ao excluir ação",
      "Houve um erro ao tentar completar a ação."
    );
  });
});