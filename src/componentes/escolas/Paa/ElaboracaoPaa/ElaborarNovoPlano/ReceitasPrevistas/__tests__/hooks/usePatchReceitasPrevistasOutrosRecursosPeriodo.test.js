import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePatchReceitasPrevistasOutrosRecursosPeriodo } from "../../hooks/usePatchReceitasPrevistasOutrosRecursosPeriodo";
import { patchReceitasPrevistasOutrosRecursosPeriodo } from "../../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";

jest.mock("../../../../../../../../services/escolas/Paa.service", () => ({
  patchReceitasPrevistasOutrosRecursosPeriodo: jest.fn(),
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

describe("usePatchReceitasPrevistasOutrosRecursosPeriodo", () => {
  let queryClient;
  let wrapper;
  let mockOnClose;

  beforeEach(() => {
    jest.clearAllMocks();

    mockOnClose = jest.fn();

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
        () => usePatchReceitasPrevistasOutrosRecursosPeriodo(mockOnClose),
        { wrapper }
      );

      expect(result.current.mutationPatch).toBeDefined();
      expect(typeof result.current.mutationPatch.mutate).toBe("function");
    });

    it("inicia com isPending false", () => {
      const { result } = renderHook(
        () => usePatchReceitasPrevistasOutrosRecursosPeriodo(mockOnClose),
        { wrapper }
      );

      expect(result.current.mutationPatch.isPending).toBe(false);
    });

    it("inicia com isError false", () => {
      const { result } = renderHook(
        () => usePatchReceitasPrevistasOutrosRecursosPeriodo(mockOnClose),
        { wrapper }
      );

      expect(result.current.mutationPatch.isError).toBe(false);
    });
  });

  describe("mutationFn", () => {
    it("chama patchReceitasPrevistasOutrosRecursosPeriodo com uuid e payload corretos", async () => {
      patchReceitasPrevistasOutrosRecursosPeriodo.mockResolvedValueOnce({});

      const { result } = renderHook(
        () => usePatchReceitasPrevistasOutrosRecursosPeriodo(mockOnClose),
        { wrapper }
      );

      const uuid = "uuid-teste";
      const payload = {
        previsao_valor_custeio: 200,
        previsao_valor_capital: 400,
        previsao_valor_livre: 600,
      };

      await result.current.mutationPatch.mutateAsync({ uuid, payload });

      expect(patchReceitasPrevistasOutrosRecursosPeriodo).toHaveBeenCalledWith(
        uuid,
        payload
      );
      expect(patchReceitasPrevistasOutrosRecursosPeriodo).toHaveBeenCalledTimes(
        1
      );
    });
  });

  describe("onSuccess", () => {
    it("exibe toast de sucesso após edição bem-sucedida", async () => {
      patchReceitasPrevistasOutrosRecursosPeriodo.mockResolvedValueOnce({});

      const { result } = renderHook(
        () => usePatchReceitasPrevistasOutrosRecursosPeriodo(mockOnClose),
        { wrapper }
      );

      await result.current.mutationPatch.mutateAsync({
        uuid: "uuid-teste",
        payload: {},
      });

      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
        "Recurso editado com sucesso."
      );
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledTimes(1);
    });

    it("invalida a query 'receitas-previstas-outros-recursos-periodo' após edição bem-sucedida", async () => {
      patchReceitasPrevistasOutrosRecursosPeriodo.mockResolvedValueOnce({});
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(
        () => usePatchReceitasPrevistasOutrosRecursosPeriodo(mockOnClose),
        { wrapper }
      );

      await result.current.mutationPatch.mutateAsync({
        uuid: "uuid-teste",
        payload: {},
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith(
        "receitas-previstas-outros-recursos-periodo"
      );
    });

    it("chama onClose após edição bem-sucedida", async () => {
      patchReceitasPrevistasOutrosRecursosPeriodo.mockResolvedValueOnce({});

      const { result } = renderHook(
        () => usePatchReceitasPrevistasOutrosRecursosPeriodo(mockOnClose),
        { wrapper }
      );

      await result.current.mutationPatch.mutateAsync({
        uuid: "uuid-teste",
        payload: {},
      });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("não lança erro quando onClose não é fornecido", async () => {
      patchReceitasPrevistasOutrosRecursosPeriodo.mockResolvedValueOnce({});

      const { result } = renderHook(
        () => usePatchReceitasPrevistasOutrosRecursosPeriodo(undefined),
        { wrapper }
      );

      await expect(
        result.current.mutationPatch.mutateAsync({
          uuid: "uuid-teste",
          payload: {},
        })
      ).resolves.not.toThrow();
    });

    it("não exibe toast de erro após edição bem-sucedida", async () => {
      patchReceitasPrevistasOutrosRecursosPeriodo.mockResolvedValueOnce({});

      const { result } = renderHook(
        () => usePatchReceitasPrevistasOutrosRecursosPeriodo(mockOnClose),
        { wrapper }
      );

      await result.current.mutationPatch.mutateAsync({
        uuid: "uuid-teste",
        payload: {},
      });

      expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    });
  });

  describe("onError", () => {
    it("exibe toast de erro quando a API falha", async () => {
      patchReceitasPrevistasOutrosRecursosPeriodo.mockRejectedValueOnce(
        new Error("Erro desconhecido")
      );

      const { result } = renderHook(
        () => usePatchReceitasPrevistasOutrosRecursosPeriodo(mockOnClose),
        { wrapper }
      );

      act(() => {
        result.current.mutationPatch.mutate({
          uuid: "uuid-teste",
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
      patchReceitasPrevistasOutrosRecursosPeriodo.mockRejectedValueOnce(
        new Error("Erro desconhecido")
      );

      const { result } = renderHook(
        () => usePatchReceitasPrevistasOutrosRecursosPeriodo(mockOnClose),
        { wrapper }
      );

      act(() => {
        result.current.mutationPatch.mutate({
          uuid: "uuid-teste",
          payload: {},
        });
      });

      await waitFor(() =>
        expect(result.current.mutationPatch.isError).toBe(true)
      );
    });

    it("não chama onClose quando a API falha", async () => {
      patchReceitasPrevistasOutrosRecursosPeriodo.mockRejectedValueOnce(
        new Error("Erro desconhecido")
      );

      const { result } = renderHook(
        () => usePatchReceitasPrevistasOutrosRecursosPeriodo(mockOnClose),
        { wrapper }
      );

      act(() => {
        result.current.mutationPatch.mutate({
          uuid: "uuid-teste",
          payload: {},
        });
      });

      await waitFor(() =>
        expect(result.current.mutationPatch.isError).toBe(true)
      );

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("não invalida as queries quando ocorre erro", async () => {
      patchReceitasPrevistasOutrosRecursosPeriodo.mockRejectedValueOnce(
        new Error("Erro desconhecido")
      );
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(
        () => usePatchReceitasPrevistasOutrosRecursosPeriodo(mockOnClose),
        { wrapper }
      );

      act(() => {
        result.current.mutationPatch.mutate({
          uuid: "uuid-teste",
          payload: {},
        });
      });

      await waitFor(() =>
        expect(result.current.mutationPatch.isError).toBe(true)
      );

      expect(invalidateQueriesSpy).not.toHaveBeenCalled();
    });

    it("não exibe toast de sucesso quando a API falha", async () => {
      patchReceitasPrevistasOutrosRecursosPeriodo.mockRejectedValueOnce(
        new Error("Erro desconhecido")
      );

      const { result } = renderHook(
        () => usePatchReceitasPrevistasOutrosRecursosPeriodo(mockOnClose),
        { wrapper }
      );

      act(() => {
        result.current.mutationPatch.mutate({
          uuid: "uuid-teste",
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
