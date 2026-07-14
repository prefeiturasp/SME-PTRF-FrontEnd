import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { useGetMandatoAnterior } from "../useGetMandatoAnterior";
import { MembrosDaAssociacaoContext } from "../../context/MembrosDaAssociacao";
import { getMandatoAnterior } from "../../../../../services/Mandatos.service";
import { visoesService } from "../../../../../services/visoes.service";

jest.mock("../../../../../services/Mandatos.service", () => ({
    getMandatoAnterior: jest.fn(),
}));

jest.mock("../../../../../services/visoes.service", () => ({
    visoesService: {
        getItemUsuarioLogado: jest.fn(),
    },
}));

describe("useGetMandatoAnterior", () => {
    const createWrapper = (mandatoUuid = "") => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });

        return ({ children }) => (
            <QueryClientProvider client={queryClient}>
                <MembrosDaAssociacaoContext.Provider
                    value={{ mandatoUuid }}
                >
                    {children}
                </MembrosDaAssociacaoContext.Provider>
            </QueryClientProvider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();

        visoesService.getItemUsuarioLogado.mockReturnValue("assoc-1");
    });

    it("deve buscar o mandato anterior", async () => {
        const resposta = {
            uuid: "mandato-1",
            composicoes: [{ uuid: 1 }, { uuid: 2 }],
        };

        getMandatoAnterior.mockResolvedValue(resposta);

        const { result } = renderHook(
            () => useGetMandatoAnterior(),
            {
                wrapper: createWrapper("mandato-1"),
            }
        );

        await waitFor(() =>
            expect(result.current.data).toEqual(resposta)
        );

        expect(getMandatoAnterior).toHaveBeenCalledWith(
            "mandato-1",
            "assoc-1"
        );

        expect(result.current.count).toBe(2);
    });

    it("deve retornar count igual a zero quando não houver composições", async () => {
        getMandatoAnterior.mockResolvedValue({
            uuid: "1",
            composicoes: [],
        });

        const { result } = renderHook(
            () => useGetMandatoAnterior(),
            {
                wrapper: createWrapper("mandato-1"),
            }
        );

        await waitFor(() =>
            expect(result.current.data.uuid).toBe("1")
        );

        expect(result.current.count).toBe(0);
    });

    it("não deve executar a query quando mandatoUuid estiver vazio", () => {
        renderHook(() => useGetMandatoAnterior(), {
            wrapper: createWrapper(""),
        });

        expect(getMandatoAnterior).not.toHaveBeenCalled();
    });

    it("deve retornar o objeto padrão enquanto não houver dados", () => {
        getMandatoAnterior.mockImplementation(
            () => new Promise(() => {})
        );

        const { result } = renderHook(
            () => useGetMandatoAnterior(),
            {
                wrapper: createWrapper("mandato-1"),
            }
        );

        expect(result.current.data).toEqual({
            uuid: null,
            composicoes: [],
        });

        expect(result.current.count).toBe(0);
    });

    it("deve retornar erro quando a consulta falhar", async () => {
        const erro = new Error("Erro");

        getMandatoAnterior.mockRejectedValue(erro);

        const { result } = renderHook(
            () => useGetMandatoAnterior(),
            {
                wrapper: createWrapper("mandato-1"),
            }
        );

        await waitFor(() =>
            expect(result.current.isError).toBe(true)
        );

        expect(result.current.error).toBe(erro);
    });
});