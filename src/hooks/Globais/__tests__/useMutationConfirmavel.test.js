import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMutationConfirmavel } from "../useMutationConfirmavel";
import { CustomModalConfirm } from "../../../componentes//Globais/Modal/CustomModalConfirm";

jest.mock("../../../componentes/Globais/Modal/CustomModalConfirm", () => ({
  CustomModalConfirm: jest.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

it("não abre modal quando erro não contém campo de confirmação", async () => {
  const dispatch = jest.fn();
  const onError = jest.fn();

  const mutationFn = jest.fn().mockRejectedValue({
    response: { data: {} },
  });

  const { result } = renderHook(
    () =>
      useMutationConfirmavel({
        mutationFn,
        dispatch,
        mutationOptions: { onError },
      }),
    { wrapper: createWrapper() },
  );

  await act(async () => {
    try {
      await result.current.mutateAsync({ foo: "bar" });
    } catch {}
  });

  expect(CustomModalConfirm).not.toHaveBeenCalled();
  expect(onError).toHaveBeenCalled();
});

it("abre modal quando backend retorna campo de confirmação", async () => {
  const dispatch = jest.fn();

  const mutationFn = jest.fn().mockRejectedValue({
    response: {
      data: {
        confirmar: ["Mensagem de confirmação"],
      },
    },
  });

  const { result } = renderHook(
    () =>
      useMutationConfirmavel({
        mutationFn,
        dispatch,
      }),
    { wrapper: createWrapper() },
  );

  await act(async () => {
    try {
      await result.current.mutateAsync({ valor: 10 });
    } catch {}
  });

  expect(CustomModalConfirm).toHaveBeenCalledTimes(1);

  expect(CustomModalConfirm).toHaveBeenCalledWith(
    expect.objectContaining({
      dispatch,
      title: "Confirmação necessária",
      message: "Mensagem de confirmação",
      onConfirm: expect.any(Function),
    }),
  );
});

it("reenvia mutation com campo de confirmação ao confirmar modal", async () => {
  const dispatch = jest.fn();

  const mutationFn = jest
    .fn()
    .mockRejectedValueOnce({
      response: {
        data: {
          confirmar: ["Confirma?"],
        },
      },
    })
    .mockResolvedValueOnce({});

  const { result } = renderHook(
    () =>
      useMutationConfirmavel({
        mutationFn,
        dispatch,
      }),
    { wrapper: createWrapper() },
  );

  await act(async () => {
    try {
      await result.current.mutateAsync({ valor: 10 });
    } catch {}
  });

  const modalArgs = CustomModalConfirm.mock.calls[0][0];

  await act(async () => {
    modalArgs.onConfirm();
  });

  const lastCallArgs = mutationFn.mock.calls.at(-1);

  expect(lastCallArgs[0]).toEqual({
    valor: 10,
    confirmar: true,
  });
});

it("não abre modal se requisição já estiver confirmada", async () => {
  const dispatch = jest.fn();
  const onError = jest.fn();

  const mutationFn = jest.fn().mockRejectedValue({
    response: {
      data: {
        confirmar: ["Confirma?"],
      },
    },
  });

  const { result } = renderHook(
    () =>
      useMutationConfirmavel({
        mutationFn,
        dispatch,
        mutationOptions: { onError },
      }),
    { wrapper: createWrapper() },
  );

  await act(async () => {
    try {
      await result.current.mutateAsync({
        valor: 10,
        confirmar: true,
      });
    } catch {}
  });

  expect(CustomModalConfirm).not.toHaveBeenCalled();
  expect(onError).toHaveBeenCalled();
});
