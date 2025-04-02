import { act } from "react";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePatchReceitasPrevistasPaa } from "../../hooks/usePatchReceitasPrevistasPaa";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";
import { patchReceitasPrevistasPaa } from "../../../../../../../../services/escolas/Paa.service";

jest.mock("../../../../../../../../services/escolas/Paa.service", () => ({
  patchReceitasPrevistasPaa: jest.fn(),
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

  it("deve editar um registro de receita prevista paa com sucesso", async () => {
    patchReceitasPrevistasPaa.mockResolvedValueOnce({ uuid: "uuid-teste" });

    const { result } = renderHook(
      () => usePatchReceitasPrevistasPaa(mockOnClose),
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
      result.current.mutationPatch.mutate({ uuid: "uuid-teste", payload });
    });

    expect(patchReceitasPrevistasPaa).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Recurso editado com sucesso."
    );
  });

  it("deve lidar com erro ao editar uma receita prevista", async () => {
    patchReceitasPrevistasPaa.mockRejectedValueOnce(
      new Error("Erro desconhecido")
    );

    const { result } = renderHook(
      () => usePatchReceitasPrevistasPaa(mockOnClose),
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
      result.current.mutationPatch.mutate({ uuid: "uuid-teste", payload });
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Houve um erro ao editar recurso."
    );
  });
});
