import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePatchRecursoProprio } from "../../hooks/usePatchRecursoProprio";
import { patchRecursoProprioPaa } from "../../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";

jest.mock("../../../../../../../../services/escolas/Paa.service", () => ({
  patchRecursoProprioPaa: jest.fn(),
}));

jest.mock("../../../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

describe("usePatchRecursoProprio", () => {
  let queryClient;
  let wrapper;
  let handleCloseFieldsToEdit;

  beforeEach(() => {
    jest.clearAllMocks();

    handleCloseFieldsToEdit = jest.fn();

    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  });

  describe("Estrutura do retorno", () => {
    it("retorna mutationPatch com função mutate", () => {
      const { result } = renderHook(
        () => usePatchRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      expect(result.current.mutationPatch).toBeDefined();
      expect(typeof result.current.mutationPatch.mutate).toBe("function");
    });

    it("inicia com isPending false", () => {
      const { result } = renderHook(
        () => usePatchRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      expect(result.current.mutationPatch.isPending).toBe(false);
    });

    it("inicia com isError false", () => {
      const { result } = renderHook(
        () => usePatchRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      expect(result.current.mutationPatch.isError).toBe(false);
    });
  });

  describe("mutationFn", () => {
    it("chama patchRecursoProprioPaa com uuid e payload corretos", async () => {
      patchRecursoProprioPaa.mockResolvedValueOnce({ id: 1 });

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

    it("chama patchRecursoProprioPaa apenas com uuid e payload, sem argumentos extras", async () => {
      patchRecursoProprioPaa.mockResolvedValueOnce({ id: 1 });

      const { result } = renderHook(
        () => usePatchRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      const uuid = "uuid-only";
      const payload = { nome: "Teste" };

      await result.current.mutationPatch.mutateAsync({ uuid, payload });

      const [callUuid, callPayload, callExtra] =
        patchRecursoProprioPaa.mock.calls[0];
      expect(callUuid).toBe(uuid);
      expect(callPayload).toBe(payload);
      expect(callExtra).toBeUndefined();
    });
  });

  describe("onSuccess", () => {
    it("exibe toast de sucesso após edição bem-sucedida", async () => {
      patchRecursoProprioPaa.mockResolvedValueOnce({ id: 1 });

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
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledTimes(1);
    });

    it("invalida a query 'recursos-proprios' após edição bem-sucedida", async () => {
      patchRecursoProprioPaa.mockResolvedValueOnce({ id: 1 });
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(
        () => usePatchRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      await result.current.mutationPatch.mutateAsync({
        uuid: "test-uuid",
        payload: {},
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith(["recursos-proprios"]);
    });

    it("invalida a query 'totalizador-recurso-proprio' após edição bem-sucedida", async () => {
      patchRecursoProprioPaa.mockResolvedValueOnce({ id: 1 });
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(
        () => usePatchRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      await result.current.mutationPatch.mutateAsync({
        uuid: "test-uuid",
        payload: {},
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith([
        "totalizador-recurso-proprio",
      ]);
    });

    it("invalida as duas queries após edição bem-sucedida", async () => {
      patchRecursoProprioPaa.mockResolvedValueOnce({ id: 1 });
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(
        () => usePatchRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      await result.current.mutationPatch.mutateAsync({
        uuid: "test-uuid",
        payload: {},
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledTimes(2);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith(["recursos-proprios"]);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith([
        "totalizador-recurso-proprio",
      ]);
    });

    it("chama handleCloseFieldsToEdit com o dado retornado pela API", async () => {
      const mockResponseData = { id: 1, nome: "Recurso Atualizado" };
      patchRecursoProprioPaa.mockResolvedValueOnce(mockResponseData);

      const { result } = renderHook(
        () => usePatchRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      await result.current.mutationPatch.mutateAsync({
        uuid: "test-uuid",
        payload: { nome: "Recurso Atualizado" },
      });

      expect(handleCloseFieldsToEdit).toHaveBeenCalledWith(mockResponseData);
      expect(handleCloseFieldsToEdit).toHaveBeenCalledTimes(1);
    });

    it("não exibe toast de erro após edição bem-sucedida", async () => {
      patchRecursoProprioPaa.mockResolvedValueOnce({ id: 1 });

      const { result } = renderHook(
        () => usePatchRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      await result.current.mutationPatch.mutateAsync({
        uuid: "test-uuid",
        payload: {},
      });

      expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    });
  });

  describe("onError", () => {
    it("exibe toast de erro quando a API falha", async () => {
      patchRecursoProprioPaa.mockRejectedValueOnce(new Error("Erro na API"));

      const { result } = renderHook(
        () => usePatchRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      act(() => {
        result.current.mutationPatch.mutate({
          uuid: "test-uuid",
          payload: {},
        });
      });

      await waitFor(() =>
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
          "Houve um erro ao editar recurso."
        )
      );
    });

    it("coloca mutationPatch em estado de erro quando a API falha", async () => {
      patchRecursoProprioPaa.mockRejectedValueOnce(new Error("Erro na API"));

      const { result } = renderHook(
        () => usePatchRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      act(() => {
        result.current.mutationPatch.mutate({
          uuid: "test-uuid",
          payload: {},
        });
      });

      await waitFor(() =>
        expect(result.current.mutationPatch.isError).toBe(true)
      );
    });

    it("não chama handleCloseFieldsToEdit quando a API falha", async () => {
      patchRecursoProprioPaa.mockRejectedValueOnce(new Error("Erro na API"));

      const { result } = renderHook(
        () => usePatchRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      act(() => {
        result.current.mutationPatch.mutate({
          uuid: "test-uuid",
          payload: {},
        });
      });

      await waitFor(() =>
        expect(result.current.mutationPatch.isError).toBe(true)
      );

      expect(handleCloseFieldsToEdit).not.toHaveBeenCalled();
    });

    it("não invalida as queries quando ocorre erro", async () => {
      patchRecursoProprioPaa.mockRejectedValueOnce(new Error("Erro na API"));
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(
        () => usePatchRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      act(() => {
        result.current.mutationPatch.mutate({
          uuid: "test-uuid",
          payload: {},
        });
      });

      await waitFor(() =>
        expect(result.current.mutationPatch.isError).toBe(true)
      );

      expect(invalidateQueriesSpy).not.toHaveBeenCalled();
    });

    it("não exibe toast de sucesso quando a API falha", async () => {
      patchRecursoProprioPaa.mockRejectedValueOnce(new Error("Erro na API"));

      const { result } = renderHook(
        () => usePatchRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      act(() => {
        result.current.mutationPatch.mutate({
          uuid: "test-uuid",
          payload: {},
        });
      });

      await waitFor(() =>
        expect(result.current.mutationPatch.isError).toBe(true)
      );

      expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
    });
  });
});
