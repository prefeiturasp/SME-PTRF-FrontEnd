import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePostReceitaPrevistaPdde } from "../../hooks/usePostReceitaPrevistaPdde";
import { postReceitaPrevistaPDDE } from "../../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";

jest.mock("../../../../../../../../services/escolas/Paa.service");
jest.mock("../../../../../../../Globais/ToastCustom");

localStorage.setItem("PAA", "fake-uuid-paa")

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

describe("usePostReceitaPrevistaPdde", () => {
  const setModalForm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve executar patch com sucesso", async () => {
    const mockPayload = {
      paa: localStorage.getItem("PAA"),
      acao_pdde: "acao-pdde-uuid-1234",
      saldo_custeio: 100.00,
      saldo_capital: 200.00,
      saldo_livre: 300.00,
      previsao_valor_custeio: 50.00,
      previsao_valor_capital: 60.00,
      previsao_valor_livre: 70.00,
    };
    postReceitaPrevistaPDDE.mockResolvedValueOnce({ status: 201 });

    const { result } = renderHook(() => usePostReceitaPrevistaPdde(setModalForm), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutationPost.mutate(mockPayload);
    });

    await waitFor(() => expect(postReceitaPrevistaPDDE).toHaveBeenCalledWith(mockPayload));
    await waitFor(() => expect(setModalForm).toHaveBeenCalledWith({ open: false }));
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      'Sucesso',
      'Criação de Receita Prevista PDDE realizada com sucesso.'
    );
  });

  it("deve lidar com erro no post", async () => {
    const mockPayload = {
      paa: localStorage.getItem("PAA")
    };
    postReceitaPrevistaPDDE.mockRejectedValueOnce(new Error("Erro"));

    const { result } = renderHook(() => usePostReceitaPrevistaPdde(setModalForm), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutationPost.mutate(mockPayload);
    });

    await waitFor(() => expect(result.current.mutationPost.isError).toBe(true));
    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Ops!",
      "Não foi possível criar a Receita Prevista PDDE"
    );
  });
});
