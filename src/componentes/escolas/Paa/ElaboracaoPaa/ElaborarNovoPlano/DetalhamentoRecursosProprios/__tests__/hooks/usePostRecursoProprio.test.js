import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePostRecursoProprio } from "../../hooks/usePostRecursoProprio";
import { postRecursoProprioPaa } from "../../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";

jest.mock("../../../../../../../../services/escolas/Paa.service", () => ({
  postRecursoProprioPaa: jest.fn(),
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

describe("usePostRecursoProprio", () => {
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
    it("retorna mutationPost com função mutate", () => {
      const { result } = renderHook(
        () => usePostRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      expect(result.current.mutationPost).toBeDefined();
      expect(typeof result.current.mutationPost.mutate).toBe("function");
    });

    it("inicia com isPending false", () => {
      const { result } = renderHook(
        () => usePostRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      expect(result.current.mutationPost.isPending).toBe(false);
    });

    it("inicia com isError false", () => {
      const { result } = renderHook(
        () => usePostRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      expect(result.current.mutationPost.isError).toBe(false);
    });
  });

  describe("mutationFn", () => {
    it("chama postRecursoProprioPaa com o payload correto", async () => {
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

    it("chama postRecursoProprioPaa apenas com o payload, sem argumentos extras", async () => {
      postRecursoProprioPaa.mockResolvedValueOnce({ id: 1 });

      const { result } = renderHook(
        () => usePostRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      const payload = { nome: "Teste" };
      await result.current.mutationPost.mutateAsync({ payload });

      const [callPayload, callExtra] = postRecursoProprioPaa.mock.calls[0];
      expect(callPayload).toBe(payload);
      expect(callExtra).toBeUndefined();
    });
  });

  describe("onSuccess", () => {
    it("exibe toast de sucesso após criação bem-sucedida", async () => {
      postRecursoProprioPaa.mockResolvedValueOnce({ id: 1 });

      const { result } = renderHook(
        () => usePostRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      await result.current.mutationPost.mutateAsync({
        payload: { nome: "Teste" },
      });

      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
        "Recurso Próprio criado com sucesso."
      );
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledTimes(1);
    });

    it("invalida a query 'recursos-proprios' após criação bem-sucedida", async () => {
      postRecursoProprioPaa.mockResolvedValueOnce({ id: 1 });
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(
        () => usePostRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      await result.current.mutationPost.mutateAsync({ payload: {} });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith(["recursos-proprios"]);
    });

    it("invalida a query 'totalizador-recurso-proprio' após criação bem-sucedida", async () => {
      postRecursoProprioPaa.mockResolvedValueOnce({ id: 1 });
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(
        () => usePostRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      await result.current.mutationPost.mutateAsync({ payload: {} });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith([
        "totalizador-recurso-proprio",
      ]);
    });

    it("invalida as duas queries após criação bem-sucedida", async () => {
      postRecursoProprioPaa.mockResolvedValueOnce({ id: 1 });
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(
        () => usePostRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      await result.current.mutationPost.mutateAsync({ payload: {} });

      expect(invalidateQueriesSpy).toHaveBeenCalledTimes(2);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith(["recursos-proprios"]);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith([
        "totalizador-recurso-proprio",
      ]);
    });

    it("chama handleCloseFieldsToEdit com o dado retornado pela API", async () => {
      const mockResponseData = { id: 1, nome: "Novo Recurso" };
      postRecursoProprioPaa.mockResolvedValueOnce(mockResponseData);

      const { result } = renderHook(
        () => usePostRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      await result.current.mutationPost.mutateAsync({
        payload: { nome: "Novo Recurso", valor: 1000 },
      });

      expect(handleCloseFieldsToEdit).toHaveBeenCalledWith(mockResponseData);
      expect(handleCloseFieldsToEdit).toHaveBeenCalledTimes(1);
    });

    it("não exibe toast de erro após criação bem-sucedida", async () => {
      postRecursoProprioPaa.mockResolvedValueOnce({ id: 1 });

      const { result } = renderHook(
        () => usePostRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      await result.current.mutationPost.mutateAsync({ payload: {} });

      expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    });
  });

  describe("onError", () => {
    it("exibe toast de erro quando a API falha", async () => {
      postRecursoProprioPaa.mockRejectedValueOnce(new Error("Erro na API"));

      const { result } = renderHook(
        () => usePostRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      act(() => {
        result.current.mutationPost.mutate({ payload: { nome: "Teste" } });
      });

      await waitFor(() =>
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
          "Houve um erro ao criar recurso."
        )
      );
    });

    it("coloca mutationPost em estado de erro quando a API falha", async () => {
      postRecursoProprioPaa.mockRejectedValueOnce(new Error("Erro na API"));

      const { result } = renderHook(
        () => usePostRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      act(() => {
        result.current.mutationPost.mutate({ payload: {} });
      });

      await waitFor(() =>
        expect(result.current.mutationPost.isError).toBe(true)
      );
    });

    it("não chama handleCloseFieldsToEdit quando a API falha", async () => {
      postRecursoProprioPaa.mockRejectedValueOnce(new Error("Erro na API"));

      const { result } = renderHook(
        () => usePostRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      act(() => {
        result.current.mutationPost.mutate({ payload: {} });
      });

      await waitFor(() =>
        expect(result.current.mutationPost.isError).toBe(true)
      );

      expect(handleCloseFieldsToEdit).not.toHaveBeenCalled();
    });

    it("não invalida as queries quando ocorre erro", async () => {
      postRecursoProprioPaa.mockRejectedValueOnce(new Error("Erro na API"));
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(
        () => usePostRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      act(() => {
        result.current.mutationPost.mutate({ payload: {} });
      });

      await waitFor(() =>
        expect(result.current.mutationPost.isError).toBe(true)
      );

      expect(invalidateQueriesSpy).not.toHaveBeenCalled();
    });

    it("não exibe toast de sucesso quando a API falha", async () => {
      postRecursoProprioPaa.mockRejectedValueOnce(new Error("Erro na API"));

      const { result } = renderHook(
        () => usePostRecursoProprio(handleCloseFieldsToEdit),
        { wrapper }
      );

      act(() => {
        result.current.mutationPost.mutate({ payload: {} });
      });

      await waitFor(() =>
        expect(result.current.mutationPost.isError).toBe(true)
      );

      expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
    });
  });
});
