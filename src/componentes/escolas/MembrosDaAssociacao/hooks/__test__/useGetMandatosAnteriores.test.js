import { renderHook, waitFor } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { useGetMandatosAnteriores } from "../useGetMandatosAnteriores";
import { getMandatosAnteriores } from "../../../../../services/Mandatos.service";

jest.mock("../../../../../services/Mandatos.service", () => ({
    getMandatosAnteriores: jest.fn(),
}));

describe("useGetMandatosAnteriores", () => {
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

    it("deve retornar os mandatos anteriores", async () => {
        const mandatos = [
            { uuid: "1" },
            { uuid: "2" },
            { uuid: "3" },
        ];

        getMandatosAnteriores.mockResolvedValue(mandatos);

        const { result } = renderHook(
            () => useGetMandatosAnteriores(),
            {
                wrapper: createWrapper(),
            }
        );

        await waitFor(() =>
            expect(result.current.data_mandatos_anteriores).toEqual(
                mandatos
            )
        );

        expect(getMandatosAnteriores).toHaveBeenCalledTimes(1);
        expect(result.current.count_mandatos_anteriores).toBe(3);
        expect(result.current.isError).toBe(false);
    });

    it("deve retornar zero mandatos", async () => {
        getMandatosAnteriores.mockResolvedValue([]);

        const { result } = renderHook(
            () => useGetMandatosAnteriores(),
            {
                wrapper: createWrapper(),
            }
        );

        await waitFor(() =>
            expect(result.current.data_mandatos_anteriores).toEqual([])
        );

        expect(result.current.count_mandatos_anteriores).toBe(0);
    });

    it("deve retornar erro quando a consulta falhar", async () => {
        const erro = new Error("Erro");

        getMandatosAnteriores.mockRejectedValue(erro);

        const { result } = renderHook(
            () => useGetMandatosAnteriores(),
            {
                wrapper: createWrapper(),
            }
        );

        await waitFor(() =>
            expect(result.current.isError).toBe(true)
        );

        expect(result.current.error).toBe(erro);
    });

    it("deve retornar o valor padrão enquanto a consulta estiver pendente", () => {
        getMandatosAnteriores.mockImplementation(
            () => new Promise(() => {})
        );

        const { result } = renderHook(
            () => useGetMandatosAnteriores(),
            {
                wrapper: createWrapper(),
            }
        );

        expect(result.current.data_mandatos_anteriores).toEqual({
            uuid: null,
            composicoes: [],
        });

        expect(result.current.count_mandatos_anteriores).toBeUndefined();
    });
});