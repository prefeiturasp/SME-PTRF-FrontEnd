import { renderHook, waitFor } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { useGetMandatosAnterioresVacancia } from "../useGetMandatosAnterioresVacancia";
import { getMandatosAnterioresVacancia } from "../../../../../services/MandatosVacancia.service";

jest.mock("../../../../../services/MandatosVacancia.service", () => ({
    getMandatosAnterioresVacancia: jest.fn(),
}));

describe("useGetMandatosAnterioresVacancia", () => {
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

    it("deve buscar a lista de mandatos anteriores", async () => {
        const mandatos = [
            { uuid: "mandato-2", data_inicial: "2025-01-01", data_final: "2025-12-31" },
            { uuid: "mandato-1", data_inicial: "2024-01-01", data_final: "2024-12-31" },
        ];

        getMandatosAnterioresVacancia.mockResolvedValue(mandatos);

        const { result } = renderHook(
            () => useGetMandatosAnterioresVacancia(),
            { wrapper: createWrapper() }
        );

        await waitFor(() =>
            expect(result.current.data).toEqual(mandatos)
        );

        expect(getMandatosAnterioresVacancia).toHaveBeenCalled();
        expect(result.current.isError).toBe(false);
    });

    it("deve retornar erro quando a consulta falhar", async () => {
        const erro = new Error("Erro na API");

        getMandatosAnterioresVacancia.mockRejectedValue(erro);

        const { result } = renderHook(
            () => useGetMandatosAnterioresVacancia(),
            { wrapper: createWrapper() }
        );

        await waitFor(() =>
            expect(result.current.isError).toBe(true)
        );

        expect(result.current.error).toBe(erro);
    });

    it("deve utilizar o valor padrão (lista vazia) enquanto a consulta estiver pendente", () => {
        getMandatosAnterioresVacancia.mockImplementation(
            () => new Promise(() => {})
        );

        const { result } = renderHook(
            () => useGetMandatosAnterioresVacancia(),
            { wrapper: createWrapper() }
        );

        expect(result.current.data).toEqual([]);
        expect(result.current.isLoading).toBe(true);
    });
});
