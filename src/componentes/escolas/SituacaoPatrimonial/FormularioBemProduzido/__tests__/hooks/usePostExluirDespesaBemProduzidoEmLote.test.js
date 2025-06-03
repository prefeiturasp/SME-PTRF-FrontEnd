import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePostExluirDespesaBemProduzidoEmLote } from "../../hooks/usePostExluirDespesaBemProduzidoEmLote";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { postExluirDespesaBemProduzidoEmLote } from "../../../../../../services/escolas/BensProduzidos.service";

jest.mock("../../../../../../services/escolas/BensProduzidos.service");
jest.mock("../../../../../Globais/ToastCustom");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("usePostExluirDespesaBemProduzidoEmLote", () => {
  const mockSetDespesasSelecionadas = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve executar todas as ações de sucesso quando a mutação for bem-sucedida", async () => {
    postExluirDespesaBemProduzidoEmLote.mockResolvedValue({ success: true });

    const { result } = renderHook(
      () => usePostExluirDespesaBemProduzidoEmLote(mockSetDespesasSelecionadas),
      {
        wrapper: createWrapper(),
      }
    );

    result.current.mutationPost.mutate({
      uuid: "test-uuid",
      payload: { ids: [1, 2, 3] },
    });

    await waitFor(() => {
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
        "Operação executada com sucesso."
      );
      expect(mockSetDespesasSelecionadas).toHaveBeenCalledWith([]);
    });
  });

  it("deve exibir toast de erro quando a mutação falhar", async () => {
    postExluirDespesaBemProduzidoEmLote.mockRejectedValue(new Error("Erro"));

    const { result } = renderHook(
      () => usePostExluirDespesaBemProduzidoEmLote(mockSetDespesasSelecionadas),
      {
        wrapper: createWrapper(),
      }
    );

    result.current.mutationPost.mutate({
      uuid: "test-uuid",
      payload: { ids: [1, 2, 3] },
    });

    await waitFor(() => {
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Houve um erro ao executar operação."
      );
    });
  });
});
