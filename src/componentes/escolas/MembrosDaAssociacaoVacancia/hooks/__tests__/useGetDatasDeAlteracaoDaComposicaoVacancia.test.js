import { renderHook, waitFor } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { useGetDatasDeAlteracaoDaComposicaoVacancia } from "../useGetDatasDeAlteracaoDaComposicaoVacancia";
import { getDatasDeAlteracaoDaComposicaoVacancia } from "../../../../../services/MandatosVacancia.service";

jest.mock("../../../../../services/MandatosVacancia.service", () => ({
    getDatasDeAlteracaoDaComposicaoVacancia: jest.fn(),
}));

describe("useGetDatasDeAlteracaoDaComposicaoVacancia", () => {
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

    it("deve buscar os marcos quando composicao_uuid é informado", async () => {
        const marcos = ["2026-01-01", "2026-03-15"];

        getDatasDeAlteracaoDaComposicaoVacancia.mockResolvedValue(marcos);

        const { result } = renderHook(
            () => useGetDatasDeAlteracaoDaComposicaoVacancia("composicao-1"),
            { wrapper: createWrapper() }
        );

        await waitFor(() =>
            expect(result.current.data).toEqual(marcos)
        );

        expect(getDatasDeAlteracaoDaComposicaoVacancia).toHaveBeenCalledWith("composicao-1");
        expect(result.current.isError).toBe(false);
    });

    it("não deve disparar a busca quando composicao_uuid não é informado", () => {
        renderHook(
            () => useGetDatasDeAlteracaoDaComposicaoVacancia(undefined),
            { wrapper: createWrapper() }
        );

        expect(getDatasDeAlteracaoDaComposicaoVacancia).not.toHaveBeenCalled();
    });

    it("deve retornar erro quando a consulta falhar", async () => {
        const erro = new Error("Erro na API");

        getDatasDeAlteracaoDaComposicaoVacancia.mockRejectedValue(erro);

        const { result } = renderHook(
            () => useGetDatasDeAlteracaoDaComposicaoVacancia("composicao-1"),
            { wrapper: createWrapper() }
        );

        await waitFor(() =>
            expect(result.current.isError).toBe(true)
        );

        expect(result.current.error).toBe(erro);
    });

    it("deve utilizar o valor padrão (lista vazia) enquanto a consulta estiver pendente", () => {
        getDatasDeAlteracaoDaComposicaoVacancia.mockImplementation(
            () => new Promise(() => {})
        );

        const { result } = renderHook(
            () => useGetDatasDeAlteracaoDaComposicaoVacancia("composicao-1"),
            { wrapper: createWrapper() }
        );

        expect(result.current.data).toEqual([]);
        expect(result.current.isLoading).toBe(true);
    });
});
