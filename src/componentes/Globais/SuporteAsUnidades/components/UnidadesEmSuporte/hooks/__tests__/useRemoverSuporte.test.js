import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRemoverSuporte } from "../useRemoverSuporte";
import { encerrarAcessoSuporte, encerrarAcessoSuporteEmLote } from "../../../../../../../services/auth.service";
import { toastCustom } from "../../../../../ToastCustom";

jest.mock("../../../../../../../services/auth.service", () => ({
    encerrarAcessoSuporte: jest.fn(),
    encerrarAcessoSuporteEmLote: jest.fn(),
}));

jest.mock("../../../../../ToastCustom", () => ({
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

describe("useRemoverSuporte", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("mutationRemoverSuporte", () => {
        it("deve chamar encerrarAcessoSuporte com os parâmetros corretos", async () => {
            encerrarAcessoSuporte.mockResolvedValue({ data: { mensagem: "Removido" } });

            const { result } = renderHook(() => useRemoverSuporte(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                result.current.mutationRemoverSuporte.mutate({
                    usuario: "user_teste",
                    unidade_uuid: "uuid-123",
                });
            });

            await waitFor(() =>
                expect(encerrarAcessoSuporte).toHaveBeenCalledWith("user_teste", "uuid-123")
            );
        });

        it("deve chamar ToastCustomSuccess ao remover com sucesso", async () => {
            encerrarAcessoSuporte.mockResolvedValue({ data: { mensagem: "Suporte removido!" } });

            const { result } = renderHook(() => useRemoverSuporte(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                result.current.mutationRemoverSuporte.mutate({
                    usuario: "user_teste",
                    unidade_uuid: "uuid-abc",
                });
            });

            await waitFor(() =>
                expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith("Suporte removido!")
            );
        });

        it("deve chamar ToastCustomError ao falhar na remoção", async () => {
            encerrarAcessoSuporte.mockRejectedValue(new Error("Falha"));

            const { result } = renderHook(() => useRemoverSuporte(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                result.current.mutationRemoverSuporte.mutate({
                    usuario: "user_teste",
                    unidade_uuid: "uuid-abc",
                });
            });

            await waitFor(() =>
                expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Erro ao remover acesso")
            );
        });

        it("deve expor isPending como false inicialmente", () => {
            const { result } = renderHook(() => useRemoverSuporte(), {
                wrapper: createWrapper(),
            });
            expect(result.current.mutationRemoverSuporte.isPending).toBe(false);
        });
    });

    describe("mutationRemoverSuporteEmLote", () => {
        it("deve chamar encerrarAcessoSuporteEmLote com os parâmetros corretos", async () => {
            encerrarAcessoSuporteEmLote.mockResolvedValue({ data: { mensagem: "Lote removido" } });

            const { result } = renderHook(() => useRemoverSuporte(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                await result.current.mutationRemoverSuporteEmLote.mutateAsync({
                    usuario: "user_teste",
                    unidade_uuids: ["uuid-1", "uuid-2"],
                });
            });

            expect(encerrarAcessoSuporteEmLote).toHaveBeenCalledWith("user_teste", [
                "uuid-1",
                "uuid-2",
            ]);
        });

        it("deve chamar ToastCustomSuccess ao remover em lote com sucesso", async () => {
            encerrarAcessoSuporteEmLote.mockResolvedValue({ data: { mensagem: "Lote removido!" } });

            const { result } = renderHook(() => useRemoverSuporte(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                await result.current.mutationRemoverSuporteEmLote.mutateAsync({
                    usuario: "user_teste",
                    unidade_uuids: ["uuid-1"],
                });
            });

            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith("Lote removido!");
        });

        it("deve chamar ToastCustomError ao falhar na remoção em lote", async () => {
            encerrarAcessoSuporteEmLote.mockRejectedValue(new Error("Falha em lote"));

            const { result } = renderHook(() => useRemoverSuporte(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                try {
                    await result.current.mutationRemoverSuporteEmLote.mutateAsync({
                        usuario: "user_teste",
                        unidade_uuids: ["uuid-1"],
                    });
                } catch {}
            });

            await waitFor(() =>
                expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                    "Erro ao remover acesso em lote"
                )
            );
        });

        it("deve expor isPending como false inicialmente", () => {
            const { result } = renderHook(() => useRemoverSuporte(), {
                wrapper: createWrapper(),
            });
            expect(result.current.mutationRemoverSuporteEmLote.isPending).toBe(false);
        });
    });

    it("deve retornar ambas as mutations", () => {
        const { result } = renderHook(() => useRemoverSuporte(), {
            wrapper: createWrapper(),
        });

        expect(result.current.mutationRemoverSuporte).toBeDefined();
        expect(result.current.mutationRemoverSuporteEmLote).toBeDefined();
    });
});
