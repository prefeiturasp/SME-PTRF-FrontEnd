import React from "react";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDeleteContaAssociacao } from "../hooks/useDeleteContaAssociacao";
import { ContasDasAssociacoesContext } from "../context/ContasDasAssociacoesContext";
import { deleteContasAssociacoes } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
  deleteContasAssociacoes: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

describe("useDeleteContaAssociacao", () => {
  const setBloquearBtnSalvarForm = jest.fn();
  const handleCloseModalForm = jest.fn();

  const renderCustomHook = () => {
    const queryClient = new QueryClient();

    return renderHook(() => useDeleteContaAssociacao(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          <ContasDasAssociacoesContext.Provider value={{ setBloquearBtnSalvarForm, handleCloseModalForm }}>
            {children}
          </ContasDasAssociacoesContext.Provider>
        </QueryClientProvider>
      ),
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("remove conta de associação com sucesso", async () => {
    deleteContasAssociacoes.mockResolvedValue({});

    const { result } = renderCustomHook();

    await act(async () => {
      await result.current.mutationDelete.mutateAsync("conta-1");
    });

    expect(deleteContasAssociacoes).toHaveBeenCalledWith("conta-1");
    expect(handleCloseModalForm).toHaveBeenCalled();
    expect(setBloquearBtnSalvarForm).toHaveBeenCalledWith(false);
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Remoção da conta da associação efetuada com sucesso.",
      "A conta da associação foi removida do sistema com sucesso."
    );
  });

  it("exibe mensagem da API quando exclusão falha", async () => {
    deleteContasAssociacoes.mockRejectedValue({
      response: { data: { mensagem: "Não é possível excluir" } },
    });

    const { result } = renderCustomHook();

    await expect(result.current.mutationDelete.mutateAsync("conta-1")).rejects.toEqual({
      response: { data: { mensagem: "Não é possível excluir" } },
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Erro ao apagar conta de associação",
      "Não é possível excluir"
    );
    expect(setBloquearBtnSalvarForm).toHaveBeenCalledWith(false);
  });
});
