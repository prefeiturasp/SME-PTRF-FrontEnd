import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetPrioridadesRelatorio } from "../useGetPrioridadesRelatorio";
import { getPrioridadesRelatorio } from "../../../../../../../../../services/escolas/Paa.service";
import { parseMoneyCentsBRL } from "../../../../../../../../../utils/money";

jest.mock("../../../../../../../../../services/escolas/Paa.service", () => ({
  getPrioridadesRelatorio: jest.fn(),
}));

jest.mock("../../../../../../../../../utils/money", () => ({
  parseMoneyCentsBRL: jest.fn(),
}));

describe("useGetPrioridadesRelatorio", () => {
  let queryClient;
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    parseMoneyCentsBRL.mockImplementation((value) => {
      const clean = value.replace(/[^\d]/g, "");
      const float = Number.parseFloat(clean) / 100;
      return Number.isNaN(float) ? null : float;
    });

    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
      },
    });

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  });

  describe("chamada ao serviço", () => {
    it("deve chamar getPrioridadesRelatorio com os filtros fornecidos", async () => {
      const filtros = { periodo: "2024-01", associacao: "uuid-abc" };
      getPrioridadesRelatorio.mockResolvedValueOnce([]);

      renderHook(() => useGetPrioridadesRelatorio(filtros), { wrapper });

      await waitFor(() =>
        expect(getPrioridadesRelatorio).toHaveBeenCalledWith(filtros)
      );
    });

    it("deve chamar getPrioridadesRelatorio com objeto vazio quando filtros não são fornecidos", async () => {
      getPrioridadesRelatorio.mockResolvedValueOnce([]);

      renderHook(() => useGetPrioridadesRelatorio(), { wrapper });

      await waitFor(() =>
        expect(getPrioridadesRelatorio).toHaveBeenCalledWith({})
      );
    });

    it("deve expor refetch como função", () => {
      getPrioridadesRelatorio.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useGetPrioridadesRelatorio(), { wrapper });

      expect(typeof result.current.refetch).toBe("function");
    });

    it("deve retornar isError como true quando a consulta falha", async () => {
      getPrioridadesRelatorio.mockRejectedValueOnce(new Error("Erro de rede"));

      const { result } = renderHook(() => useGetPrioridadesRelatorio(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });
  });

  describe("prioridades — formato de resposta", () => {
    it("deve retornar prioridades como array vazio quando data é undefined", () => {
      getPrioridadesRelatorio.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useGetPrioridadesRelatorio(), { wrapper });

      expect(result.current.prioridades).toEqual([]);
    });

    it("deve retornar prioridades mapeadas quando data é um array simples", async () => {
      const item = { id: 1, acao_associacao_objeto: { nome: "Ação A" }, valor_total: 100 };
      getPrioridadesRelatorio.mockResolvedValueOnce([item]);

      const { result } = renderHook(() => useGetPrioridadesRelatorio(), { wrapper });

      await waitFor(() => expect(result.current.prioridades).toHaveLength(1));

      expect(result.current.prioridades[0].acao).toBe("Ação A");
    });

    it("deve retornar prioridades mapeadas quando data tem formato paginado (results)", async () => {
      const item = { id: 2, acao_associacao_objeto: { nome: "Ação B" }, valor_total: 200 };
      getPrioridadesRelatorio.mockResolvedValueOnce({ results: [item], count: 1 });

      const { result } = renderHook(() => useGetPrioridadesRelatorio(), { wrapper });

      await waitFor(() => expect(result.current.prioridades).toHaveLength(1));

      expect(result.current.prioridades[0].acao).toBe("Ação B");
    });
  });

  describe("mapPrioridade — campo acao", () => {
    it("deve usar acao_associacao_objeto.nome como acao", async () => {
      const item = {
        acao_associacao_objeto: { nome: "PTRF" },
        acao_pdde_objeto: { nome: "PDDE" },
        valor_total: 0,
      };
      getPrioridadesRelatorio.mockResolvedValueOnce([item]);

      const { result } = renderHook(() => useGetPrioridadesRelatorio(), { wrapper });

      await waitFor(() => expect(result.current.prioridades).toHaveLength(1));

      expect(result.current.prioridades[0].acao).toBe("PTRF");
    });

    it("deve usar acao_pdde_objeto.nome quando acao_associacao_objeto não existe", async () => {
      const item = { acao_pdde_objeto: { nome: "PDDE Acessibilidade" }, valor_total: 0 };
      getPrioridadesRelatorio.mockResolvedValueOnce([item]);

      const { result } = renderHook(() => useGetPrioridadesRelatorio(), { wrapper });

      await waitFor(() => expect(result.current.prioridades).toHaveLength(1));

      expect(result.current.prioridades[0].acao).toBe("PDDE Acessibilidade");
    });

    it("deve retornar 'Recursos Próprios' quando recurso é RECURSO_PROPRIO", async () => {
      const item = { recurso: "RECURSO_PROPRIO", valor_total: 0 };
      getPrioridadesRelatorio.mockResolvedValueOnce([item]);

      const { result } = renderHook(() => useGetPrioridadesRelatorio(), { wrapper });

      await waitFor(() => expect(result.current.prioridades).toHaveLength(1));

      expect(result.current.prioridades[0].acao).toBe("Recursos Próprios");
    });

    it("deve retornar string vazia quando não há nenhuma fonte de acao", async () => {
      const item = { recurso: "OUTRO", valor_total: 0 };
      getPrioridadesRelatorio.mockResolvedValueOnce([item]);

      const { result } = renderHook(() => useGetPrioridadesRelatorio(), { wrapper });

      await waitFor(() => expect(result.current.prioridades).toHaveLength(1));

      expect(result.current.prioridades[0].acao).toBe("");
    });
  });

  describe("mapPrioridade — campo valor_total", () => {
    it("deve retornar valor_total diretamente quando já é number", async () => {
      const item = { valor_total: 150.75, acao_associacao_objeto: { nome: "X" } };
      getPrioridadesRelatorio.mockResolvedValueOnce([item]);

      const { result } = renderHook(() => useGetPrioridadesRelatorio(), { wrapper });

      await waitFor(() => expect(result.current.prioridades).toHaveLength(1));

      expect(result.current.prioridades[0].valor_total).toBe(150.75);
      expect(parseMoneyCentsBRL).not.toHaveBeenCalled();
    });

    it("deve parsear valor_total via parseMoneyCentsBRL quando é string", async () => {
      parseMoneyCentsBRL.mockReturnValueOnce(99.99);
      const item = { valor_total: "R$ 99,99", acao_associacao_objeto: { nome: "X" } };
      getPrioridadesRelatorio.mockResolvedValueOnce([item]);

      const { result } = renderHook(() => useGetPrioridadesRelatorio(), { wrapper });

      await waitFor(() => expect(result.current.prioridades).toHaveLength(1));

      expect(parseMoneyCentsBRL).toHaveBeenCalledWith("R$ 99,99");
      expect(result.current.prioridades[0].valor_total).toBe(99.99);
    });

    it("deve usar Number(valor_total) como fallback quando parseMoneyCentsBRL retorna null", async () => {
      parseMoneyCentsBRL.mockReturnValueOnce(null);
      const item = { valor_total: "42.5", acao_associacao_objeto: { nome: "X" } };
      getPrioridadesRelatorio.mockResolvedValueOnce([item]);

      const { result } = renderHook(() => useGetPrioridadesRelatorio(), { wrapper });

      await waitFor(() => expect(result.current.prioridades).toHaveLength(1));

      expect(result.current.prioridades[0].valor_total).toBe(42.5);
    });

    it("deve retornar null quando valor_total é null", async () => {
      const item = { valor_total: null, acao_associacao_objeto: { nome: "X" } };
      getPrioridadesRelatorio.mockResolvedValueOnce([item]);

      const { result } = renderHook(() => useGetPrioridadesRelatorio(), { wrapper });

      await waitFor(() => expect(result.current.prioridades).toHaveLength(1));

      expect(result.current.prioridades[0].valor_total).toBeNull();
    });

    it("deve retornar null quando valor_total é undefined", async () => {
      const item = { acao_associacao_objeto: { nome: "X" } };
      getPrioridadesRelatorio.mockResolvedValueOnce([item]);

      const { result } = renderHook(() => useGetPrioridadesRelatorio(), { wrapper });

      await waitFor(() => expect(result.current.prioridades).toHaveLength(1));

      expect(result.current.prioridades[0].valor_total).toBeNull();
    });
  });

  describe("quantidade", () => {
    it("deve usar count da resposta paginada quando disponível", async () => {
      const items = [{ valor_total: 0, acao_associacao_objeto: { nome: "A" } }];
      getPrioridadesRelatorio.mockResolvedValueOnce({ results: items, count: 50 });

      const { result } = renderHook(() => useGetPrioridadesRelatorio(), { wrapper });

      await waitFor(() => expect(result.current.prioridades).toHaveLength(1));

      expect(result.current.quantidade).toBe(50);
    });

    it("deve usar o length de prioridades quando count não existe", async () => {
      const items = [
        { valor_total: 0, acao_associacao_objeto: { nome: "A" } },
        { valor_total: 0, acao_pdde_objeto: { nome: "B" } },
      ];
      getPrioridadesRelatorio.mockResolvedValueOnce(items);

      const { result } = renderHook(() => useGetPrioridadesRelatorio(), { wrapper });

      await waitFor(() => expect(result.current.prioridades).toHaveLength(2));

      expect(result.current.quantidade).toBe(2);
    });

    it("deve retornar quantidade 0 quando não há dados", () => {
      getPrioridadesRelatorio.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useGetPrioridadesRelatorio(), { wrapper });

      expect(result.current.quantidade).toBe(0);
    });
  });
});
