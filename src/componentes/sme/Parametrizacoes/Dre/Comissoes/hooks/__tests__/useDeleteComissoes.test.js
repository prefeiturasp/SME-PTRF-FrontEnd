import { act } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDeleteComissoes } from "../useDeleteComissoes";
import { deleteComissao } from "../../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import { ComissoesContext } from "../../context/Comissoes";

jest.mock("../../../../../../../services/sme/Parametrizacoes.service", () => ({
  deleteComissao: jest.fn(),
}));

jest.mock("../../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

describe("useDeleteComissoes", () => {
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

  it("exclui comissão com sucesso", async () => {
    deleteComissao.mockResolvedValueOnce({});
    const { result } = renderHook(() => useDeleteComissoes(), { wrapper });

    await act(async () => {
      result.current.mutationDelete.mutate("uuid-1");
    });

    await waitFor(() =>
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled()
    );
    expect(deleteComissao).toHaveBeenCalledWith("uuid-1");
    expect(handleCloseModalForm).toHaveBeenCalled();
  });

  it("exibe mensagem da API em erro", async () => {
    deleteComissao.mockRejectedValueOnce({
      response: { data: { mensagem: "Em uso" } },
    });
    const { result } = renderHook(() => useDeleteComissoes(), { wrapper });

    await act(async () => {
      result.current.mutationDelete.mutate("uuid-1");
    });

    await waitFor(() =>
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Erro ao apagar a comissão",
        "Em uso"
      )
    );
  });

  it("exibe erro genérico", async () => {
    deleteComissao.mockRejectedValueOnce({ response: { data: {} } });
    const { result } = renderHook(() => useDeleteComissoes(), { wrapper });

    await act(async () => {
      result.current.mutationDelete.mutate("uuid-1");
    });

    await waitFor(() =>
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Erro ao apagar a comissão",
        "Não foi possível apagar a comissão"
      )
    );
  });
});
