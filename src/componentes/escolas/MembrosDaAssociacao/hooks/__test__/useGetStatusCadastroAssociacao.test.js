import { renderHook, waitFor } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { useGetStatusCadastroAssociacao } from "../useGetStatusCadastroAssociacao";
import { getStatusCadastroAssociacao } from "../../../../../services/escolas/Associacao.service";

jest.mock("../../../../../services/escolas/Associacao.service", () => ({
    getStatusCadastroAssociacao: jest.fn(),
}));

describe("useGetStatusCadastroAssociacao", () => {
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

    it("deve retornar o status do cadastro da associação", async () => {
        const status = {
            completo: true,
            pendencias: [],
        };

        getStatusCadastroAssociacao.mockResolvedValue(status);

        const { result } = renderHook(
            () => useGetStatusCadastroAssociacao(),
            {
                wrapper: createWrapper(),
            }
        );

        await waitFor(() =>
            expect(result.current.data_status_cadastro_associacao).toEqual(status)
        );

        expect(getStatusCadastroAssociacao).toHaveBeenCalledTimes(1);
        expect(result.current.isError_status_cadastro_associacao).toBe(false);
    });

    it("deve retornar erro quando a consulta falhar", async () => {
        const erro = new Error("Erro na API");

        getStatusCadastroAssociacao.mockRejectedValue(erro);

        const { result } = renderHook(
            () => useGetStatusCadastroAssociacao(),
            {
                wrapper: createWrapper(),
            }
        );

        await waitFor(() =>
            expect(result.current.isError_status_cadastro_associacao).toBe(true)
        );

        expect(result.current.error_status_cadastro_associacao).toBe(erro);
    });

    it("deve iniciar em loading enquanto a consulta estiver pendente", () => {
        getStatusCadastroAssociacao.mockImplementation(
            () => new Promise(() => {})
        );

        const { result } = renderHook(
            () => useGetStatusCadastroAssociacao(),
            {
                wrapper: createWrapper(),
            }
        );

        expect(result.current.isLoading_status_cadastro_associacao).toBe(true);
        expect(result.current.data_status_cadastro_associacao).toBeUndefined();
        expect(result.current.isError_status_cadastro_associacao).toBe(false);
    });
});