import { act } from "react";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePostReceitasPrevistasPaa } from "../../hooks/usePostReceitasPrevistasPaa";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";
import { postReceitasPrevistasPaa } from "../../../../../../../../services/escolas/Paa.service";

jest.mock("../../../../../../../../services/escolas/Paa.service", () => ({
  postReceitasPrevistasPaa: jest.fn(),
}));

jest.mock("../../../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

const mockOnClose = jest.fn();

describe("usePostTipoReceita", () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("deve criar um registro de receita prevista paa com sucesso", async () => {
    postReceitasPrevistasPaa.mockResolvedValueOnce({ uuid: "uuid-teste" });

    const { result } = renderHook(
      () => usePostReceitasPrevistasPaa(mockOnClose),
      {
        wrapper,
      }
    );

    const payload = {
      acao_associacao: "UUID-1234",
      previsao_valor_custeio: 200,
      previsao_valor_capital: 400,
      previsao_valor_livre: 600,
    };

    await act(async () => {
      result.current.mutationPost.mutate({ payload });
    });

    expect(postReceitasPrevistasPaa).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Recurso criado com sucesso."
    );
  });

  it("deve lidar com erro ao criar uma receita prevista", async () => {
    postReceitasPrevistasPaa.mockRejectedValueOnce(
      new Error("Erro desconhecido")
    );

    const { result } = renderHook(
      () => usePostReceitasPrevistasPaa(mockOnClose),
      {
        wrapper,
      }
    );

    const payload = {
      acao_associacao: "UUID-1234",
      previsao_valor_custeio: 200,
      previsao_valor_capital: 400,
      previsao_valor_livre: 600,
    };

    await act(async () => {
      result.current.mutationPost.mutate({ payload });
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Houve um erro ao criar recurso."
    );
  });
});
