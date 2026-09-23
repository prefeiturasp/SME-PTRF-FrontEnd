import { renderHook, waitFor } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { useGetTimelineConsolidadaComposicaoVacancia } from "../useGetTimelineConsolidadaComposicaoVacancia";
import { getTimelineConsolidadaComposicaoVacancia } from "../../../../../services/MandatosVacancia.service";

jest.mock("../../../../../services/MandatosVacancia.service", () => ({
    getTimelineConsolidadaComposicaoVacancia: jest.fn(),
}));

describe("useGetTimelineConsolidadaComposicaoVacancia", () => {
    const createWrapper = () => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });

        return ({ children }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve buscar a timeline consolidada usando apenas o composicao_uuid", async () => {
        const timelineConsolidada = { diretoria_executiva: [], conselho_fiscal: [] };

        getTimelineConsolidadaComposicaoVacancia.mockResolvedValue(timelineConsolidada);

        const { result } = renderHook(
            () => useGetTimelineConsolidadaComposicaoVacancia("composicao-1"),
            { wrapper: createWrapper() }
        );

        await waitFor(() =>
            expect(result.current.isLoading).toBe(false)
        );

        expect(getTimelineConsolidadaComposicaoVacancia).toHaveBeenCalledWith("composicao-1");
        expect(getTimelineConsolidadaComposicaoVacancia).toHaveBeenCalledTimes(1);
        expect(result.current.data).toEqual(timelineConsolidada);
    });

    it("não deve disparar a busca sem composicao_uuid", () => {
        renderHook(
            () => useGetTimelineConsolidadaComposicaoVacancia(undefined),
            { wrapper: createWrapper() }
        );

        expect(getTimelineConsolidadaComposicaoVacancia).not.toHaveBeenCalled();
    });

    it("deve retornar erro quando a requisição falhar", async () => {
        const erro = new Error("Erro na API");

        getTimelineConsolidadaComposicaoVacancia.mockRejectedValue(erro);

        const { result } = renderHook(
            () => useGetTimelineConsolidadaComposicaoVacancia("composicao-1"),
            { wrapper: createWrapper() }
        );

        await waitFor(() =>
            expect(result.current.isError).toBe(true)
        );

        expect(result.current.error).toBe(erro);
    });

    it("deve iniciar em loading", () => {
        getTimelineConsolidadaComposicaoVacancia.mockImplementation(
            () => new Promise(() => {})
        );

        const { result } = renderHook(
            () => useGetTimelineConsolidadaComposicaoVacancia("composicao-1"),
            { wrapper: createWrapper() }
        );

        expect(result.current.isLoading).toBe(true);
    });

    it("não deve refazer a busca ao trocar apenas a referência do composicao_uuid (mesmo valor)", async () => {
        const timelineConsolidada = { diretoria_executiva: [], conselho_fiscal: [] };
        getTimelineConsolidadaComposicaoVacancia.mockResolvedValue(timelineConsolidada);

        const { result, rerender } = renderHook(
            ({ composicaoUuid }) => useGetTimelineConsolidadaComposicaoVacancia(composicaoUuid),
            { wrapper: createWrapper(), initialProps: { composicaoUuid: "composicao-1" } }
        );

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Simula trocas de data selecionada no componente que consome o hook - como a
        // queryKey não inclui `data`, o mesmo composicao_uuid não deve gerar novas buscas.
        rerender({ composicaoUuid: "composicao-1" });
        rerender({ composicaoUuid: "composicao-1" });

        expect(getTimelineConsolidadaComposicaoVacancia).toHaveBeenCalledTimes(1);
    });
});
