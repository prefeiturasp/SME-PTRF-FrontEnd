import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { useGetCargosDaComposicao } from "../useGetCargosDaComposicao";
import { getCargosDaComposicao } from "../../../../../services/Mandatos.service";
import { MembrosDaAssociacaoContext } from "../../context/MembrosDaAssociacao";

jest.mock("../../../../../services/Mandatos.service", () => ({
    getCargosDaComposicao: jest.fn(),
}));

describe("useGetCargosDaComposicao", () => {
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

    it("deve buscar utilizando o composicaoUuid do contexto", async () => {
        getCargosDaComposicao.mockResolvedValue(["cargo"]);

        const wrapper = createWrapper({
            composicaoUuid: "uuid-contexto",
        });

        const { result } = renderHook(
            () => useGetCargosDaComposicao(),
            { wrapper }
        );

        await waitFor(() =>
            expect(result.current.isLoading).toBe(false)
        );

        expect(getCargosDaComposicao).toHaveBeenCalledWith(
            "uuid-contexto"
        );

        expect(result.current.data).toEqual(["cargo"]);
    });

    it("deve utilizar o parâmetro quando informado", async () => {
        getCargosDaComposicao.mockResolvedValue(["cargo"]);

        const wrapper = createWrapper({
            composicaoUuid: "uuid-contexto",
        });

        renderHook(
            () => useGetCargosDaComposicao("uuid-param"),
            { wrapper }
        );

        await waitFor(() =>
            expect(getCargosDaComposicao).toHaveBeenCalled()
        );

        expect(getCargosDaComposicao).toHaveBeenCalledWith(
            "uuid-param"
        );
    });

    it("deve retornar erro quando a requisição falhar", async () => {
        const erro = new Error("Erro na API");

        getCargosDaComposicao.mockRejectedValue(erro);

        const wrapper = createWrapper({
            composicaoUuid: "uuid-contexto",
        });

        const { result } = renderHook(
            () => useGetCargosDaComposicao(),
            { wrapper }
        );

        await waitFor(() =>
            expect(result.current.isError).toBe(true)
        );

        expect(result.current.error).toBe(erro);
    });

    it("deve iniciar em loading", () => {
        getCargosDaComposicao.mockImplementation(
            () => new Promise(() => {})
        );

        const wrapper = createWrapper({
            composicaoUuid: "uuid-contexto",
        });

        const { result } = renderHook(
            () => useGetCargosDaComposicao(),
            { wrapper }
        );

        expect(result.current.isLoading).toBe(true);
    });
});