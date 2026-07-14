import { renderHook, waitFor } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { useGetCargosDiretoriaExecutiva } from "../useGetCargosDiretoriaExecutiva";
import { getCargosDaDiretoriaExecutiva } from "../../../../../services/Mandatos.service";

jest.mock("../../../../../services/Mandatos.service", () => ({
    getCargosDaDiretoriaExecutiva: jest.fn(),
}));

describe("useGetCargosDiretoriaExecutiva", () => {
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

    it("deve retornar os cargos da diretoria executiva", async () => {
        const cargos = [
            { uuid: "1", nome: "Presidente" },
            { uuid: "2", nome: "Secretário" },
        ];

        getCargosDaDiretoriaExecutiva.mockResolvedValue(cargos);

        const { result } = renderHook(
            () => useGetCargosDiretoriaExecutiva(),
            {
                wrapper: createWrapper(),
            }
        );

        await waitFor(
            () => expect(result.current.isError).toBe(false),
            () => expect(result.current.data_cargos_diretoria_executiva).toEqual(cargos)
        );

        expect(getCargosDaDiretoriaExecutiva).toHaveBeenCalledTimes(1);
    });

    it("deve retornar erro quando a requisição falhar", async () => {
        const erro = new Error("Erro na API");

        getCargosDaDiretoriaExecutiva.mockRejectedValue(erro);

        const { result } = renderHook(
            () => useGetCargosDiretoriaExecutiva(),
            {
                wrapper: createWrapper(),
            }
        );

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toBe(erro);
    });

    it("deve iniciar sem erro", () => {
        getCargosDaDiretoriaExecutiva.mockImplementation(
            () => new Promise(() => {})
        );

        const { result } = renderHook(
            () => useGetCargosDiretoriaExecutiva(),
            {
                wrapper: createWrapper(),
            }
        );

        expect(result.current.isError).toBe(false);
        expect(result.current.data_cargos_diretoria_executiva).toBeUndefined();
    });
});