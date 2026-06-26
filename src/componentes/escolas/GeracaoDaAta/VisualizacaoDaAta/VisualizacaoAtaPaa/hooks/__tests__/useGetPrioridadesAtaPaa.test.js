import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetPrioridadesAtaPaa } from "../useGetPrioridadesAtaPaa"; // Ajuste o caminho se necessário
import { getPrioridadesRelatorio } from "../../../../../../../services/escolas/Paa.service";
import { parseMoneyCentsBRL } from "../../../../../../../utils/money";

jest.mock("../../../../../../../services/escolas/Paa.service", () => ({
  getPrioridadesRelatorio: jest.fn(),
}));

jest.mock("../../../../../../../utils/money", () => ({
  parseMoneyCentsBRL: jest.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useGetPrioridadesAtaPaa", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it("não deve executar a query se o uuid_paa não for fornecido (enabled: false)", () => {
        const { result } = renderHook(() => useGetPrioridadesAtaPaa(null), {
            wrapper: createWrapper(),
        });

        expect(result.current.unfetch).toBeUndefined();
        expect(getPrioridadesRelatorio).not.toHaveBeenCalled();
        expect(result.current.prioridadesAgrupadas).toEqual({
            PTRF: { prioridades: [], total: 0 },
            PDDE: { prioridades: [], total: 0 },
            RECURSO_PROPRIO: { prioridades: [], total: 0 },
        });
    });

    it("deve gerenciar o localStorage corretamente e retornar os dados agrupados com sucesso se a API responder com .results", async () => {
        const mockUuid = "123-abc";
        localStorage.setItem("PAA", "paa-antigo");

        const mockData = {
            results: [
                { prioridade: true, recurso: "Fundo PTRF", valor_total: 1000 },
                { prioridade: true, recurso: "Dinheiro PDDE", valor_total: "2000" },
                { prioridade: true, acao_associacao_objeto: { e_recursos_proprios: true }, valor_total: 1500 },
                { prioridade: false, recurso: "IGNORADO", valor_total: 500 }, // Deve ser filtrado por !p.prioridade
            ],
        };

        getPrioridadesRelatorio.mockResolvedValueOnce(mockData);
        parseMoneyCentsBRL.mockReturnValueOnce(2000); // Para o valor "2000" string

        const { result } = renderHook(() => useGetPrioridadesAtaPaa(mockUuid), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(getPrioridadesRelatorio).toHaveBeenCalledTimes(1);
        expect(localStorage.getItem("PAA")).toBe("paa-antigo");

        const { PTRF, PDDE, RECURSO_PROPRIO } = result.current.prioridadesAgrupadas;

        expect(PTRF.prioridades).toHaveLength(1);
        expect(PTRF.total).toBe(1000);

        expect(PDDE.prioridades).toHaveLength(1);
        expect(PDDE.total).toBe(2000);
        expect(parseMoneyCentsBRL).toHaveBeenCalledWith("2000");

        expect(RECURSO_PROPRIO.prioridades).toHaveLength(1);
        expect(RECURSO_PROPRIO.total).toBe(1500);
    });

    it("deve restaurar o localStorage corretamente removendo a chave caso ela não existisse previamente", async () => {
        getPrioridadesRelatorio.mockResolvedValueOnce({ results: [] });

        const { result } = renderHook(() => useGetPrioridadesAtaPaa("novo-paa"), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(localStorage.getItem("PAA")).toBeNull();
    });

    it("deve mapear corretamente o formato alternativo onde a API retorna um array direto", async () => {
        const mockDataDirectArray = [
            { prioridade: true, recurso: "Outro Recurso", valor_total: 300 },
        ];

        getPrioridadesRelatorio.mockResolvedValueOnce(mockDataDirectArray);

        const { result } = renderHook(() => useGetPrioridadesAtaPaa("uuid-valido"), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.prioridadesAgrupadas.RECURSO_PROPRIO.prioridades).toHaveLength(1);
        expect(result.current.prioridadesAgrupadas.RECURSO_PROPRIO.total).toBe(300);
    });

    it("deve lidar com falhas na API mantendo a integridade do localStorage e retornando erro", async () => {
        localStorage.setItem("PAA", "preservado");
        const apiError = new Error("Erro de conexão");
        getPrioridadesRelatorio.mockRejectedValueOnce(apiError);

        const { result } = renderHook(() => useGetPrioridadesAtaPaa("uuid-teste"), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toEqual(apiError);

        expect(localStorage.getItem("PAA")).toBe("preservado");
    });

    describe("Ramos de identificação de recursos (identificarRecursoPrioridade)", () => {
        it("deve marcar como RECURSO_PROPRIO quando o texto do recurso contiver a palavra 'RECURSO'", async () => {
            getPrioridadesRelatorio.mockResolvedValueOnce([
                { prioridade: true, recurso: "Algum recurso municipal", valor_total: 100 },
            ]);

            const { result } = renderHook(() => useGetPrioridadesAtaPaa("uuid"), { wrapper: createWrapper() });
            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.prioridadesAgrupadas.RECURSO_PROPRIO.prioridades).toHaveLength(1);
        });

        it("deve manter a string original do recurso se não bater com nenhum caso conhecido", async () => {
            getPrioridadesRelatorio.mockResolvedValueOnce([
                { prioridade: true, recurso: "OUTRO_TIPO_DESCONHECIDO", valor_total: 500 },
            ]);

            const { result } = renderHook(() => useGetPrioridadesAtaPaa("uuid"), { wrapper: createWrapper() });
            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.prioridadesAgrupadas.PTRF.prioridades).toHaveLength(0);
            expect(result.current.prioridadesAgrupadas.PDDE.prioridades).toHaveLength(0);
            expect(result.current.prioridadesAgrupadas.RECURSO_PROPRIO.prioridades).toHaveLength(0);
        });
    });

    describe("Ramos de tratamento de valores numéricos (mapPrioridade)", () => {
        it("deve usar o fallback numérico nativo caso parseMoneyCentsBRL retorne nulo", async () => {
            getPrioridadesRelatorio.mockResolvedValueOnce([
                { prioridade: true, recurso: "PTRF", valor_total: "450" },
            ]);
            parseMoneyCentsBRL.mockReturnValueOnce(null);

            const { result } = renderHook(() => useGetPrioridadesAtaPaa("uuid"), { wrapper: createWrapper() });
            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.prioridadesAgrupadas.PTRF.total).toBe(450);
        });

        it("deve retornar valor_total como null se o item original for nulo ou indefinido", async () => {
            getPrioridadesRelatorio.mockResolvedValueOnce([
                { prioridade: true, recurso: "PTRF", valor_total: null },
            ]);

            const { result } = renderHook(() => useGetPrioridadesAtaPaa("uuid"), { wrapper: createWrapper() });
            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.prioridadesAgrupadas.PTRF.prioridades[0].valor_total).toBeNull();
            expect(result.current.prioridadesAgrupadas.PTRF.total).toBe(0);
        });
    });
});