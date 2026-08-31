import { renderHook, waitFor } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { useGetCargosDaComposicaoVacancia } from "../useGetCargosDaComposicaoVacancia";
import { getCargosDaComposicaoVacancia } from "../../../../../services/MandatosVacancia.service";

jest.mock("../../../../../services/MandatosVacancia.service", () => ({
    getCargosDaComposicaoVacancia: jest.fn(),
}));

describe("useGetCargosDaComposicaoVacancia", () => {
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

    it("deve buscar os cargos da composição usando a data informada", async () => {
        const cargos = { diretoria_executiva: [], conselho_fiscal: [] };

        getCargosDaComposicaoVacancia.mockResolvedValue(cargos);

        const { result } = renderHook(
            () => useGetCargosDaComposicaoVacancia("composicao-1", "2026-06-01"),
            { wrapper: createWrapper() }
        );

        await waitFor(() =>
            expect(result.current.isLoading).toBe(false)
        );

        expect(getCargosDaComposicaoVacancia).toHaveBeenCalledWith(
            "composicao-1", "2026-06-01"
        );
        expect(result.current.data).toEqual(cargos);
    });

    it("deve usar a data de hoje quando nenhuma data é informada", async () => {
        getCargosDaComposicaoVacancia.mockResolvedValue({});

        renderHook(
            () => useGetCargosDaComposicaoVacancia("composicao-1"),
            { wrapper: createWrapper() }
        );

        await waitFor(() =>
            expect(getCargosDaComposicaoVacancia).toHaveBeenCalled()
        );

        const [, dataChamada] = getCargosDaComposicaoVacancia.mock.calls[0];
        expect(dataChamada).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("não deve disparar a busca sem composicao_uuid", () => {
        renderHook(
            () => useGetCargosDaComposicaoVacancia(undefined),
            { wrapper: createWrapper() }
        );

        expect(getCargosDaComposicaoVacancia).not.toHaveBeenCalled();
    });

    it("deve retornar erro quando a requisição falhar", async () => {
        const erro = new Error("Erro na API");

        getCargosDaComposicaoVacancia.mockRejectedValue(erro);

        const { result } = renderHook(
            () => useGetCargosDaComposicaoVacancia("composicao-1"),
            { wrapper: createWrapper() }
        );

        await waitFor(() =>
            expect(result.current.isError).toBe(true)
        );

        expect(result.current.error).toBe(erro);
    });

    it("deve iniciar em loading", () => {
        getCargosDaComposicaoVacancia.mockImplementation(
            () => new Promise(() => {})
        );

        const { result } = renderHook(
            () => useGetCargosDaComposicaoVacancia("composicao-1"),
            { wrapper: createWrapper() }
        );

        expect(result.current.isLoading).toBe(true);
    });
});
