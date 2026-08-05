import { act } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePatchComissao } from "../usePatchComissoes";
import { patchComissao } from "../../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import { ComissoesContext } from "../../context/Comissoes";

jest.mock("../../../../../../../services/sme/Parametrizacoes.service", () => ({
  patchComissao: jest.fn(),
}));

jest.mock("../../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

describe("usePatchComissao", () => {
  const handleCloseModalForm = jest.fn();
  const setBloquearBtnSalvarForm = jest.fn();
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <ComissoesContext.Provider
        value={{ handleCloseModalForm, setBloquearBtnSalvarForm }}
      >
        {children}
      </ComissoesContext.Provider>
    </QueryClientProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("atualiza comissão com sucesso", async () => {
    patchComissao.mockResolvedValueOnce({});
    const { result } = renderHook(() => usePatchComissao(), { wrapper });

    await act(async () => {
      result.current.mutationPatch.mutate({
        uuidComissao: "u1",
        payload: { nome: "Editada" },
      });
    });

    await waitFor(() =>
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled()
    );
    expect(patchComissao).toHaveBeenCalledWith("u1", { nome: "Editada" });
    expect(handleCloseModalForm).toHaveBeenCalled();
  });

  it("exibe erro de non_field_errors", async () => {
    patchComissao.mockRejectedValueOnce({
      response: { data: { non_field_errors: "Duplicada" } },
    });
    const { result } = renderHook(() => usePatchComissao(), { wrapper });

    await act(async () => {
      result.current.mutationPatch.mutate({
        uuidComissao: "u1",
        payload: { nome: "Dup" },
      });
    });

    await waitFor(() =>
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Erro ao atualizar a comissão",
        "Duplicada"
      )
    );
  });

  it("exibe erro genérico", async () => {
    patchComissao.mockRejectedValueOnce({ response: { data: {} } });
    const { result } = renderHook(() => usePatchComissao(), { wrapper });

    await act(async () => {
      result.current.mutationPatch.mutate({
        uuidComissao: "u1",
        payload: { nome: "X" },
      });
    });

    await waitFor(() =>
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Erro ao atualizar a comissão",
        "Não foi possível atualizar a comissão"
      )
    );
  });
});
