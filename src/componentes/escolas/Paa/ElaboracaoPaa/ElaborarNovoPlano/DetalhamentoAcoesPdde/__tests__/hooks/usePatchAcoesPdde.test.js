import { act } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePatchReceitaPrevistaPdde } from "../../hooks/usePatchReceitaPrevistaPdde";
import { patchReceitaPrevistaPDDE } from "../../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";

jest.mock("../../../../../../../../services/escolas/Paa.service", () => ({
  patchReceitaPrevistaPDDE: jest.fn(),
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

const mockUuid = "1de0c2ac-8468-48a6-89e8-14ffa0d78131";
const mockPayload = {
  saldo_custeio: 200.0,
  saldo_capital: 100.0,
  saldo_livre: 300.0,
  previsao_valor_custeio: 60.0,
  previsao_valor_capital: 50.0,
  previsao_valor_livre: 70.0,
};

describe("usePatchReceitaPrevistaPdde", () => {
  let queryClient;
  const setModalForm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
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

  it("retorna mutationPatch com função mutate", () => {
    const { result } = renderHook(
      () => usePatchReceitaPrevistaPdde(setModalForm),
      { wrapper }
    );

    expect(result.current.mutationPatch).toBeDefined();
    expect(typeof result.current.mutationPatch.mutate).toBe("function");
  });

  it("chama o serviço patchReceitaPrevistaPDDE com uuid e payload corretos", async () => {
    patchReceitaPrevistaPDDE.mockResolvedValueOnce({ status: 200 });

    const { result } = renderHook(
      () => usePatchReceitaPrevistaPdde(setModalForm),
      { wrapper }
    );

    act(() => {
      result.current.mutationPatch.mutate({ uuid: mockUuid, payload: mockPayload });
    });

    await waitFor(() =>
      expect(patchReceitaPrevistaPDDE).toHaveBeenCalledWith(mockUuid, mockPayload)
    );
  });

  it("chama setModalForm com { open: false } após sucesso", async () => {
    patchReceitaPrevistaPDDE.mockResolvedValueOnce({ status: 200 });

    const { result } = renderHook(
      () => usePatchReceitaPrevistaPdde(setModalForm),
      { wrapper }
    );

    act(() => {
      result.current.mutationPatch.mutate({ uuid: mockUuid, payload: mockPayload });
    });

    await waitFor(() =>
      expect(setModalForm).toHaveBeenCalledWith({ open: false })
    );
  });

  it("exibe toast de sucesso após mutação bem-sucedida", async () => {
    patchReceitaPrevistaPDDE.mockResolvedValueOnce({ status: 200 });

    const { result } = renderHook(
      () => usePatchReceitaPrevistaPdde(setModalForm),
      { wrapper }
    );

    act(() => {
      result.current.mutationPatch.mutate({ uuid: mockUuid, payload: mockPayload });
    });

    await waitFor(() =>
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
        "Sucesso",
        "Edição da Receita Prevista PDDE realizado com sucesso."
      )
    );
  });

  it("exibe toast de erro quando o serviço falha", async () => {
    patchReceitaPrevistaPDDE.mockRejectedValueOnce(new Error("Erro na API"));

    const { result } = renderHook(
      () => usePatchReceitaPrevistaPdde(setModalForm),
      { wrapper }
    );

    act(() => {
      result.current.mutationPatch.mutate({ uuid: mockUuid, payload: mockPayload });
    });

    await waitFor(() =>
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Ops!",
        "Não foi possível atualizar a Receita Prevista PDDE"
      )
    );
  });

  it("coloca mutationPatch em estado de erro quando o serviço falha", async () => {
    patchReceitaPrevistaPDDE.mockRejectedValueOnce(new Error("Erro na API"));

    const { result } = renderHook(
      () => usePatchReceitaPrevistaPdde(setModalForm),
      { wrapper }
    );

    act(() => {
      result.current.mutationPatch.mutate({ uuid: mockUuid, payload: mockPayload });
    });

    await waitFor(() =>
      expect(result.current.mutationPatch.isError).toBe(true)
    );
  });

  it("não chama setModalForm quando o serviço falha", async () => {
    patchReceitaPrevistaPDDE.mockRejectedValueOnce(new Error("Erro na API"));

    const { result } = renderHook(
      () => usePatchReceitaPrevistaPdde(setModalForm),
      { wrapper }
    );

    act(() => {
      result.current.mutationPatch.mutate({ uuid: mockUuid, payload: mockPayload });
    });

    await waitFor(() =>
      expect(result.current.mutationPatch.isError).toBe(true)
    );

    expect(setModalForm).not.toHaveBeenCalled();
  });
});
