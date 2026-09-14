import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAdicionarSuporte } from "../useAdicionarSuporte";
import { viabilizarAcessoSuporte } from "../../../../services/auth.service";
import { toastCustom } from "../../ToastCustom";

jest.mock("../../../../services/auth.service", () => ({
    viabilizarAcessoSuporte: jest.fn(),
}));

jest.mock("../../ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            mutations: { retry: false },
        },
    });
    return ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe("useAdicionarSuporte", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve chamar viabilizarAcessoSuporte com os parâmetros corretos", async () => {
        viabilizarAcessoSuporte.mockResolvedValue({ data: {} });

        const { result } = renderHook(() => useAdicionarSuporte(), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            result.current.mutationAdicionarSuporte.mutate({
                usuario: "user_teste",
                payload: { codigo_eol: "000123" },
            });
        });

        await waitFor(() =>
            expect(viabilizarAcessoSuporte).toHaveBeenCalledWith("user_teste", {
                codigo_eol: "000123",
            })
        );
    });

    it("deve chamar ToastCustomSuccess ao adicionar suporte com sucesso", async () => {
        viabilizarAcessoSuporte.mockResolvedValue({ data: {} });

        const { result } = renderHook(() => useAdicionarSuporte(), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            result.current.mutationAdicionarSuporte.mutate({
                usuario: "user_teste",
                payload: { codigo_eol: "000123" },
            });
        });

        await waitFor(() =>
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                "Suporte adicionado",
                "Unidade de suporte adicionada com sucesso."
            )
        );
    });

    it("deve chamar ToastCustomError com erro e mensagem específicos quando a API retorna esses campos", async () => {
        viabilizarAcessoSuporte.mockRejectedValue({
            response: { data: { erro: "Erro específico", mensagem: "Mensagem específica" } },
        });

        const { result } = renderHook(() => useAdicionarSuporte(), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            try {
                await result.current.mutationAdicionarSuporte.mutateAsync({
                    usuario: "user_teste",
                    payload: { codigo_eol: "000123" },
                });
            } catch {}
        });

        await waitFor(() =>
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro específico",
                "Mensagem específica"
            )
        );
    });

    it("deve chamar ToastCustomError genérico quando a API não retorna erro/mensagem", async () => {
        viabilizarAcessoSuporte.mockRejectedValue({
            response: { data: {} },
        });

        const { result } = renderHook(() => useAdicionarSuporte(), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            try {
                await result.current.mutationAdicionarSuporte.mutateAsync({
                    usuario: "user_teste",
                    payload: { codigo_eol: "000123" },
                });
            } catch {}
        });

        await waitFor(() =>
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Erro ao adicionar suporte.")
        );
    });

    it("deve chamar ToastCustomError genérico quando apenas erro está presente sem mensagem", async () => {
        viabilizarAcessoSuporte.mockRejectedValue({
            response: { data: { erro: "Erro específico" } },
        });

        const { result } = renderHook(() => useAdicionarSuporte(), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            try {
                await result.current.mutationAdicionarSuporte.mutateAsync({
                    usuario: "user_teste",
                    payload: { codigo_eol: "000123" },
                });
            } catch {}
        });

        await waitFor(() =>
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Erro ao adicionar suporte.")
        );
    });

    it("deve expor isPending como false inicialmente", () => {
        const { result } = renderHook(() => useAdicionarSuporte(), {
            wrapper: createWrapper(),
        });
        expect(result.current.mutationAdicionarSuporte.isPending).toBe(false);
    });

    it("deve retornar a mutation", () => {
        const { result } = renderHook(() => useAdicionarSuporte(), {
            wrapper: createWrapper(),
        });
        expect(result.current.mutationAdicionarSuporte).toBeDefined();
    });
});
