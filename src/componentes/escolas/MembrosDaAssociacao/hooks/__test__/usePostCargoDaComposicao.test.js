import { renderHook, waitFor } from "@testing-library/react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { usePostCargoDaComposicao } from "../usePostCargoDaComposicao";
import { postCargoComposicao } from "../../../../../services/Mandatos.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

const mockNavigate = jest.fn();

jest.mock("../../../../../services/Mandatos.service", () => ({
  postCargoComposicao: jest.fn(),
}));

jest.mock("../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("usePostCargoDaComposicao", () => {
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

  it("deve executar a mutation com o payload informado", async () => {
    const payload = {
      nome: "Presidente",
      uuid: "123",
    };

    postCargoComposicao.mockResolvedValue({
      data: payload,
    });

    const { result } = renderHook(() => usePostCargoDaComposicao(), {
      wrapper: createWrapper(),
    });

    result.current.mutationPostCargoDaComposicao.mutate({
      payload,
    });

    await waitFor(() => {
      expect(postCargoComposicao).toHaveBeenCalledWith(payload);
    });
  });

  it("deve invalidar as queries, exibir toast de sucesso e navegar após sucesso", async () => {
    const payload = {
      nome: "Presidente",
    };

    postCargoComposicao.mockResolvedValue({
      data: payload,
    });

    const { result } = renderHook(() => usePostCargoDaComposicao(), {
      wrapper: createWrapper(),
    });

    result.current.mutationPostCargoDaComposicao.mutate({
      payload,
    });

    await waitFor(() => {
      expect(postCargoComposicao).toHaveBeenCalledWith(payload);
    });

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledTimes(2);
      expect(invalidateQueriesSpy).toHaveBeenNthCalledWith(1, [
        "cargos-da-composicao",
      ]);
      expect(invalidateQueriesSpy).toHaveBeenNthCalledWith(2, [
        "status-cadastro-associacao",
      ]);
    });

    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Membro incluído com sucesso.",
      "O membro foi adicionado ao sistema com sucesso."
    );

    expect(mockNavigate).toHaveBeenCalledWith("/membros-da-associacao");
    expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
  });

  it("deve exibir mensagem de erro utilizando non_field_errors quando existir", async () => {
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

    postCargoComposicao.mockRejectedValue(error);

    const { result } = renderHook(() => usePostCargoDaComposicao(), {
      wrapper: createWrapper(),
    });

    result.current.mutationPostCargoDaComposicao.mutate({
      payload: {},
    });

    await waitFor(() => {
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Erro ao criar Cargo da Composição.",
        "Primeiro erro. Segundo erro."
      );
    });

    expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
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

    postCargoComposicao.mockRejectedValue(error);

    const { result } = renderHook(() => usePostCargoDaComposicao(), {
      wrapper: createWrapper(),
    });

    result.current.mutationPostCargoDaComposicao.mutate({
      payload: {},
    });

    await waitFor(() => {
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Erro ao criar Cargo da Composição.",
        "Erro de validação."
      );
    });

    expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
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

    postCargoComposicao.mockRejectedValue(error);

    const { result } = renderHook(() => usePostCargoDaComposicao(), {
      wrapper: createWrapper(),
    });

    result.current.mutationPostCargoDaComposicao.mutate({
      payload: {},
    });

    await waitFor(() => {
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Erro ao criar Cargo da Composição.",
        "Falha inesperada."
      );
    });

    expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });
});