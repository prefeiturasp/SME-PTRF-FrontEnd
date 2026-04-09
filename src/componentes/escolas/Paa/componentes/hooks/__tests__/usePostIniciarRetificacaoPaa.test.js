import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePostIniciarRetificacaoPaa } from "../usePostIniciarRetificacaoPaa";
import { postIniciarRetificacaoPaa } from "../../../../../../services/escolas/Paa.service";

jest.mock("../../../../../../services/escolas/Paa.service", () => ({
  postIniciarRetificacaoPaa: jest.fn(),
}));

describe("usePostIniciarRetificacaoPaa", () => {
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
    it("retorna mutationPost definido", () => {
      const { result } = renderHook(() => usePostIniciarRetificacaoPaa(), { wrapper });

      expect(result.current.mutationPost).toBeDefined();
    });

    it("retorna mutationPost com função mutate", () => {
      const { result } = renderHook(() => usePostIniciarRetificacaoPaa(), { wrapper });

      expect(typeof result.current.mutationPost.mutate).toBe("function");
    });

    it("retorna mutationPost com função mutateAsync", () => {
      const { result } = renderHook(() => usePostIniciarRetificacaoPaa(), { wrapper });

      expect(typeof result.current.mutationPost.mutateAsync).toBe("function");
    });

    it("inicia com isPending false", () => {
      const { result } = renderHook(() => usePostIniciarRetificacaoPaa(), { wrapper });

      expect(result.current.mutationPost.isPending).toBe(false);
    });

    it("inicia com isError false", () => {
      const { result } = renderHook(() => usePostIniciarRetificacaoPaa(), { wrapper });

      expect(result.current.mutationPost.isError).toBe(false);
    });

    it("inicia com isSuccess false", () => {
      const { result } = renderHook(() => usePostIniciarRetificacaoPaa(), { wrapper });

      expect(result.current.mutationPost.isSuccess).toBe(false);
    });
  });

  describe("mutationFn", () => {
    it("chama postIniciarRetificacaoPaa com paaUuid e payload corretos", async () => {
      const mockResponse = { uuid: "retificacao-uuid-123" };
      postIniciarRetificacaoPaa.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => usePostIniciarRetificacaoPaa(), { wrapper });

      const paaUuid = "paa-uuid-123";
      const payload = { motivo: "Correção de dados" };

      await result.current.mutationPost.mutateAsync({ paaUuid, payload });

      expect(postIniciarRetificacaoPaa).toHaveBeenCalledWith(paaUuid, payload);
      expect(postIniciarRetificacaoPaa).toHaveBeenCalledTimes(1);
    });

    it("retorna os dados da API após sucesso", async () => {
      const mockResponse = { uuid: "retificacao-uuid-123", status: "EM_RETIFICACAO" };
      postIniciarRetificacaoPaa.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => usePostIniciarRetificacaoPaa(), { wrapper });

      const data = await result.current.mutationPost.mutateAsync({
        paaUuid: "paa-uuid-123",
        payload: {},
      });

      expect(data).toEqual(mockResponse);
    });

    it("passa paaUuid como primeiro argumento e payload como segundo", async () => {
      postIniciarRetificacaoPaa.mockResolvedValueOnce({ uuid: "retificacao-uuid-123" });

      const { result } = renderHook(() => usePostIniciarRetificacaoPaa(), { wrapper });

      const paaUuid = "paa-uuid-abc";
      const payload = { campo: "valor" };

      await result.current.mutationPost.mutateAsync({ paaUuid, payload });

      const [firstArg, secondArg] = postIniciarRetificacaoPaa.mock.calls[0];
      expect(firstArg).toBe(paaUuid);
      expect(secondArg).toBe(payload);
    });
  });

  describe("estados da mutation", () => {
    it("fica em estado de sucesso após chamada bem-sucedida", async () => {
      postIniciarRetificacaoPaa.mockResolvedValueOnce({ uuid: "retificacao-uuid-123" });

      const { result } = renderHook(() => usePostIniciarRetificacaoPaa(), { wrapper });

      act(() => {
        result.current.mutationPost.mutate({ paaUuid: "paa-uuid-123", payload: {} });
      });

      await waitFor(() =>
        expect(result.current.mutationPost.isSuccess).toBe(true)
      );
    });

    it("fica em estado de erro quando a API falha", async () => {
      postIniciarRetificacaoPaa.mockRejectedValueOnce(new Error("Erro na API"));

      const { result } = renderHook(() => usePostIniciarRetificacaoPaa(), { wrapper });

      act(() => {
        result.current.mutationPost.mutate({ paaUuid: "paa-uuid-123", payload: {} });
      });

      await waitFor(() =>
        expect(result.current.mutationPost.isError).toBe(true)
      );
    });

    it("não chama postIniciarRetificacaoPaa antes de invocar mutate", () => {
      renderHook(() => usePostIniciarRetificacaoPaa(), { wrapper });

      expect(postIniciarRetificacaoPaa).not.toHaveBeenCalled();
    });
  });
});
