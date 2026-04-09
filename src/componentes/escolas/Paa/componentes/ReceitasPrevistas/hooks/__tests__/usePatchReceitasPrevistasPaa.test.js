import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePatchReceitasPrevistasPaa } from "../../hooks/usePatchReceitasPrevistasPaa";
import { patchReceitasPrevistasPaa } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

jest.mock("../../../../../../../services/escolas/Paa.service", () => ({
  patchReceitasPrevistasPaa: jest.fn(),
}));

jest.mock("../../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

describe("usePatchReceitasPrevistasPaa", () => {
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
        () => usePatchReceitasPrevistasPaa(mockOnClose),
        { wrapper }
      );

      expect(result.current.mutationPatch).toBeDefined();
      expect(typeof result.current.mutationPatch.mutate).toBe("function");
    });

    it("inicia com isPending false", () => {
      const { result } = renderHook(
        () => usePatchReceitasPrevistasPaa(mockOnClose),
        { wrapper }
      );

      expect(result.current.mutationPatch.isPending).toBe(false);
    });

    it("inicia com isError false", () => {
      const { result } = renderHook(
        () => usePatchReceitasPrevistasPaa(mockOnClose),
        { wrapper }
      );

      expect(result.current.mutationPatch.isError).toBe(false);
    });
  });

  describe("mutationFn", () => {
    it("chama patchReceitasPrevistasPaa com uuid e payload corretos", async () => {
      patchReceitasPrevistasPaa.mockResolvedValueOnce({});

      const { result } = renderHook(
        () => usePatchReceitasPrevistasPaa(mockOnClose),
        { wrapper }
      );

      const uuid = "uuid-teste";
      const payload = {
        acao_associacao: "UUID-1234",
        previsao_valor_custeio: 200,
        previsao_valor_capital: 400,
        previsao_valor_livre: 600,
      };

      await result.current.mutationPatch.mutateAsync({ uuid, payload });

      expect(patchReceitasPrevistasPaa).toHaveBeenCalledWith(uuid, payload);
      expect(patchReceitasPrevistasPaa).toHaveBeenCalledTimes(1);
    });
  });

  describe("onSuccess", () => {
    it("exibe toast de sucesso após edição bem-sucedida", async () => {
      patchReceitasPrevistasPaa.mockResolvedValueOnce({});

      const { result } = renderHook(
        () => usePatchReceitasPrevistasPaa(mockOnClose),
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

    it("invalida a query 'receitas-previstas-paa' após edição bem-sucedida", async () => {
      patchReceitasPrevistasPaa.mockResolvedValueOnce({});
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(
        () => usePatchReceitasPrevistasPaa(mockOnClose),
        { wrapper }
      );

      await result.current.mutationPatch.mutateAsync({
        uuid: "uuid-teste",
        payload: {},
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [
        "receitas-previstas-paa",
      ]});
    });

    it("chama onClose após edição bem-sucedida", async () => {
      patchReceitasPrevistasPaa.mockResolvedValueOnce({});

      const { result } = renderHook(
        () => usePatchReceitasPrevistasPaa(mockOnClose),
        { wrapper }
      );

      await result.current.mutationPatch.mutateAsync({
        uuid: "uuid-teste",
        payload: {},
      });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("não lança erro quando onClose não é fornecido", async () => {
      patchReceitasPrevistasPaa.mockResolvedValueOnce({});

      const { result } = renderHook(
        () => usePatchReceitasPrevistasPaa(undefined),
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
      patchReceitasPrevistasPaa.mockResolvedValueOnce({});

      const { result } = renderHook(
        () => usePatchReceitasPrevistasPaa(mockOnClose),
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
      patchReceitasPrevistasPaa.mockRejectedValueOnce(
        new Error("Erro desconhecido")
      );

      const { result } = renderHook(
        () => usePatchReceitasPrevistasPaa(mockOnClose),
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
      patchReceitasPrevistasPaa.mockRejectedValueOnce(
        new Error("Erro desconhecido")
      );

      const { result } = renderHook(
        () => usePatchReceitasPrevistasPaa(mockOnClose),
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
      patchReceitasPrevistasPaa.mockRejectedValueOnce(
        new Error("Erro desconhecido")
      );

      const { result } = renderHook(
        () => usePatchReceitasPrevistasPaa(mockOnClose),
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
      patchReceitasPrevistasPaa.mockRejectedValueOnce(
        new Error("Erro desconhecido")
      );
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(
        () => usePatchReceitasPrevistasPaa(mockOnClose),
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
      patchReceitasPrevistasPaa.mockRejectedValueOnce(
        new Error("Erro desconhecido")
      );

      const { result } = renderHook(
        () => usePatchReceitasPrevistasPaa(mockOnClose),
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
