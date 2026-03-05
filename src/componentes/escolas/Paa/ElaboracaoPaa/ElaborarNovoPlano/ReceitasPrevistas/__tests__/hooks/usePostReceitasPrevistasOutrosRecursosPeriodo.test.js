import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePostReceitasPrevistasOutrosRecursos } from "../../hooks/usePostReceitasPrevistasOutrosRecursosPeriodo";
import { postReceitasPrevistasOutrosRecursosPeriodo } from "../../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";

jest.mock("../../../../../../../../services/escolas/Paa.service", () => ({
  postReceitasPrevistasOutrosRecursosPeriodo: jest.fn(),
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

describe("usePostReceitasPrevistasOutrosRecursos", () => {
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
    it("retorna mutationPost com função mutate", () => {
      const { result } = renderHook(
        () => usePostReceitasPrevistasOutrosRecursos(mockOnClose),
        { wrapper }
      );

      expect(result.current.mutationPost).toBeDefined();
      expect(typeof result.current.mutationPost.mutate).toBe("function");
    });

    it("inicia com isPending false", () => {
      const { result } = renderHook(
        () => usePostReceitasPrevistasOutrosRecursos(mockOnClose),
        { wrapper }
      );

      expect(result.current.mutationPost.isPending).toBe(false);
    });

    it("inicia com isError false", () => {
      const { result } = renderHook(
        () => usePostReceitasPrevistasOutrosRecursos(mockOnClose),
        { wrapper }
      );

      expect(result.current.mutationPost.isError).toBe(false);
    });
  });

  describe("mutationFn", () => {
    it("chama postReceitasPrevistasOutrosRecursosPeriodo com o payload correto", async () => {
      postReceitasPrevistasOutrosRecursosPeriodo.mockResolvedValueOnce({});

      const { result } = renderHook(
        () => usePostReceitasPrevistasOutrosRecursos(mockOnClose),
        { wrapper }
      );

      const payload = {
        previsao_valor_custeio: 200,
        previsao_valor_capital: 400,
        previsao_valor_livre: 600,
      };

      await result.current.mutationPost.mutateAsync({ payload });

      expect(
        postReceitasPrevistasOutrosRecursosPeriodo
      ).toHaveBeenCalledWith(payload);
      expect(
        postReceitasPrevistasOutrosRecursosPeriodo
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe("onSuccess", () => {
    it("exibe toast de sucesso após criação bem-sucedida", async () => {
      postReceitasPrevistasOutrosRecursosPeriodo.mockResolvedValueOnce({});

      const { result } = renderHook(
        () => usePostReceitasPrevistasOutrosRecursos(mockOnClose),
        { wrapper }
      );

      await result.current.mutationPost.mutateAsync({ payload: {} });

      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
        "Recurso editado com sucesso."
      );
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledTimes(1);
    });

    it("invalida a query 'receitas-previstas-outros-recursos-periodo' após criação bem-sucedida", async () => {
      postReceitasPrevistasOutrosRecursosPeriodo.mockResolvedValueOnce({});
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(
        () => usePostReceitasPrevistasOutrosRecursos(mockOnClose),
        { wrapper }
      );

      await result.current.mutationPost.mutateAsync({ payload: {} });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith(
        "receitas-previstas-outros-recursos-periodo"
      );
    });

    it("chama onClose após criação bem-sucedida", async () => {
      postReceitasPrevistasOutrosRecursosPeriodo.mockResolvedValueOnce({});

      const { result } = renderHook(
        () => usePostReceitasPrevistasOutrosRecursos(mockOnClose),
        { wrapper }
      );

      await result.current.mutationPost.mutateAsync({ payload: {} });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("não lança erro quando onClose não é fornecido", async () => {
      postReceitasPrevistasOutrosRecursosPeriodo.mockResolvedValueOnce({});

      const { result } = renderHook(
        () => usePostReceitasPrevistasOutrosRecursos(undefined),
        { wrapper }
      );

      await expect(
        result.current.mutationPost.mutateAsync({ payload: {} })
      ).resolves.not.toThrow();
    });

    it("não exibe toast de erro após criação bem-sucedida", async () => {
      postReceitasPrevistasOutrosRecursosPeriodo.mockResolvedValueOnce({});

      const { result } = renderHook(
        () => usePostReceitasPrevistasOutrosRecursos(mockOnClose),
        { wrapper }
      );

      await result.current.mutationPost.mutateAsync({ payload: {} });

      expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    });
  });

  describe("onError", () => {
    it("exibe toast de erro quando a API falha", async () => {
      postReceitasPrevistasOutrosRecursosPeriodo.mockRejectedValueOnce(
        new Error("Erro desconhecido")
      );

      const { result } = renderHook(
        () => usePostReceitasPrevistasOutrosRecursos(mockOnClose),
        { wrapper }
      );

      act(() => {
        result.current.mutationPost.mutate({ payload: {} });
      });

      await waitFor(() =>
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
          "Houve um erro ao editar recurso."
        )
      );
    });

    it("coloca mutationPost em estado de erro quando a API falha", async () => {
      postReceitasPrevistasOutrosRecursosPeriodo.mockRejectedValueOnce(
        new Error("Erro desconhecido")
      );

      const { result } = renderHook(
        () => usePostReceitasPrevistasOutrosRecursos(mockOnClose),
        { wrapper }
      );

      act(() => {
        result.current.mutationPost.mutate({ payload: {} });
      });

      await waitFor(() =>
        expect(result.current.mutationPost.isError).toBe(true)
      );
    });

    it("não chama onClose quando a API falha", async () => {
      postReceitasPrevistasOutrosRecursosPeriodo.mockRejectedValueOnce(
        new Error("Erro desconhecido")
      );

      const { result } = renderHook(
        () => usePostReceitasPrevistasOutrosRecursos(mockOnClose),
        { wrapper }
      );

      act(() => {
        result.current.mutationPost.mutate({ payload: {} });
      });

      await waitFor(() =>
        expect(result.current.mutationPost.isError).toBe(true)
      );

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("não invalida as queries quando ocorre erro", async () => {
      postReceitasPrevistasOutrosRecursosPeriodo.mockRejectedValueOnce(
        new Error("Erro desconhecido")
      );
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(
        () => usePostReceitasPrevistasOutrosRecursos(mockOnClose),
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
      postReceitasPrevistasOutrosRecursosPeriodo.mockRejectedValueOnce(
        new Error("Erro desconhecido")
      );

      const { result } = renderHook(
        () => usePostReceitasPrevistasOutrosRecursos(mockOnClose),
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
