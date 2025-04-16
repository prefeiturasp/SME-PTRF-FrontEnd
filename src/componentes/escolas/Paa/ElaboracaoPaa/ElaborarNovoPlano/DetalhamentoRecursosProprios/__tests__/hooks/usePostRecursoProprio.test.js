import { renderHook } from "@testing-library/react";
import { usePostRecursoProprio } from "../../hooks/usePostRecursoProprio";
import { postRecursoProprioPaa } from "../../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { waitFor } from "@testing-library/react";

jest.mock("../../../../../../../../services/escolas/Paa.service");
jest.mock("../../../../../../../Globais/ToastCustom");

describe("usePostRecursoProprio", () => {
  let queryClient;
  let wrapper;
  let handleCloseFieldsToEdit;

  beforeEach(() => {
    jest.clearAllMocks();

    handleCloseFieldsToEdit = jest.fn();

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

  test("deve chamar a função postRecursoProprioPaa com o payload correto", async () => {
    const mockResponseData = { id: 1, nome: "Novo Recurso" };
    postRecursoProprioPaa.mockResolvedValueOnce(mockResponseData);

    const { result } = renderHook(
      () => usePostRecursoProprio(handleCloseFieldsToEdit),
      { wrapper }
    );

    const payload = { nome: "Novo Recurso", valor: 1000 };

    await result.current.mutationPost.mutateAsync({ payload });

    expect(postRecursoProprioPaa).toHaveBeenCalledWith(payload);
    expect(postRecursoProprioPaa).toHaveBeenCalledTimes(1);
  });

  test("deve exibir toast de sucesso, invalidar queries e chamar o callback após criação bem-sucedida", async () => {
    const mockResponseData = { id: 1, nome: "Novo Recurso" };
    postRecursoProprioPaa.mockResolvedValueOnce(mockResponseData);

    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(
      () => usePostRecursoProprio(handleCloseFieldsToEdit),
      { wrapper }
    );

    await result.current.mutationPost.mutateAsync({
      payload: { nome: "Novo Recurso", valor: 1000 },
    });

    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Recurso Próprio criado com sucesso."
    );

    expect(invalidateQueriesSpy).toHaveBeenCalledWith(["recursos-proprios"]);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith([
      "totalizador-recurso-proprio",
    ]);

    expect(handleCloseFieldsToEdit).toHaveBeenCalledWith(mockResponseData);
  });

  test("deve exibir toast de erro quando a API falha", async () => {
    postRecursoProprioPaa.mockRejectedValueOnce(new Error("Erro na API"));

    const { result } = renderHook(
      () => usePostRecursoProprio(handleCloseFieldsToEdit),
      { wrapper }
    );

    try {
      await result.current.mutationPost.mutateAsync({
        payload: { nome: "Teste" },
      });
    } catch (error) {}

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Houve um erro ao criar recurso."
    );

    expect(handleCloseFieldsToEdit).not.toHaveBeenCalled();
  });

  test("deve exibir toast de erro quando a API falha (usando waitFor)", async () => {
    postRecursoProprioPaa.mockRejectedValueOnce(new Error("Erro na API"));

    const { result } = renderHook(
      () => usePostRecursoProprio(handleCloseFieldsToEdit),
      { wrapper }
    );

    try {
      await result.current.mutationPost.mutateAsync({
        payload: { nome: "Teste" },
      });
    } catch (error) {}

    await waitFor(() => {
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Houve um erro ao criar recurso."
      );
    });

    expect(handleCloseFieldsToEdit).not.toHaveBeenCalled();
  });
});
