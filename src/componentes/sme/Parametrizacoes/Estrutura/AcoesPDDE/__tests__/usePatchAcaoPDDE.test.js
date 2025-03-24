import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { patchAcoesPDDE } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { usePatchAcaoPDDE } from "../hooks/usePatchAcaoPDDE";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    patchAcoesPDDE: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("usePatchtAcaoPDDE", () => {
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
        patchAcoesPDDE.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePatchAcaoPDDE(setModalForm), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                UUID: "4d272c66-0d2a-4f77-9979-6afeaec39332",
                payload: { nome: "Acao 1", categoria: 1 },
            });
        });

        expect(patchAcoesPDDE).toHaveBeenCalledWith("4d272c66-0d2a-4f77-9979-6afeaec39332", { nome: "Acao 1", categoria: 1 });
        expect(setModalForm).toHaveBeenCalledWith({ open: false });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Edição da Ação PDDE realizado com sucesso.'
        );
    });

    it("deve exibir erro ao falhar na criação", async () => {
        patchAcoesPDDE.mockRejectedValueOnce(new Error("Erro ao criar"));

        const { result } = renderHook(() => usePatchAcaoPDDE(setModalForm), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                UUID: "4d272c66-0d2a-4f77-9979-6afeaec39332",
                payload: { nome: "Acao 1", categoria: 1 },
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Ops!",
            "Não foi possível atualizar a Ação PDDE"
        );
    });
});
