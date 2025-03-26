import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { postAcoesPDDECategorias } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { usePostCategorias } from "../hooks/usePostCategorias";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    postAcoesPDDECategorias: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("usePostCategoria", () => {
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

    it("deve criar a categoria com sucesso", async () => {
        postAcoesPDDECategorias.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePostCategorias({ nome: "Categoria 1" }), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Categoria 1" },
            });
        });

        expect(postAcoesPDDECategorias).toHaveBeenCalledWith({ nome: "Categoria 1" });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Sucesso.",
            "Categoria de Ação PDDE criada com sucesso"
        );
    });

    it("deve exibir erro ao falhar na criação", async () => {
        postAcoesPDDECategorias.mockRejectedValueOnce(new Error("Erro ao criar"));

        const { result } = renderHook(() => usePostCategorias({ nome: "Categoria 1"} ), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Categoria 1" },
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Ops!",
            "Não foi possível criar a Categoria de Ação PDDE"
        );
    });

    it("deve exibir erro ao falhar na criação nome duplicado", async () => {
        postAcoesPDDECategorias.mockRejectedValueOnce({response: { data: { erro: "Duplicated" } }});

        const { result } = renderHook(() => usePostCategorias({ nome: "Categoria 1"} ), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Categoria 1" },
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Ops!",
            "Categoria já existe."
        );
    });
});
