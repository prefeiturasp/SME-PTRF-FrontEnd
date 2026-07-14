import { renderHook, waitFor } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { useGetMandatoVigente } from "../useGetMandatoVigente";
import { getMandatoVigente } from "../../../../../services/Mandatos.service";
import { visoesService } from "../../../../../services/visoes.service";

jest.mock("../../../../../services/Mandatos.service", () => ({
    getMandatoVigente: jest.fn(),
}));

jest.mock("../../../../../services/visoes.service", () => ({
    visoesService: {
        getItemUsuarioLogado: jest.fn(),
    },
}));

describe("useGetMandatoVigente", () => {
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

    it("deve buscar o mandato vigente", async () => {
        const mandato = {
            uuid: "mandato-1",
            composicoes: [
                { uuid: "1" },
                { uuid: "2" },
            ],
        };

        getMandatoVigente.mockResolvedValue(mandato);

        const { result } = renderHook(
            () => useGetMandatoVigente(),
            {
                wrapper: createWrapper(),
            }
        );

        await waitFor(() =>
            expect(result.current.data).toEqual(mandato)
        );

        expect(visoesService.getItemUsuarioLogado).toHaveBeenCalledWith(
            "associacao_selecionada.uuid"
        );

        expect(getMandatoVigente).toHaveBeenCalledWith("associacao-123");
        expect(result.current.count).toBe(2);
        expect(result.current.isError).toBe(false);
    });

    it("deve retornar count igual a zero quando não houver composições", async () => {
        getMandatoVigente.mockResolvedValue({
            uuid: "mandato-1",
            composicoes: [],
        });

        const { result } = renderHook(
            () => useGetMandatoVigente(),
            {
                wrapper: createWrapper(),
            }
        );

        await waitFor(() =>
            expect(result.current.data.uuid).toBe("mandato-1")
        );

        expect(result.current.count).toBe(0);
    });

    it("deve retornar erro quando a consulta falhar", async () => {
        const erro = new Error("Erro na API");

        getMandatoVigente.mockRejectedValue(erro);

        const { result } = renderHook(
            () => useGetMandatoVigente(),
            {
                wrapper: createWrapper(),
            }
        );

        await waitFor(() =>
            expect(result.current.isError).toBe(true)
        );

        expect(result.current.error).toBe(erro);
    });

    it("deve utilizar o valor padrão enquanto a consulta estiver pendente", () => {
        getMandatoVigente.mockImplementation(
            () => new Promise(() => {})
        );

        const { result } = renderHook(
            () => useGetMandatoVigente(),
            {
                wrapper: createWrapper(),
            }
        );

        expect(result.current.data).toEqual({
            uuid: null,
            composicoes: [],
        });

        expect(result.current.count).toBe(0);
        expect(result.current.isLoading).toBe(true);
    });
});