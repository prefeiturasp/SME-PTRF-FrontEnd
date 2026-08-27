import React from "react";
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { usePostReordenarAcoes } from "../../components/ReordenarAcoes/hooks/usePostReordenarAcoes";
import { postNovaOrdemAcoes } from "../../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

// Mocks das dependências externas
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock(
  "../../../../../../../services/sme/Parametrizacoes.service",
  () => ({
    postNovaOrdemAcoes: jest.fn(),
  })
);

jest.mock("../../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

describe("Hook usePostReordenarAcoes", () => {
  let queryClient;
  let mockSetModalFormConfirmAlterOrdenacao;
  const mockNavigate = jest.fn();

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
    mockSetModalFormConfirmAlterOrdenacao = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("deve reordenar ações com sucesso, invalidar queries, fechar o modal, navegar e exibir toast de sucesso", async () => {
    const mockPayload = { uuids_ordenados: ["uuid-1", "uuid-2"] };
    const mockRecursoUuid = "rec-123-uuid";

    postNovaOrdemAcoes.mockResolvedValueOnce({ status: 200, data: mockPayload });

    const { result } = renderHook(
      () =>
        usePostReordenarAcoes(
          mockSetModalFormConfirmAlterOrdenacao,
          mockRecursoUuid
        ),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      await result.current.mutationPost.mutateAsync(mockPayload);
    });

    // 1. Verifica se o serviço postNovaOrdemAcoes foi chamado recebendo o payload esperado
    expect(postNovaOrdemAcoes).toHaveBeenCalledWith(
      expect.objectContaining({
        uuids_ordenados: ["uuid-1", "uuid-2"],
      }),
      expect.anything()
    );

    // 2. Verifica se a chave 'acoes_ordenadas' foi invalidada no React Query
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith([
      "acoes_ordenadas",
    ]);

    // 3. Verifica se o estado do modal foi alterado para false
    expect(mockSetModalFormConfirmAlterOrdenacao).toHaveBeenCalledWith(false);

    // 4. Verifica o redirecionamento via navigate
    expect(mockNavigate).toHaveBeenCalledWith("/parametro-acoes", {
      state: { recurso_uuid: mockRecursoUuid },
      replace: true,
    });

    // 5. Verifica a exibição do toast de sucesso
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Ordenação alterada com sucesso!",
      "A ordenação na página de resumo dos recursos da UE foi atualizada."
    );
  });

  test("deve tratar o erro e exibir ToastCustomError com a mensagem de 'non_field_errors'", async () => {
    const errorResponse = {
      response: {
        data: {
          non_field_errors: ["A lista de UUIDs enviada é inválida."],
        },
      },
    };

    postNovaOrdemAcoes.mockRejectedValueOnce(errorResponse);

    const { result } = renderHook(
      () =>
        usePostReordenarAcoes(
          mockSetModalFormConfirmAlterOrdenacao,
          "rec-123"
        ),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      try {
        await result.current.mutationPost.mutateAsync({
          uuids_ordenados: ["invalid-uuid"],
        });
      } catch (e) {
        // Captura a rejeição esperada da mutação
      }
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Erro ao reordenar ações",
      ["A lista de UUIDs enviada é inválida."]
    );
    expect(mockSetModalFormConfirmAlterOrdenacao).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("deve tratar erro genérico e exibir ToastCustomError com mensagem de fallback padrão", async () => {
    const errorResponse = new Error("Network Error");

    postNovaOrdemAcoes.mockRejectedValueOnce(errorResponse);

    const { result } = renderHook(
      () =>
        usePostReordenarAcoes(
          mockSetModalFormConfirmAlterOrdenacao,
          "rec-123"
        ),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      try {
        await result.current.mutationPost.mutateAsync({
          uuids_ordenados: ["uuid-1"],
        });
      } catch (e) {
        // Captura a rejeição esperada
      }
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Erro ao reordenar ações",
      "Não foi possível reordenar as ações"
    );
    expect(mockSetModalFormConfirmAlterOrdenacao).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});