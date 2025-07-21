import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePatchBemProduzido } from "../../hooks/usePatchBemProduzido";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { patchBemProduzido } from "../../../../../../services/escolas/BensProduzidos.service";

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

describe("usePatchBemProduzido", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve exibir toast de sucesso quando a mutação for bem-sucedida", async () => {
    patchBemProduzido.mockResolvedValue({ success: true });

    const { result } = renderHook(() => usePatchBemProduzido(), {
      wrapper: createWrapper(),
    });

    result.current.mutationPatch.mutate({
      uuid: "test-uuid",
      payload: { nome: "Teste" },
    });

    await waitFor(() => {
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
        "Bem produzido salvo com sucesso."
      );
    });
  });

  it("deve exibir toast de erro quando a mutação falhar", async () => {
    patchBemProduzido.mockRejectedValue(new Error("Erro"));

    const { result } = renderHook(() => usePatchBemProduzido(), {
      wrapper: createWrapper(),
    });

    result.current.mutationPatch.mutate({
      uuid: "test-uuid",
      payload: { nome: "Teste" },
    });

    await waitFor(() => {
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Houve um erro ao salvar bem produzido."
      );
    });
  });
});
