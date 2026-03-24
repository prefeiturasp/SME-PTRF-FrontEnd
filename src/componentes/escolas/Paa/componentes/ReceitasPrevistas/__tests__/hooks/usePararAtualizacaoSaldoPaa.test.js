import { act } from "react";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAtivarSaldoPAA, useDesativarSaldoPAA } from "../../hooks/usePararAtualizacaoSaldoPaa";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";
import { postDesativarAtualizacaoSaldoPAA, postAtivarAtualizacaoSaldoPAA } from "../../../../../../../../services/escolas/Paa.service";

jest.mock("../../../../../../../../services/escolas/Paa.service", () => ({
  postDesativarAtualizacaoSaldoPAA: jest.fn(),
  postAtivarAtualizacaoSaldoPAA: jest.fn(),
}));

jest.mock("../../../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

const onSuccessMock = jest.fn();
const onErrorMock = jest.fn();

describe("usePostTipoReceita", () => {
  let queryClient;

  
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("Deve chamar o request de bloqueio de saldo com sucesso", async () => {
    postDesativarAtualizacaoSaldoPAA.mockResolvedValueOnce({});

    const { result } = renderHook(
      () => useDesativarSaldoPAA(onSuccessMock, onErrorMock), { wrapper });

    await act(async () => {
      result.current.mutationPost.mutate({ uuid: '1234' });
    });

    expect(postDesativarAtualizacaoSaldoPAA).toHaveBeenCalled();
    expect(onSuccessMock).toHaveBeenCalled();
    expect(onErrorMock).not.toHaveBeenCalled();
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "As atualizações de saldo estão bloqueadas."
    );
  });

  it("Deve chamar o request de bloqueio de saldo com erro", async () => {
    postDesativarAtualizacaoSaldoPAA.mockRejectedValueOnce({});

    const { result } = renderHook(
      () => useDesativarSaldoPAA(onSuccessMock, onErrorMock), { wrapper });

    await act(async () => {
      result.current.mutationPost.mutate({ nouuid: '1234' });
    });

    expect(postDesativarAtualizacaoSaldoPAA).toHaveBeenCalled();
    expect(onSuccessMock).not.toHaveBeenCalled();
    expect(onErrorMock).toHaveBeenCalled();
    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Houve um erro ao desativar o saldo."
    );
  });

  it("Deve chamar o request de desbloqueio de saldo com sucesso", async () => {
    postAtivarAtualizacaoSaldoPAA.mockResolvedValueOnce({});

    const { result } = renderHook(
      () => useAtivarSaldoPAA(onSuccessMock, onErrorMock), { wrapper });

    await act(async () => {
      result.current.mutationPost.mutate({ uuid: '1234' });
    });

    expect(postAtivarAtualizacaoSaldoPAA).toHaveBeenCalled();
    expect(onSuccessMock).toHaveBeenCalled();
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "As atualizações de saldo estão desbloqueadas."
    );
  });

  it("Deve chamar o request de desbloqueio de saldo com erro", async () => {
    postAtivarAtualizacaoSaldoPAA.mockRejectedValueOnce({});

    const { result } = renderHook(
      () => useAtivarSaldoPAA(onSuccessMock, onErrorMock), { wrapper });

    await act(async () => {
      result.current.mutationPost.mutate({ nouuid: '1234' });
    });

    expect(postAtivarAtualizacaoSaldoPAA).toHaveBeenCalled();
    expect(onSuccessMock).not.toHaveBeenCalled();
    expect(onErrorMock).toHaveBeenCalled();
    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Houve um erro ao ativar o saldo."
    );
  });

});
