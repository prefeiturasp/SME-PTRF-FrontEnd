import React from "react";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePostContaAssociacao } from "../hooks/usePostContaAssociacao";
import { ContasDasAssociacoesContext } from "../context/ContasDasAssociacoesContext";
import { postContasAssociacoes } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
  postContasAssociacoes: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

describe("usePostContaAssociacao", () => {
  const setBloquearBtnSalvarForm = jest.fn();
  const handleCloseModalForm = jest.fn();

  const renderCustomHook = () => {
    const queryClient = new QueryClient();

    return renderHook(() => usePostContaAssociacao(), {
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

  it("cria conta de associação com sucesso", async () => {
    postContasAssociacoes.mockResolvedValue({});
    const payload = { associacao: "associacao-1" };

    const { result } = renderCustomHook();

    await act(async () => {
      await result.current.mutationPost.mutateAsync({ payload });
    });

    expect(postContasAssociacoes).toHaveBeenCalledWith(payload);
    expect(handleCloseModalForm).toHaveBeenCalled();
    expect(setBloquearBtnSalvarForm).toHaveBeenCalledWith(false);
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Inclusão de conta da associação realizada com sucesso.",
      "A conta da associação foi adicionada ao sistema com sucesso."
    );
  });

  it("exibe erro de validação da API", async () => {
    postContasAssociacoes.mockRejectedValue({
      response: { data: { non_field_errors: "Conta já existe" } },
    });

    const { result } = renderCustomHook();

    await expect(result.current.mutationPost.mutateAsync({ payload: {} })).rejects.toEqual({
      response: { data: { non_field_errors: "Conta já existe" } },
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Erro ao criar conta de associação",
      "Conta já existe"
    );
    expect(setBloquearBtnSalvarForm).toHaveBeenCalledWith(false);
  });
});
