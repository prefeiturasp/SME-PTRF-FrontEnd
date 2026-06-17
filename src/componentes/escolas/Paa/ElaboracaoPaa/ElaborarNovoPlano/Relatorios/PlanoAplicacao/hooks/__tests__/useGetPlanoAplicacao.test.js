import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetPlanoAplicacao } from "../useGetPlanoAplicacao";
import { getPlanoAplicacao } from "../../../../../../../../../services/escolas/Paa.service";

jest.mock("../../../../../../../../../services/escolas/Paa.service", () => ({
  getPlanoAplicacao: jest.fn(),
}));

describe("useGetPlanoAplicacao", () => {
  let queryClient;
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
      },
    });

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  });

  describe("quando paaUuid não é fornecido", () => {
    it("não deve chamar getPlanoAplicacao com undefined", () => {
      renderHook(() => useGetPlanoAplicacao(undefined), { wrapper });
      expect(getPlanoAplicacao).not.toHaveBeenCalled();
    });

    it("não deve chamar getPlanoAplicacao com string vazia", () => {
      renderHook(() => useGetPlanoAplicacao(""), { wrapper });
      expect(getPlanoAplicacao).not.toHaveBeenCalled();
    });

    it("não deve chamar getPlanoAplicacao com null", () => {
      renderHook(() => useGetPlanoAplicacao(null), { wrapper });
      expect(getPlanoAplicacao).not.toHaveBeenCalled();
    });

    it("deve retornar isLoading como false quando desabilitado", () => {
      const { result } = renderHook(() => useGetPlanoAplicacao(undefined), { wrapper });
      expect(result.current.isLoading).toBe(false);
    });

    it("deve retornar data como undefined quando desabilitado", () => {
      const { result } = renderHook(() => useGetPlanoAplicacao(undefined), { wrapper });
      expect(result.current.data).toBeUndefined();
    });
  });

  describe("quando paaUuid é fornecido", () => {
    const paaUuid = "paa-uuid-123";

    it("deve chamar getPlanoAplicacao com o uuid correto", async () => {
      getPlanoAplicacao.mockResolvedValueOnce({ uuid: paaUuid, atividades: [] });

      renderHook(() => useGetPlanoAplicacao(paaUuid), { wrapper });

      await waitFor(() => expect(getPlanoAplicacao).toHaveBeenCalledWith(paaUuid));
    });

    it("deve retornar os dados após consulta bem-sucedida", async () => {
      const mockData = { uuid: paaUuid, atividades: [{ id: 1 }] };
      getPlanoAplicacao.mockResolvedValueOnce(mockData);

      const { result } = renderHook(() => useGetPlanoAplicacao(paaUuid), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.data).toEqual(mockData);
    });

    it("deve retornar isSuccess como true após consulta bem-sucedida", async () => {
      getPlanoAplicacao.mockResolvedValueOnce({});

      const { result } = renderHook(() => useGetPlanoAplicacao(paaUuid), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it("deve retornar isError como true quando a consulta falha", async () => {
      getPlanoAplicacao.mockRejectedValueOnce(new Error("Falha na API"));

      const { result } = renderHook(() => useGetPlanoAplicacao(paaUuid), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });

    it("deve expor o objeto error quando a consulta falha", async () => {
      const mockError = new Error("Erro de rede");
      getPlanoAplicacao.mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useGetPlanoAplicacao(paaUuid), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeDefined();
    });

    it("deve expor refetch como função", async () => {
      getPlanoAplicacao.mockResolvedValueOnce({});

      const { result } = renderHook(() => useGetPlanoAplicacao(paaUuid), { wrapper });

      expect(typeof result.current.refetch).toBe("function");
    });

    it("deve deixar de carregar após sucesso", async () => {
      getPlanoAplicacao.mockResolvedValueOnce({});

      const { result } = renderHook(() => useGetPlanoAplicacao(paaUuid), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
    });
  });
});
