import React from "react";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePatchContaAssociacao } from "../hooks/usePatchContaAssociacao";
import { ContasDasAssociacoesContext } from "../context/ContasDasAssociacoesContext";
import { patchContasAssociacoes } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
  patchContasAssociacoes: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

describe("usePatchContaAssociacao", () => {
  const setBloquearBtnSalvarForm = jest.fn();
  const handleCloseModalForm = jest.fn();

  const renderCustomHook = () => {
    const queryClient = new QueryClient();

    return renderHook(() => usePatchContaAssociacao(), {
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

  it("edita conta de associação com sucesso", async () => {
    patchContasAssociacoes.mockResolvedValue({});
    const payload = { status: "ATIVA" };

    const { result } = renderCustomHook();

    await act(async () => {
      await result.current.mutationPatch.mutateAsync({ uuidContaAssociacao: "conta-1", payload });
    });

    expect(patchContasAssociacoes).toHaveBeenCalledWith("conta-1", payload);
    expect(handleCloseModalForm).toHaveBeenCalled();
    expect(setBloquearBtnSalvarForm).toHaveBeenCalledWith(false);
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Edição da conta da associação realizada com sucesso.",
      "A conta da associação foi editada no sistema com sucesso."
    );
  });

  it("exibe erro genérico", async () => {
    patchContasAssociacoes.mockRejectedValue({ response: { data: {} } });

    const { result } = renderCustomHook();

    await expect(
      result.current.mutationPatch.mutateAsync({ uuidContaAssociacao: "conta-1", payload: {} })
    ).rejects.toEqual({ response: { data: {} } });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Erro ao atualizar conta de associação",
      "Tente novamente."
    );
    expect(setBloquearBtnSalvarForm).toHaveBeenCalledWith(false);
  });
});
