import { act } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePostReceitaPrevistaPdde } from "../../hooks/usePostReceitaPrevistaPdde";
import { postReceitaPrevistaPDDE } from "../../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";

jest.mock("../../../../../../../../services/escolas/Paa.service", () => ({
  postReceitaPrevistaPDDE: jest.fn(),
}));

jest.mock("../../../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

const mockPayload = {
  paa: "fake-uuid-paa",
  acao_pdde: "acao-pdde-uuid-1234",
  saldo_custeio: 100.0,
  saldo_capital: 200.0,
  saldo_livre: 300.0,
  previsao_valor_custeio: 50.0,
  previsao_valor_capital: 60.0,
  previsao_valor_livre: 70.0,
};

describe("usePostReceitaPrevistaPdde", () => {
  let queryClient;
  const setModalForm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("PAA", "fake-uuid-paa");
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("retorna mutationPost com função mutate", () => {
    const { result } = renderHook(
      () => usePostReceitaPrevistaPdde(setModalForm),
      { wrapper }
    );

    expect(result.current.mutationPost).toBeDefined();
    expect(typeof result.current.mutationPost.mutate).toBe("function");
  });

  it("chama o serviço postReceitaPrevistaPDDE com o payload correto", async () => {
    postReceitaPrevistaPDDE.mockResolvedValueOnce({ status: 201 });

    const { result } = renderHook(
      () => usePostReceitaPrevistaPdde(setModalForm),
      { wrapper }
    );

    act(() => {
      result.current.mutationPost.mutate(mockPayload);
    });

    await waitFor(() =>
      expect(postReceitaPrevistaPDDE).toHaveBeenCalledWith(mockPayload)
    );
  });

  it("chama setModalForm com { open: false } após sucesso", async () => {
    postReceitaPrevistaPDDE.mockResolvedValueOnce({ status: 201 });

    const { result } = renderHook(
      () => usePostReceitaPrevistaPdde(setModalForm),
      { wrapper }
    );

    act(() => {
      result.current.mutationPost.mutate(mockPayload);
    });

    await waitFor(() =>
      expect(setModalForm).toHaveBeenCalledWith({ open: false })
    );
  });

  it("exibe toast de sucesso após mutação bem-sucedida", async () => {
    postReceitaPrevistaPDDE.mockResolvedValueOnce({ status: 201 });

    const { result } = renderHook(
      () => usePostReceitaPrevistaPdde(setModalForm),
      { wrapper }
    );

    act(() => {
      result.current.mutationPost.mutate(mockPayload);
    });

    await waitFor(() =>
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
        "Sucesso",
        "Criação de Receita Prevista PDDE realizada com sucesso."
      )
    );
  });

  it("exibe toast de erro quando o serviço falha", async () => {
    postReceitaPrevistaPDDE.mockRejectedValueOnce(new Error("Erro na API"));

    const { result } = renderHook(
      () => usePostReceitaPrevistaPdde(setModalForm),
      { wrapper }
    );

    act(() => {
      result.current.mutationPost.mutate(mockPayload);
    });

    await waitFor(() =>
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Ops!",
        "Não foi possível criar a Receita Prevista PDDE"
      )
    );
  });

  it("coloca mutationPost em estado de erro quando o serviço falha", async () => {
    postReceitaPrevistaPDDE.mockRejectedValueOnce(new Error("Erro na API"));

    const { result } = renderHook(
      () => usePostReceitaPrevistaPdde(setModalForm),
      { wrapper }
    );

    act(() => {
      result.current.mutationPost.mutate(mockPayload);
    });

    await waitFor(() =>
      expect(result.current.mutationPost.isError).toBe(true)
    );
  });

  it("não chama setModalForm quando o serviço falha", async () => {
    postReceitaPrevistaPDDE.mockRejectedValueOnce(new Error("Erro na API"));

    const { result } = renderHook(
      () => usePostReceitaPrevistaPdde(setModalForm),
      { wrapper }
    );

    act(() => {
      result.current.mutationPost.mutate(mockPayload);
    });

    await waitFor(() =>
      expect(result.current.mutationPost.isError).toBe(true)
    );

    expect(setModalForm).not.toHaveBeenCalled();
  });
});
