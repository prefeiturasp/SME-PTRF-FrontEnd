import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDeleteBemProduzido } from "../../hooks/useDeleteBemProduzido";
import { deleteBemProduzido } from "../../../../../../services/escolas/BensProduzidos.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

jest.mock(
    "../../../../../../services/escolas/BensProduzidos.service",
    () => ({
        deleteBemProduzido: jest.fn(),
    })
);

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
            mutations: {
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

describe("useDeleteBemProduzido", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve chamar o serviço de exclusão com o uuid informado", async () => {
        deleteBemProduzido.mockResolvedValue({});

        const { result } = renderHook(() => useDeleteBemProduzido(), {
            wrapper: createWrapper(),
        });

        await result.current.mutationDelete.mutateAsync("uuid-123");

        expect(deleteBemProduzido).toHaveBeenCalledTimes(1);
        expect(deleteBemProduzido).toHaveBeenCalledWith("uuid-123");
    });

    it("deve exibir mensagem de sucesso quando a exclusão ocorrer com sucesso", async () => {
        deleteBemProduzido.mockResolvedValue({});

        const { result } = renderHook(() => useDeleteBemProduzido(), {
            wrapper: createWrapper(),
        });

        await result.current.mutationDelete.mutateAsync("uuid-123");

        await waitFor(() => {
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledTimes(1);
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                "Bem produzido deletado com sucesso."
            );
        });

        expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    });

    it("deve exibir mensagem de erro quando a exclusão falhar", async () => {
        deleteBemProduzido.mockRejectedValue(new Error("Erro"));

        const { result } = renderHook(() => useDeleteBemProduzido(), {
            wrapper: createWrapper(),
        });

        await expect(
            result.current.mutationDelete.mutateAsync("uuid-123")
        ).rejects.toThrow("Erro");

        await waitFor(() => {
            expect(toastCustom.ToastCustomError).toHaveBeenCalledTimes(1);
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Houve um erro ao excluir o bem produzido."
            );
        });

        expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
    });

    it("deve manter o estado de sucesso da mutation após concluir a exclusão", async () => {
        deleteBemProduzido.mockResolvedValue({});

        const { result } = renderHook(() => useDeleteBemProduzido(), {
            wrapper: createWrapper(),
        });

        await result.current.mutationDelete.mutateAsync("uuid-123");

        await waitFor(() => {
            expect(result.current.mutationDelete.isSuccess).toBe(true);
        });
    });

    it("deve manter o estado de erro da mutation quando a exclusão falhar", async () => {
        deleteBemProduzido.mockRejectedValue(new Error("Erro"));

        const { result } = renderHook(() => useDeleteBemProduzido(), {
            wrapper: createWrapper(),
        });

        await expect(
            result.current.mutationDelete.mutateAsync("uuid-123")
        ).rejects.toThrow();

        await waitFor(() => {
            expect(result.current.mutationDelete.isError).toBe(true);
        });
    });
});