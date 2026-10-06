import { renderHook, waitFor } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { useGetFiqueDeOlhoMembroAssociacao } from "../useGetFiqueDeOlhoMembroAssociacao";
import { getFiqueDeOlho } from "../../../../../services/FiqueDeOlho.service.js";
import { TEXTOS_FIQUE_DE_OLHO } from "../../../../../constantes/textosFiqueDeOlho.js";

jest.mock("../../../../../services/FiqueDeOlho.service.js", () => ({
    getFiqueDeOlho: jest.fn(),
}));

jest.mock("../../../../../context/RecursoSelecionado", () => ({
    useRecursoSelecionadoContext: jest.fn(),
}));

const { useRecursoSelecionadoContext } = require("../../../../../context/RecursoSelecionado");

describe("useGetFiqueDeOlhoMembroAssociacao", () => {
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

    it("deve buscar o fique de olho de histórico de membros usando o recurso selecionado", async () => {
        useRecursoSelecionadoContext.mockReturnValue({
            recursoSelecionado: { uuid: "recurso-1" },
        });

        const dados = { results: [{ texto: "<p>Atenção aos prazos.</p>" }] };
        getFiqueDeOlho.mockResolvedValue(dados);

        const { result } = renderHook(
            () => useGetFiqueDeOlhoMembroAssociacao(),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isFetching).toBe(false));

        expect(getFiqueDeOlho).toHaveBeenCalledWith(
            TEXTOS_FIQUE_DE_OLHO.UE_HISTORICO_MEMBROS,
            "recurso-1"
        );
        expect(result.current.data).toEqual(dados);
    });

    it("não deve disparar a busca quando não houver recurso selecionado", () => {
        useRecursoSelecionadoContext.mockReturnValue({
            recursoSelecionado: undefined,
        });

        const { result } = renderHook(
            () => useGetFiqueDeOlhoMembroAssociacao(),
            { wrapper: createWrapper() }
        );

        expect(getFiqueDeOlho).not.toHaveBeenCalled();
        expect(result.current.data).toEqual([]);
    });

    it("deve retornar erro quando a requisição falhar", async () => {
        useRecursoSelecionadoContext.mockReturnValue({
            recursoSelecionado: { uuid: "recurso-1" },
        });

        const erro = new Error("Erro na API");
        getFiqueDeOlho.mockRejectedValue(erro);

        const { result } = renderHook(
            () => useGetFiqueDeOlhoMembroAssociacao(),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toBe(erro);
    });

    it("deve iniciar buscando os dados quando houver recurso selecionado", () => {
        useRecursoSelecionadoContext.mockReturnValue({
            recursoSelecionado: { uuid: "recurso-1" },
        });

        getFiqueDeOlho.mockImplementation(() => new Promise(() => {}));

        const { result } = renderHook(
            () => useGetFiqueDeOlhoMembroAssociacao(),
            { wrapper: createWrapper() }
        );

        expect(result.current.isFetching).toBe(true);
    });
});
