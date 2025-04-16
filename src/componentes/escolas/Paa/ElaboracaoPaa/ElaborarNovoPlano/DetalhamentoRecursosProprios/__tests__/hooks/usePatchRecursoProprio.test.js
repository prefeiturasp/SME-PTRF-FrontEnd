import { renderHook } from "@testing-library/react";
import { usePatchRecursoProprio } from "../../hooks/usePatchRecursoProprio";
import { patchRecursoProprioPaa } from "../../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../../../../../../../../services/escolas/Paa.service");
jest.mock("../../../../../../../Globais/ToastCustom");

describe("usePatchRecursoProprio", () => {
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

  test("deve chamar a função patchRecursoProprioPaa com os parâmetros corretos", async () => {
    const mockResponseData = { id: 1, nome: "Recurso Atualizado" };
    patchRecursoProprioPaa.mockResolvedValueOnce(mockResponseData);

    const { result } = renderHook(
      () => usePatchRecursoProprio(handleCloseFieldsToEdit),
      { wrapper }
    );

    const uuid = "test-uuid-123";
    const payload = { nome: "Recurso Atualizado", valor: 1000 };

    await result.current.mutationPatch.mutateAsync({ uuid, payload });

    expect(patchRecursoProprioPaa).toHaveBeenCalledWith(uuid, payload);
    expect(patchRecursoProprioPaa).toHaveBeenCalledTimes(1);
  });

  test("deve exibir toast de sucesso, invalidar queries e chamar o callback após edição bem-sucedida", async () => {
    const mockResponseData = { id: 1, nome: "Recurso Atualizado" };
    patchRecursoProprioPaa.mockResolvedValueOnce(mockResponseData);

    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(
      () => usePatchRecursoProprio(handleCloseFieldsToEdit),
      { wrapper }
    );

    await result.current.mutationPatch.mutateAsync({
      uuid: "test-uuid",
      payload: { nome: "Teste" },
    });

    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Recurso Próprio editado com sucesso."
    );

    expect(invalidateQueriesSpy).toHaveBeenCalledWith(["recursos-proprios"]);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith([
      "totalizador-recurso-proprio",
    ]);

    expect(handleCloseFieldsToEdit).toHaveBeenCalledWith(mockResponseData);
  });

  test("deve exibir toast de erro quando a API falha", async () => {
    patchRecursoProprioPaa.mockRejectedValueOnce({});

    const { result } = renderHook(
      () => usePatchRecursoProprio(handleCloseFieldsToEdit),
      { wrapper }
    );

    try {
      await result.current.mutationPatch.mutateAsync({
        uuid: "test-uuid",
        payload: { nome: "Teste" },
      });
    } catch (error) {}

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Houve um erro ao editar recurso."
    );

    expect(handleCloseFieldsToEdit).not.toHaveBeenCalled();
  });
});
