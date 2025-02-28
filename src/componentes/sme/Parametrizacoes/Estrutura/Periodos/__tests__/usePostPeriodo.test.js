import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { postCriarPeriodo } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { usePostPeriodo } from "../hooks/usePostPeriodo";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    postCriarPeriodo: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("usePostPeriodo", () => {
    const setModalForm = jest.fn();
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false }, // Desativa retry apenas para esse teste
        },
    });

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve criar o período com sucesso", async () => {
        postCriarPeriodo.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePostPeriodo(setModalForm), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { referencia: "2025.1" },
            });
        });

        expect(postCriarPeriodo).toHaveBeenCalledWith({ referencia: "2025.1" });
        expect(setModalForm).toHaveBeenCalledWith({ open: false });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Inclusão de período realizado com sucesso.",
            "O período foi adicionado ao sistema com sucesso."
        );
    });

    it("deve exibir erro ao falhar na criação", async () => {
        postCriarPeriodo.mockRejectedValueOnce(new Error("Erro ao criar"));

        const { result } = renderHook(() => usePostPeriodo(setModalForm), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { referencia: "2025.1" },
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao criar período",
            "Não foi possível criar o período"
        );
    });
});
