import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { deleteAcoesPDDE } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { useDeleteAcao } from "../hooks/useDeleteAcaoPDDE";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    deleteAcoesPDDE: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("useDeleteAcaoPDDE", () => {
    let queryClient;
    let setModalForm, setErroExclusaoNaoPermitida, setShowModalInfoExclusaoNaoPermitida;

    queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false }, // Desativa retry apenas para esse teste
        },
    });
    setModalForm = jest.fn();
    setErroExclusaoNaoPermitida = jest.fn();
    setShowModalInfoExclusaoNaoPermitida = jest.fn();

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve remover a ação pdde com sucesso", async () => {
        deleteAcoesPDDE.mockResolvedValueOnce({});

        const { result } = renderHook(() => useDeleteAcao(setModalForm, setErroExclusaoNaoPermitida, setShowModalInfoExclusaoNaoPermitida), { wrapper });

        await act(async () => {
            result.current.mutationDelete.mutate({
                uuid: "4d272c66-0d2a-4f77-9979-6afeaec39332"
            });
        });

        expect(deleteAcoesPDDE).toHaveBeenCalledWith({uuid: "4d272c66-0d2a-4f77-9979-6afeaec39332"});
        expect(setModalForm).toHaveBeenCalledWith({ open: false });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Sucesso.", "A Ação PDDE foi removida do sistema com sucesso."
        );
    });

    it("deve exibir erro ao falhar na remoção", async () => {
        deleteAcoesPDDE.mockRejectedValue({response: { data: { detail: "Houve um erro ao tentar completar ação." } },});

        const { result } = renderHook(() => useDeleteAcao(setModalForm, setErroExclusaoNaoPermitida, setShowModalInfoExclusaoNaoPermitida), { wrapper });

        await act(async () => {
            result.current.mutationDelete.mutate("4d272c66-0d2a-4f77-9979-6afeaec39332");
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Ops!",
            "Houve um erro ao tentar completar ação."
        );
    });

    it("deve exibir erro ao falhar na remoção por estar associada a outro registro", async () => {
        deleteAcoesPDDE.mockRejectedValueOnce({response: { data: { mensagem: "Erro" } },});

        const { result } = renderHook(() => useDeleteAcao(setModalForm, setErroExclusaoNaoPermitida, setShowModalInfoExclusaoNaoPermitida), { wrapper });

        await act(async () => {
            result.current.mutationDelete.mutate({
                uuid: "4d272c66-0d2a-4f77-9979-6afeaec39332"
            });
        });
    });
});
