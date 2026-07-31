import { act } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePostComissoes } from "../usePostComissoes";
import { postComissao } from "../../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import { ComissoesContext } from "../../context/Comissoes";

jest.mock("../../../../../../../services/sme/Parametrizacoes.service", () => ({
  postComissao: jest.fn(),
}));

jest.mock("../../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

describe("usePostComissoes", () => {
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

  it("cria comissão com sucesso", async () => {
    postComissao.mockResolvedValueOnce({});
    const { result } = renderHook(() => usePostComissoes(), { wrapper });

    await act(async () => {
      result.current.mutationPost.mutate({ payload: { nome: "Nova" } });
    });

    await waitFor(() =>
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled()
    );
    expect(postComissao).toHaveBeenCalledWith({ nome: "Nova" });
    expect(handleCloseModalForm).toHaveBeenCalled();
    expect(setBloquearBtnSalvarForm).toHaveBeenCalledWith(false);
  });

  it("exibe erro de non_field_errors", async () => {
    postComissao.mockRejectedValueOnce({
      response: { data: { non_field_errors: "Já existe" } },
    });
    const { result } = renderHook(() => usePostComissoes(), { wrapper });

    await act(async () => {
      result.current.mutationPost.mutate({ payload: { nome: "Dup" } });
    });

    await waitFor(() =>
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Erro ao adicionar a comissão",
        "Já existe"
      )
    );
  });

  it("exibe erro genérico", async () => {
    postComissao.mockRejectedValueOnce({ response: { data: {} } });
    const { result } = renderHook(() => usePostComissoes(), { wrapper });

    await act(async () => {
      result.current.mutationPost.mutate({ payload: { nome: "X" } });
    });

    await waitFor(() =>
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Erro ao adicionar a comissão",
        "Não foi possível adicionar a comissão"
      )
    );
  });
});
