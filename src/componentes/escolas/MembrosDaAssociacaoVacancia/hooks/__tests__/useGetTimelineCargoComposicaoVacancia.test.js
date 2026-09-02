import { renderHook, waitFor } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { useGetTimelineCargoComposicaoVacancia } from "../useGetTimelineCargoComposicaoVacancia";
import { getTimelineCargoComposicaoVacancia } from "../../../../../services/MandatosVacancia.service";

jest.mock("../../../../../services/MandatosVacancia.service", () => ({
    getTimelineCargoComposicaoVacancia: jest.fn(),
}));

describe("useGetTimelineCargoComposicaoVacancia", () => {
    const createWrapper = () => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
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

    it("deve buscar a timeline quando composicao_uuid e cargo_associacao forem informados", async () => {
        const registros = [{ uuid: "registro-1" }];

        getTimelineCargoComposicaoVacancia.mockResolvedValue(registros);

        const { result } = renderHook(
            () => useGetTimelineCargoComposicaoVacancia("composicao-1", "PRESIDENTE_DIRETORIA_EXECUTIVA"),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.data).toEqual(registros));

        expect(getTimelineCargoComposicaoVacancia).toHaveBeenCalledWith(
            "composicao-1", "PRESIDENTE_DIRETORIA_EXECUTIVA"
        );
        expect(result.current.isError).toBe(false);
    });

    it("não deve disparar a busca quando composicao_uuid não for informado", () => {
        renderHook(
            () => useGetTimelineCargoComposicaoVacancia(undefined, "PRESIDENTE_DIRETORIA_EXECUTIVA"),
            { wrapper: createWrapper() }
        );

        expect(getTimelineCargoComposicaoVacancia).not.toHaveBeenCalled();
    });

    it("não deve disparar a busca quando cargo_associacao não for informado", () => {
        renderHook(
            () => useGetTimelineCargoComposicaoVacancia("composicao-1", undefined),
            { wrapper: createWrapper() }
        );

        expect(getTimelineCargoComposicaoVacancia).not.toHaveBeenCalled();
    });

    it("deve utilizar lista vazia como valor padrão enquanto a consulta estiver pendente", () => {
        getTimelineCargoComposicaoVacancia.mockImplementation(() => new Promise(() => {}));

        const { result } = renderHook(
            () => useGetTimelineCargoComposicaoVacancia("composicao-1", "PRESIDENTE_DIRETORIA_EXECUTIVA"),
            { wrapper: createWrapper() }
        );

        expect(result.current.data).toEqual([]);
        expect(result.current.isLoading).toBe(true);
    });

    it("deve retornar erro quando a consulta falhar", async () => {
        const erro = new Error("Erro na API");

        getTimelineCargoComposicaoVacancia.mockRejectedValue(erro);

        const { result } = renderHook(
            () => useGetTimelineCargoComposicaoVacancia("composicao-1", "PRESIDENTE_DIRETORIA_EXECUTIVA"),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toBe(erro);
    });
});
