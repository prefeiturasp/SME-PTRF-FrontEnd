import { renderHook } from "@testing-library/react";
import { useMutation } from "@tanstack/react-query";

import { usePostCancelarRetificacaoPaa } from "../usePostCancelarRetificacao";
import { postCancelarRetificacaoPaa } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import { getErrorMessage } from "../../../../../../../utils/obtemMsgErroAxios";

jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(),
}));

jest.mock("../../../../../../../services/escolas/Paa.service", () => ({
  postCancelarRetificacaoPaa: jest.fn(),
}));

jest.mock("../../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

jest.mock("../../../../../../../utils/obtemMsgErroAxios", () => ({
  getErrorMessage: jest.fn(),
}));

describe("usePostCancelarRetificacaoPaa", () => {
  const mutateOptions = {};

  beforeEach(() => {
    jest.clearAllMocks();

    useMutation.mockImplementation((options) => {
      Object.assign(mutateOptions, options);

      return {
        mutate: jest.fn(),
        mutateAsync: jest.fn(),
        isPending: false,
        isSuccess: false,
        isError: false,
      };
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("deve retornar mutationPost", () => {
    const { result } = renderHook(() => usePostCancelarRetificacaoPaa());

    expect(result.current).toHaveProperty("mutationPost");
    expect(result.current.mutationPost).toBeDefined();
  });

  it("deve configurar mutationFn", async () => {
    const paaUuid = "paa-uuid-123";
    const resposta = { sucesso: true };

    postCancelarRetificacaoPaa.mockResolvedValue(resposta);

    renderHook(() => usePostCancelarRetificacaoPaa());

    const resultado = await mutateOptions.mutationFn({ paaUuid });

    expect(postCancelarRetificacaoPaa).toHaveBeenCalledWith(paaUuid);
    expect(resultado).toEqual(resposta);
  });

  it("deve exibir mensagem de sucesso quando a retificação for cancelada", () => {
    renderHook(() => usePostCancelarRetificacaoPaa());

    mutateOptions.onSuccess();

    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Retificação cancelada com sucesso.",
    );
  });

  it("deve obter a mensagem de erro e exibi-la quando o cancelamento falhar", () => {
    const erro = {
      response: {
        data: {
          detail: "Erro retornado pela API",
        },
      },
    };
    const mensagemErro = "Erro retornado pela API";

    getErrorMessage.mockReturnValue(mensagemErro);

    renderHook(() => usePostCancelarRetificacaoPaa());

    mutateOptions.onError(erro);

    expect(getErrorMessage).toHaveBeenCalledWith(
      erro,
      "Ocorreu um erro ao tentar cancelar a retificação.",
    );
    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(mensagemErro);
  });

  it("deve exibir a mensagem padrão quando getErrorMessage retornar a mensagem padrão", () => {
    const erro = new Error("Erro inesperado");
    const mensagemPadrao =
      "Ocorreu um erro ao tentar cancelar a retificação.";

    getErrorMessage.mockReturnValue(mensagemPadrao);

    renderHook(() => usePostCancelarRetificacaoPaa());

    mutateOptions.onError(erro);

    expect(getErrorMessage).toHaveBeenCalledWith(erro, mensagemPadrao);
    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(mensagemPadrao);
  });
});
