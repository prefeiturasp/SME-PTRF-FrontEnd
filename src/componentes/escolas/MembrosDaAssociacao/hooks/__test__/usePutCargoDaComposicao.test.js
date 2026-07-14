import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { usePutCargoDaComposicao } from "../usePutCargoDaComposicao";
import { putCargoComposicao } from "../../../../../services/Mandatos.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

jest.mock("../../../../../services/Mandatos.service", () => ({
  putCargoComposicao: jest.fn(),
}));

jest.mock("../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

describe("usePutCargoDaComposicao", () => {
  let queryClient;
  let invalidateQueriesSpy;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });

    invalidateQueriesSpy = jest
      .spyOn(queryClient, "invalidateQueries")
      .mockResolvedValue(undefined);

    return ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve executar a mutation com uuid e payload informados", async () => {
    const uuidCargoComposicao = "uuid-123";
    const payload = {
      nome: "Presidente",
    };

    putCargoComposicao.mockResolvedValue({
      data: {
        substituido: false,
      },
    });

    const { result } = renderHook(() => usePutCargoDaComposicao(), {
      wrapper: createWrapper(),
    });

    result.current.mutationPutCargoDaComposicao.mutate({
      uuidCargoComposicao,
      payload,
    });

    await waitFor(() => {
      expect(putCargoComposicao).toHaveBeenCalledWith(
        uuidCargoComposicao,
        payload
      );
    });
  });

  it("deve invalidar as queries e exibir mensagem de membro alterado quando substituido for false", async () => {
    putCargoComposicao.mockResolvedValue({
      data: {
        substituido: false,
      },
    });

    const { result } = renderHook(() => usePutCargoDaComposicao(), {
      wrapper: createWrapper(),
    });

    result.current.mutationPutCargoDaComposicao.mutate({
      uuidCargoComposicao: "uuid",
      payload: {},
    });

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledTimes(2);
    });

    expect(invalidateQueriesSpy).toHaveBeenNthCalledWith(1, [
      "cargos-da-composicao",
    ]);
    expect(invalidateQueriesSpy).toHaveBeenNthCalledWith(2, [
      "status-cadastro-associacao",
    ]);

    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Membro alterado com sucesso.",
      "O membro foi alterado no sistema com sucesso."
    );

    expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
  });

  it("deve invalidar as queries e exibir mensagem de membro removido quando substituido for true", async () => {
    putCargoComposicao.mockResolvedValue({
      data: {
        substituido: true,
      },
    });

    const { result } = renderHook(() => usePutCargoDaComposicao(), {
      wrapper: createWrapper(),
    });

    result.current.mutationPutCargoDaComposicao.mutate({
      uuidCargoComposicao: "uuid",
      payload: {},
    });

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledTimes(2);
    });

    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Membro removido com sucesso.",
      "O membro foi removido com sucesso."
    );

    expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
  });

  it("deve exibir mensagem concatenada utilizando non_field_errors", async () => {
    const error = {
      response: {
        data: {
          non_field_errors: [
            "Primeiro erro. ",
            "Segundo erro.",
          ],
        },
      },
    };

    putCargoComposicao.mockRejectedValue(error);

    const { result } = renderHook(() => usePutCargoDaComposicao(), {
      wrapper: createWrapper(),
    });

    result.current.mutationPutCargoDaComposicao.mutate({
      uuidCargoComposicao: "uuid",
      payload: {},
    });

    await waitFor(() => {
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Erro ao alterar Cargo da Composição.",
        "Primeiro erro. Segundo erro."
      );
    });

    expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });

  it("deve exibir mensagem utilizando detail quando non_field_errors estiver vazio", async () => {
    const error = {
      response: {
        data: {
          non_field_errors: [],
          detail: "Erro de validação.",
        },
      },
    };

    putCargoComposicao.mockRejectedValue(error);

    const { result } = renderHook(() => usePutCargoDaComposicao(), {
      wrapper: createWrapper(),
    });

    result.current.mutationPutCargoDaComposicao.mutate({
      uuidCargoComposicao: "uuid",
      payload: {},
    });

    await waitFor(() => {
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Erro ao alterar Cargo da Composição.",
        "Erro de validação."
      );
    });

    expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });

  it("deve exibir mensagem utilizando detail quando non_field_errors não existir", async () => {
    const error = {
      response: {
        data: {
          detail: "Falha inesperada.",
        },
      },
    };

    putCargoComposicao.mockRejectedValue(error);

    const { result } = renderHook(() => usePutCargoDaComposicao(), {
      wrapper: createWrapper(),
    });

    result.current.mutationPutCargoDaComposicao.mutate({
      uuidCargoComposicao: "uuid",
      payload: {},
    });

    await waitFor(() => {
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Erro ao alterar Cargo da Composição.",
        "Falha inesperada."
      );
    });

    expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });
});