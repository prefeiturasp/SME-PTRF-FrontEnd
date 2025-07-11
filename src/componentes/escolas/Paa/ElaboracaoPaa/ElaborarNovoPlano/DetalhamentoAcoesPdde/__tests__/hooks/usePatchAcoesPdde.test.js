import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePatchReceitaPrevistaPdde } from "../../hooks/usePatchReceitaPrevistaPdde";
import { patchReceitaPrevistaPDDE } from "../../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";

jest.mock("../../../../../../../../services/escolas/Paa.service");
jest.mock("../../../../../../../Globais/ToastCustom");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("usePatchReceitaPrevistaPdde", () => {
  const setModalForm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve executar patch com sucesso", async () => {
    const mockPayload = { nome: "Nova Ação" };
    const mockUuid = "123-abc";
    patchReceitaPrevistaPDDE.mockResolvedValueOnce({ status: 200 });

    const { result } = renderHook(() => usePatchReceitaPrevistaPdde(setModalForm), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutationPatch.mutate({ uuid: mockUuid, payload: mockPayload });
    });

    await waitFor(() => expect(patchReceitaPrevistaPDDE).toHaveBeenCalledWith(mockUuid, mockPayload));
    await waitFor(() => expect(setModalForm).toHaveBeenCalledWith({ open: false }));
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      'Sucesso',
      'Edição da Receita Prevista PDDE realizado com sucesso.'
    );
  });

  it("deve lidar com erro no patch", async () => {
    const mockPayload = { nome: "Ação com Erro" };
    const mockUuid = "456-def";
    patchReceitaPrevistaPDDE.mockRejectedValueOnce(new Error("Erro"));

    const { result } = renderHook(() => usePatchReceitaPrevistaPdde(setModalForm), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutationPatch.mutate({ uuid: mockUuid, payload: mockPayload });
    });

    await waitFor(() => expect(result.current.mutationPatch.isError).toBe(true));
    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Ops!",
      "Não foi possível atualizar a Receita Prevista PDDE"
    );
  });
});
