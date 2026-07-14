import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { useGetComposicao } from "../useGetComposicao";
import { getComposicao } from "../../../../../services/Mandatos.service";
import { MembrosDaAssociacaoContext } from "../../context/MembrosDaAssociacao";

jest.mock("../../../../../services/Mandatos.service", () => ({
    getComposicao: jest.fn(),
}));

describe("useGetComposicao", () => {
    const createWrapper = (contextValue) => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });

        return ({ children }) => (
            <QueryClientProvider client={queryClient}>
                <MembrosDaAssociacaoContext.Provider value={contextValue}>
                    {children}
                </MembrosDaAssociacaoContext.Provider>
            </QueryClientProvider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve buscar a composição utilizando o uuid do contexto", async () => {
        const composicao = {
            uuid: "comp-1",
            nome: "Composição teste",
        };

        getComposicao.mockResolvedValue(composicao);

        const { result } = renderHook(() => useGetComposicao(), {
            wrapper: createWrapper({
                composicaoUuid: "uuid-contexto",
            }),
        });

        await waitFor(() =>
            expect(result.current.data).toEqual(composicao)
        );

        expect(getComposicao).toHaveBeenCalledWith("uuid-contexto");
        expect(result.current.isError).toBe(false);
    });

    it("deve utilizar o uuid informado por parâmetro", async () => {
        getComposicao.mockResolvedValue({ uuid: "comp-2" });

        renderHook(() => useGetComposicao("uuid-param"), {
            wrapper: createWrapper({
                composicaoUuid: "uuid-contexto",
            }),
        });

        await waitFor(() =>
            expect(getComposicao).toHaveBeenCalledWith("uuid-param")
        );
    });

    it("deve retornar erro quando a consulta falhar", async () => {
        const erro = new Error("Erro");

        getComposicao.mockRejectedValue(erro);

        const { result } = renderHook(() => useGetComposicao(), {
            wrapper: createWrapper({
                composicaoUuid: "uuid-contexto",
            }),
        });

        await waitFor(() =>
            expect(result.current.isError).toBe(true)
        );

        expect(result.current.error).toBe(erro);
    });

    it("deve iniciar em loading enquanto a consulta não termina", () => {
        getComposicao.mockImplementation(
            () => new Promise(() => {})
        );

        const { result } = renderHook(() => useGetComposicao(), {
            wrapper: createWrapper({
                composicaoUuid: "uuid-contexto",
            }),
        });

        expect(result.current.isLoading).toBe(true);
    });
});