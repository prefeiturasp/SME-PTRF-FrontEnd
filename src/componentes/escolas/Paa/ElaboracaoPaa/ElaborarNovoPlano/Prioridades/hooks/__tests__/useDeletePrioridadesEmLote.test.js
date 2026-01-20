import { renderHook } from "@testing-library/react";
import { useDeletePrioridadesEmLote } from "../../hooks/useDeletePrioridadesEmLote";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { deletePrioridadesEmLote } from "../../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";
import { act } from "react";

jest.mock("../../../../../../../../services/escolas/Paa.service");
jest.mock("../../../../../../../Globais/ToastCustom");

describe("useDeletePrioridadesEmLote", () => {
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

  test("deve chamar a função deletePrioridadesEmLote com o UUID correto", async () => {
    deletePrioridadesEmLote.mockResolvedValueOnce({});

    const { result } = renderHook(() => useDeletePrioridadesEmLote(), { wrapper });

    const payload = ['uuid1', 'uuid2'];
    await result.current.mutationDeleteEmLote.mutateAsync({payload});

    expect(deletePrioridadesEmLote).toHaveBeenCalledWith(payload);
    expect(deletePrioridadesEmLote).toHaveBeenCalledTimes(1);
  });

  test("deve exibir toast de sucesso e invalidar queries ao excluir com sucesso", async () => {
    deletePrioridadesEmLote.mockResolvedValueOnce({});

    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeletePrioridadesEmLote(), { wrapper });

    await result.current.mutationDeleteEmLote.mutateAsync("test-uuid");

    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Prioridades removidas com sucesso."
    );

    expect(invalidateQueriesSpy).toHaveBeenNthCalledWith(1, "prioridades");
    expect(invalidateQueriesSpy).toHaveBeenNthCalledWith(2, "prioridades-resumo");
  });

  test("deve exibir toast de erro quando a API retorna mensagem de erro", async () => {
    const errorResponse = {
      response: {
        data: {
          erros: ['error1'],
          mensagem: "Erro específico da API",
        },
      },
    };
    deletePrioridadesEmLote.mockRejectedValueOnce(errorResponse);

    const { result } = renderHook(() => useDeletePrioridadesEmLote(), { wrapper });

    await act(async () => {
      result.current.mutationDeleteEmLote.mutate({payload: ["test-uuid"]});
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Erro específico da API"
    );
  });

  test("deve exibir toast de erro genérico quando a API não retorna mensagem específica", async () => {
    deletePrioridadesEmLote.mockRejectedValueOnce(new Error("Erro genérico"));

    const { result } = renderHook(() => useDeletePrioridadesEmLote(), { wrapper });

    await act(async () => {
      result.current.mutationDeleteEmLote.mutate("test-uuid");
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Houve um erro ao remover as prioridades."
    );
  });
});
