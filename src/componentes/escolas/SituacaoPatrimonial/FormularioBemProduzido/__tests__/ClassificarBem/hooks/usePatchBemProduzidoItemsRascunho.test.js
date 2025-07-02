import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePatchBemProduzidoItemsRascunho } from "../../../ClassificarBem/hooks/usePatchBemProduzidoItemsRascunho";
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import { patchCadastrarBem } from "../../../../../../../services/escolas/BensProduzidos.service";

jest.mock("../../../../../../../services/escolas/BensProduzidos.service");
jest.mock("../../../../../../Globais/ToastCustom");

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

describe("usePatchBemProduzidoItemsRascunho", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve exibir toast de sucesso quando a mutação for bem-sucedida", async () => {
    patchCadastrarBem.mockResolvedValue({ success: true });

    const { result } = renderHook(() => usePatchBemProduzidoItemsRascunho(), {
      wrapper: createWrapper(),
    });

    result.current.mutationPatch.mutate({
      uuid: "test-uuid",
      payload: { nome: "Teste" },
    });

    await waitFor(() => {
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
        "Rascunho do bem produzido salvo com sucesso."
      );
    });
  });

  it("deve exibir toast de erro quando a mutação falhar", async () => {
    patchCadastrarBem.mockRejectedValue(new Error("Erro"));

    const { result } = renderHook(() => usePatchBemProduzidoItemsRascunho(), {
      wrapper: createWrapper(),
    });

    result.current.mutationPatch.mutate({
      uuid: "test-uuid",
      payload: { nome: "Teste" },
    });

    await waitFor(() => {
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Houve um erro ao salvar rascunho."
      );
    });
  });
});
