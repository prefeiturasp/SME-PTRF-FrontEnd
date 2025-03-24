import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { patchAcoesPDDECategorias } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { usePatchCategorias } from "../hooks/usePatchCategorias";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    patchAcoesPDDECategorias: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("usePatchtCategorias", () => {
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

    it("deve criar a categoria da ação pdde com sucesso", async () => {
        patchAcoesPDDECategorias.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePatchCategorias(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                uuid: "4d272c66-0d2a-4f77-9979-6afeaec39332",
                payload: { nome: "Categoria 1" },
            });
        });

        expect(patchAcoesPDDECategorias).toHaveBeenCalledWith("4d272c66-0d2a-4f77-9979-6afeaec39332", { nome: "Categoria 1" });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Sucesso', 'Edição da Categoria de Ação PDDE realizada com sucesso'
        );
    });

    it("deve exibir erro ao falhar na criação", async () => {
        patchAcoesPDDECategorias.mockRejectedValueOnce(new Error("Erro ao criar"));

        const { result } = renderHook(() => usePatchCategorias(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                uuid: "4d272c66-0d2a-4f77-9979-6afeaec39332",
                payload: { nome: "Categoria 1" },
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Ops!",
            "Não foi possível atualizar a Categoria de Ação PDDE"
        );
    });
});
