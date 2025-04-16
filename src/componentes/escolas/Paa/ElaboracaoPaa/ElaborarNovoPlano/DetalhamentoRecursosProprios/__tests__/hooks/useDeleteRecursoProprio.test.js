import { renderHook } from "@testing-library/react";
import { useDeleteRecursoProprio } from "../../hooks/useDeleteRecursoProprio";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { deleteRecursoProprioPaa } from "../../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";
import { act } from "react";

jest.mock("../../../../../../../../services/escolas/Paa.service");
jest.mock("../../../../../../../Globais/ToastCustom");

describe("useDeleteRecursoProprio", () => {
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

  test("deve chamar a função deleteRecursoProprioPaa com o UUID correto", async () => {
    deleteRecursoProprioPaa.mockResolvedValueOnce({});

    const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });

    const uuid = "test-uuid-123";
    await result.current.mutationDelete.mutateAsync(uuid);

    expect(deleteRecursoProprioPaa).toHaveBeenCalledWith(uuid);
    expect(deleteRecursoProprioPaa).toHaveBeenCalledTimes(1);
  });

  test("deve exibir toast de sucesso e invalidar queries ao excluir com sucesso", async () => {
    deleteRecursoProprioPaa.mockResolvedValueOnce({});

    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });

    await result.current.mutationDelete.mutateAsync("test-uuid");

    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Recurso próprio excluído com sucesso."
    );

    expect(invalidateQueriesSpy).toHaveBeenCalledWith(["recursos-proprios"]);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith([
      "totalizador-recurso-proprio",
    ]);
  });

  test("deve exibir toast de erro quando a API retorna mensagem de erro", async () => {
    const errorResponse = {
      response: {
        data: {
          mensagem: "Erro específico da API",
        },
      },
    };
    deleteRecursoProprioPaa.mockRejectedValueOnce(errorResponse);

    const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });

    await act(async () => {
      result.current.mutationDelete.mutate("test-uuid");
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Erro específico da API"
    );
  });

  test("deve exibir toast de erro genérico quando a API não retorna mensagem específica", async () => {
    deleteRecursoProprioPaa.mockRejectedValueOnce(new Error("Erro genérico"));

    const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });

    await act(async () => {
      result.current.mutationDelete.mutate("test-uuid");
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Houve um erro ao tentar excluir recurso próprio."
    );
  });
});
