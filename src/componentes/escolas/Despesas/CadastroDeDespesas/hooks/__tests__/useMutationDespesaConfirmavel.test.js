import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMutationDespesaConfirmavel } from "../useMutationDespesaConfirmavel";
import { criarDespesa, alterarDespesa } from "../../../../../../services/escolas/Despesas.service";
import { CustomModalConfirm } from "../../../../../../componentes/Globais/Modal/CustomModalConfirm";
import HTTP_STATUS from "http-status-codes";

jest.mock("../../../../../../services/escolas/Despesas.service");
jest.mock("../../../../../../componentes/Globais/Modal/CustomModalConfirm", () => ({
  CustomModalConfirm: jest.fn(),
}));
jest.mock("react-redux", () => ({
  useDispatch: () => jest.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useMutationDespesaConfirmavel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("não ativa loading na primeira chamada sem confirmação", async () => {
    const setLoading = jest.fn();
    const setBtnSubmitDisable = jest.fn();
    criarDespesa.mockResolvedValue({ status: HTTP_STATUS.CREATED, data: { uuid: "123" } });

    const { result } = renderHook(
      () => useMutationDespesaConfirmavel(jest.fn(), jest.fn(), setLoading, setBtnSubmitDisable),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      await result.current.mutationCreate.mutateAsync({ payload: {} });
    });

    expect(setLoading).not.toHaveBeenCalled();
    expect(setBtnSubmitDisable).not.toHaveBeenCalled();
  });

  it("ativa loading apenas quando confirmar_limpeza_prioridades_paa é true", async () => {
    const setLoading = jest.fn();
    const setBtnSubmitDisable = jest.fn();
    criarDespesa.mockResolvedValue({ status: HTTP_STATUS.CREATED, data: { uuid: "123" } });

    const { result } = renderHook(
      () => useMutationDespesaConfirmavel(jest.fn(), jest.fn(), setLoading, setBtnSubmitDisable),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      await result.current.mutationCreate.mutateAsync({
        payload: { confirmar_limpeza_prioridades_paa: true },
      });
    });

    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setBtnSubmitDisable).toHaveBeenCalledWith(true);
  });

  it("mostra modal quando backend retorna erro de confirmação", async () => {
    criarDespesa.mockResolvedValue({
      status: 400,
      data: { confirmar: ["Existem prioridades cadastradas..."] },
    });

    const { result } = renderHook(
      () => useMutationDespesaConfirmavel(jest.fn(), jest.fn(), jest.fn(), jest.fn()),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      try {
        await result.current.mutationCreate.mutateAsync({ payload: {} });
      } catch {}
    });

    expect(CustomModalConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Alteração das prioridades cadastradas",
        isDanger: true,
        onCancel: expect.any(Function),
        onConfirm: expect.any(Function),
      })
    );
  });

  it("desativa loading ao cancelar modal", async () => {
    const setLoading = jest.fn();
    const setBtnSubmitDisable = jest.fn();
    criarDespesa.mockResolvedValue({
      status: 400,
      data: { confirmar: ["Mensagem"] },
    });

    const { result } = renderHook(
      () => useMutationDespesaConfirmavel(jest.fn(), jest.fn(), setLoading, setBtnSubmitDisable),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      try {
        await result.current.mutationCreate.mutateAsync({ payload: {} });
      } catch {}
    });

    const modalArgs = CustomModalConfirm.mock.calls[0][0];
    await act(async () => {
      modalArgs.onCancel();
    });

    expect(setLoading).toHaveBeenCalledWith(false);
    expect(setBtnSubmitDisable).toHaveBeenCalledWith(false);
  });

  it("ativa loading ao confirmar modal", async () => {
    const setLoading = jest.fn();
    const setBtnSubmitDisable = jest.fn();
    criarDespesa
      .mockResolvedValueOnce({
        status: 400,
        data: { confirmar: ["Mensagem"] },
      })
      .mockResolvedValueOnce({ status: HTTP_STATUS.CREATED, data: { uuid: "123" } });

    const { result } = renderHook(
      () => useMutationDespesaConfirmavel(jest.fn(), jest.fn(), setLoading, setBtnSubmitDisable),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      try {
        await result.current.mutationCreate.mutateAsync({ payload: {} });
      } catch {}
    });

    const modalArgs = CustomModalConfirm.mock.calls[0][0];
    await act(async () => {
      modalArgs.onConfirm();
    });

    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setBtnSubmitDisable).toHaveBeenCalledWith(true);
  });

  it("chama onSuccess quando mutation é bem-sucedida", async () => {
    const onSuccess = jest.fn();
    criarDespesa.mockResolvedValue({ status: HTTP_STATUS.CREATED, data: { uuid: "123" } });

    const { result } = renderHook(
      () => useMutationDespesaConfirmavel(onSuccess, jest.fn(), jest.fn(), jest.fn()),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      await result.current.mutationCreate.mutateAsync({
        payload: { confirmar_limpeza_prioridades_paa: true },
      });
    });

    expect(onSuccess).toHaveBeenCalled();
  });

  it("chama onError quando erro não é de confirmação", async () => {
    const onError = jest.fn();
    criarDespesa.mockResolvedValue({
      status: 500,
      data: { mensagem: "Erro interno" },
    });

    const { result } = renderHook(
      () => useMutationDespesaConfirmavel(jest.fn(), onError, jest.fn(), jest.fn()),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      try {
        await result.current.mutationCreate.mutateAsync({ payload: {} });
      } catch {}
    });

    expect(onError).toHaveBeenCalled();
  });

  it("mutationUpdate funciona corretamente", async () => {
    const setLoading = jest.fn();
    alterarDespesa.mockResolvedValue({ status: 200, data: { uuid: "123" } });

    const { result } = renderHook(
      () => useMutationDespesaConfirmavel(jest.fn(), jest.fn(), setLoading, jest.fn()),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      await result.current.mutationUpdate.mutateAsync({
        payload: { confirmar_limpeza_prioridades_paa: true },
        idDespesa: "123",
      });
    });

    expect(setLoading).toHaveBeenCalledWith(true);
    expect(alterarDespesa).toHaveBeenCalledWith(
      { confirmar_limpeza_prioridades_paa: true },
      "123"
    );
  });
});
