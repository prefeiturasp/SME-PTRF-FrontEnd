import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDeleteRecursoProprio } from "../../hooks/useDeleteRecursoProprio";
import { deleteRecursoProprioPaa } from "../../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";

jest.mock("../../../../../../../../services/escolas/Paa.service", () => ({
  deleteRecursoProprioPaa: jest.fn(),
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

describe("useDeleteRecursoProprio", () => {
  let queryClient;
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

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
    it("retorna mutationDelete com função mutate", () => {
      const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });

      expect(result.current.mutationDelete).toBeDefined();
      expect(typeof result.current.mutationDelete.mutate).toBe("function");
    });

    it("inicia com isPending false", () => {
      const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });

      expect(result.current.mutationDelete.isPending).toBe(false);
    });

    it("inicia com isError false", () => {
      const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });

      expect(result.current.mutationDelete.isError).toBe(false);
    });
  });

  describe("mutationFn — entrada como string (UUID direto)", () => {
    it("chama deleteRecursoProprioPaa com o UUID correto", async () => {
      deleteRecursoProprioPaa.mockResolvedValueOnce({});
      const uuid = "test-uuid-123";

      const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });
      await result.current.mutationDelete.mutateAsync(uuid);

      expect(deleteRecursoProprioPaa).toHaveBeenCalledWith(uuid);
      expect(deleteRecursoProprioPaa).toHaveBeenCalledTimes(1);
    });

    it("chama deleteRecursoProprioPaa apenas com o UUID, sem segundo argumento", async () => {
      deleteRecursoProprioPaa.mockResolvedValueOnce({});
      const uuid = "string-uuid-only";

      const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });
      await result.current.mutationDelete.mutateAsync(uuid);

      const [callUuid, callExtra] = deleteRecursoProprioPaa.mock.calls[0];
      expect(callUuid).toBe(uuid);
      expect(callExtra).toBeUndefined();
    });
  });

  describe("mutationFn — entrada como objeto { uuid, confirmar_limpeza_prioridades_paa }", () => {
    it("chama deleteRecursoProprioPaa com uuid e flag de confirmação", async () => {
      deleteRecursoProprioPaa.mockResolvedValueOnce({});
      const data = {
        uuid: "obj-uuid-456",
        confirmar_limpeza_prioridades_paa: true,
      };

      const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });
      await result.current.mutationDelete.mutateAsync(data);

      expect(deleteRecursoProprioPaa).toHaveBeenCalledWith(
        data.uuid,
        data.confirmar_limpeza_prioridades_paa
      );
    });

    it("chama deleteRecursoProprioPaa com uuid e flag false", async () => {
      deleteRecursoProprioPaa.mockResolvedValueOnce({});
      const data = {
        uuid: "obj-uuid-789",
        confirmar_limpeza_prioridades_paa: false,
      };

      const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });
      await result.current.mutationDelete.mutateAsync(data);

      expect(deleteRecursoProprioPaa).toHaveBeenCalledWith(
        data.uuid,
        data.confirmar_limpeza_prioridades_paa
      );
    });
  });

  describe("onSuccess", () => {
    it("exibe toast de sucesso após exclusão bem-sucedida", async () => {
      deleteRecursoProprioPaa.mockResolvedValueOnce({});

      const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });
      await result.current.mutationDelete.mutateAsync("test-uuid");

      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
        "Recurso próprio excluído com sucesso."
      );
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledTimes(1);
    });

    it("invalida a query 'recursos-proprios' após exclusão bem-sucedida", async () => {
      deleteRecursoProprioPaa.mockResolvedValueOnce({});
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });
      await result.current.mutationDelete.mutateAsync("test-uuid");

      expect(invalidateQueriesSpy).toHaveBeenCalledWith(["recursos-proprios"]);
    });

    it("invalida a query 'totalizador-recurso-proprio' após exclusão bem-sucedida", async () => {
      deleteRecursoProprioPaa.mockResolvedValueOnce({});
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });
      await result.current.mutationDelete.mutateAsync("test-uuid");

      expect(invalidateQueriesSpy).toHaveBeenCalledWith([
        "totalizador-recurso-proprio",
      ]);
    });

    it("invalida as duas queries após exclusão bem-sucedida", async () => {
      deleteRecursoProprioPaa.mockResolvedValueOnce({});
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });
      await result.current.mutationDelete.mutateAsync("test-uuid");

      expect(invalidateQueriesSpy).toHaveBeenCalledTimes(2);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith(["recursos-proprios"]);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith([
        "totalizador-recurso-proprio",
      ]);
    });

    it("não exibe toast de erro após exclusão bem-sucedida", async () => {
      deleteRecursoProprioPaa.mockResolvedValueOnce({});

      const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });
      await result.current.mutationDelete.mutateAsync("test-uuid");

      expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    });
  });

  describe("onError — com mensagem específica da API", () => {
    it("exibe a mensagem de erro retornada pela API", async () => {
      deleteRecursoProprioPaa.mockRejectedValueOnce({
        response: { data: { mensagem: "Erro específico da API" } },
      });

      const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });

      act(() => {
        result.current.mutationDelete.mutate("test-uuid");
      });

      await waitFor(() =>
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
          "Erro específico da API"
        )
      );
    });

    it("coloca mutationDelete em estado de erro", async () => {
      deleteRecursoProprioPaa.mockRejectedValueOnce({
        response: { data: { mensagem: "Erro da API" } },
      });

      const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });

      act(() => {
        result.current.mutationDelete.mutate("test-uuid");
      });

      await waitFor(() =>
        expect(result.current.mutationDelete.isError).toBe(true)
      );
    });

    it("não invalida as queries quando ocorre erro", async () => {
      deleteRecursoProprioPaa.mockRejectedValueOnce({
        response: { data: { mensagem: "Erro da API" } },
      });
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });

      act(() => {
        result.current.mutationDelete.mutate("test-uuid");
      });

      await waitFor(() =>
        expect(result.current.mutationDelete.isError).toBe(true)
      );

      expect(invalidateQueriesSpy).not.toHaveBeenCalled();
    });
  });

  describe("onError — sem mensagem específica da API", () => {
    it("exibe mensagem de erro genérica quando o erro não tem response.data.mensagem", async () => {
      deleteRecursoProprioPaa.mockRejectedValueOnce(new Error("Erro genérico"));

      const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });

      act(() => {
        result.current.mutationDelete.mutate("test-uuid");
      });

      await waitFor(() =>
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
          "Houve um erro ao tentar excluir recurso próprio."
        )
      );
    });

    it("exibe mensagem genérica quando o erro tem response mas sem data.mensagem", async () => {
      deleteRecursoProprioPaa.mockRejectedValueOnce({
        response: { data: {} },
      });

      const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });

      act(() => {
        result.current.mutationDelete.mutate("test-uuid");
      });

      await waitFor(() =>
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
          "Houve um erro ao tentar excluir recurso próprio."
        )
      );
    });

    it("exibe mensagem genérica quando o erro não tem response", async () => {
      deleteRecursoProprioPaa.mockRejectedValueOnce({ message: "Network Error" });

      const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });

      act(() => {
        result.current.mutationDelete.mutate("test-uuid");
      });

      await waitFor(() =>
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
          "Houve um erro ao tentar excluir recurso próprio."
        )
      );
    });

    it("coloca mutationDelete em estado de erro", async () => {
      deleteRecursoProprioPaa.mockRejectedValueOnce(new Error("Erro genérico"));

      const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });

      act(() => {
        result.current.mutationDelete.mutate("test-uuid");
      });

      await waitFor(() =>
        expect(result.current.mutationDelete.isError).toBe(true)
      );
    });

    it("não exibe toast de sucesso quando ocorre erro", async () => {
      deleteRecursoProprioPaa.mockRejectedValueOnce(new Error("Erro genérico"));

      const { result } = renderHook(() => useDeleteRecursoProprio(), { wrapper });

      act(() => {
        result.current.mutationDelete.mutate("test-uuid");
      });

      await waitFor(() =>
        expect(result.current.mutationDelete.isError).toBe(true)
      );

      expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
    });
  });
});
