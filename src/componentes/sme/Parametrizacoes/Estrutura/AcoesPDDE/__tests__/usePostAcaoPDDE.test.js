import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { postAcoesPDDE } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { usePostAcaoPDDE } from "../hooks/usePostAcaoPDDE";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    postAcoesPDDE: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("usePostAcaoPDDE", () => {
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

    it("deve criar a açõa pdde com sucesso", async () => {
        postAcoesPDDE.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePostAcaoPDDE(setModalForm), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Acao 1", categoria: 1 },
            });
        });

        expect(postAcoesPDDE).toHaveBeenCalledWith({ nome: "Acao 1", categoria: 1 });
        expect(setModalForm).toHaveBeenCalledWith({ open: false });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Sucesso.",
            "A Ação PDDE foi adicionada ao sistema com sucesso."
        );
    });

    it("deve exibir erro ao falhar na criação", async () => {
        postAcoesPDDE.mockRejectedValueOnce(new Error("Erro ao criar"));

        const { result } = renderHook(() => usePostAcaoPDDE(setModalForm), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Acao 1", categoria: 1 },
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Ops!",
            "Não foi possível criar a Ação PDDE"
        );
    });
});
