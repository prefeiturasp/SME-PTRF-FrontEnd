import { renderHook } from "@testing-library/react";
import { useDeletePrioridade } from "../../hooks/useDeletePrioridade";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { deletePrioridade } from "../../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";
import { act } from "react";

jest.mock("../../../../../../../../services/escolas/Paa.service");
jest.mock("../../../../../../../Globais/ToastCustom");

describe("useDeletePrioridade", () => {
  let queryClient;
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  });

  test("deve chamar a função deletePrioridade com o UUID correto", async () => {
    deletePrioridade.mockResolvedValueOnce({});

    const { result } = renderHook(() => useDeletePrioridade(), { wrapper });

    const uuid = "test-uuid-123";
    await result.current.mutationDelete.mutateAsync({uuid});

    expect(deletePrioridade).toHaveBeenCalledWith(uuid);
    expect(deletePrioridade).toHaveBeenCalledTimes(1);
  });

  test("deve exibir toast de sucesso e invalidar queries ao excluir com sucesso", async () => {
    deletePrioridade.mockResolvedValueOnce({});

    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeletePrioridade(), { wrapper });

    await result.current.mutationDelete.mutateAsync("test-uuid");

    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Prioridade removida com sucesso."
    );

    expect(invalidateQueriesSpy).toHaveBeenNthCalledWith(1, "prioridades");
    expect(invalidateQueriesSpy).toHaveBeenNthCalledWith(2, "prioridades-resumo");
  });

  test("deve exibir toast de erro quando a API retorna mensagem de erro", async () => {
    const errorResponse = {
      response: {
        data: {
          mensagem: "Erro específico da API",
        },
      },
    };
    deletePrioridade.mockRejectedValueOnce(errorResponse);

    const { result } = renderHook(() => useDeletePrioridade(), { wrapper });

    await act(async () => {
      result.current.mutationDelete.mutate("test-uuid");
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Erro específico da API"
    );
  });

  test("deve exibir toast de erro genérico quando a API não retorna mensagem específica", async () => {
    deletePrioridade.mockRejectedValueOnce(new Error("Erro genérico"));

    const { result } = renderHook(() => useDeletePrioridade(), { wrapper });

    await act(async () => {
      result.current.mutationDelete.mutate("test-uuid");
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Houve um erro ao remover a prioridade."
    );
  });
});
