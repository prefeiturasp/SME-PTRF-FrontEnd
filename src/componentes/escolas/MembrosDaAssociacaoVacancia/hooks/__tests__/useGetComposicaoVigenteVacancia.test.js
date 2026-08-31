import { renderHook, waitFor } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { useGetComposicaoVigenteVacancia } from "../useGetComposicaoVigenteVacancia";
import { getComposicaoVigenteVacancia } from "../../../../../services/MandatosVacancia.service";
import { visoesService } from "../../../../../services/visoes.service";

jest.mock("../../../../../services/MandatosVacancia.service", () => ({
    getComposicaoVigenteVacancia: jest.fn(),
}));

jest.mock("../../../../../services/visoes.service", () => ({
    visoesService: {
        getItemUsuarioLogado: jest.fn(),
    },
}));

describe("useGetComposicaoVigenteVacancia", () => {
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

        visoesService.getItemUsuarioLogado.mockReturnValue("associacao-123");
    });

    it("deve buscar a composição vigente quando mandato_uuid é informado", async () => {
        const composicao = { uuid: "composicao-1" };

        getComposicaoVigenteVacancia.mockResolvedValue(composicao);

        const { result } = renderHook(
            () => useGetComposicaoVigenteVacancia("mandato-1"),
            { wrapper: createWrapper() }
        );

        await waitFor(() =>
            expect(result.current.data).toEqual(composicao)
        );

        expect(visoesService.getItemUsuarioLogado).toHaveBeenCalledWith(
            "associacao_selecionada.uuid"
        );

        expect(getComposicaoVigenteVacancia).toHaveBeenCalledWith(
            "associacao-123", "mandato-1"
        );
        expect(result.current.isError).toBe(false);
    });

    it("não deve disparar a busca quando mandato_uuid não é informado", () => {
        renderHook(
            () => useGetComposicaoVigenteVacancia(undefined),
            { wrapper: createWrapper() }
        );

        expect(getComposicaoVigenteVacancia).not.toHaveBeenCalled();
    });

    it("deve retornar erro quando a consulta falhar", async () => {
        const erro = new Error("Erro na API");

        getComposicaoVigenteVacancia.mockRejectedValue(erro);

        const { result } = renderHook(
            () => useGetComposicaoVigenteVacancia("mandato-1"),
            { wrapper: createWrapper() }
        );

        await waitFor(() =>
            expect(result.current.isError).toBe(true)
        );

        expect(result.current.error).toBe(erro);
    });

    it("deve utilizar o valor padrão enquanto a consulta estiver pendente", () => {
        getComposicaoVigenteVacancia.mockImplementation(
            () => new Promise(() => {})
        );

        const { result } = renderHook(
            () => useGetComposicaoVigenteVacancia("mandato-1"),
            { wrapper: createWrapper() }
        );

        expect(result.current.data).toEqual({ uuid: null });
        expect(result.current.isLoading).toBe(true);
    });
});
