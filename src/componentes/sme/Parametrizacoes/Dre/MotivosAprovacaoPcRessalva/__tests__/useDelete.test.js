import { act } from "react";
import { renderHook } from "@testing-library/react";
import { useDeleteMotivoAprovacaoPcRessalva } from "../hooks/useDeleteMotivoAprovacaoPcRessalva";
import { deleteMotivoAprovacaoPcRessalva } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotivosAprovacaoPcRessalvaContext } from "../context/MotivosAprovacaoPcRessalva";

// Mockando serviços externos
jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    deleteMotivoAprovacaoPcRessalva: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("useDeleteMotivoAprovacaoPcRessalva", () => {
    const setShowModalForm = jest.fn();
    const setBloquearBtnSalvarForm = jest.fn();
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false } // Desativa retry apenas para esse teste
        }
    })

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <MotivosAprovacaoPcRessalvaContext.Provider value={{ setShowModalForm, setBloquearBtnSalvarForm }}>
                {children}
            </MotivosAprovacaoPcRessalvaContext.Provider>
        </QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve deletar um motivo com sucesso", async () => {
        deleteMotivoAprovacaoPcRessalva.mockResolvedValueOnce({});

        const { result } = renderHook(() => useDeleteMotivoAprovacaoPcRessalva(), { wrapper });

        await act(async () => {
            await result.current.mutationDelete.mutateAsync("uuid-fake");
        });

        expect(deleteMotivoAprovacaoPcRessalva).toHaveBeenCalledWith("uuid-fake");
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Exclusão do motivo de PC aprovada com ressalva realizada com sucesso",
            "O motivo de PC aprovada com ressalva foi excluído com sucesso."
        );
    });

    it("deve exibir mensagem de erro quando a API retorna uma mensagem de erro", async () => {
        deleteMotivoAprovacaoPcRessalva.mockRejectedValueOnce({
            response: { data: { mensagem: "Erro ao deletar" } },
        });
        const { result } = renderHook(() => useDeleteMotivoAprovacaoPcRessalva(), { wrapper });

        await act(async () => {
            result.current.mutationDelete.mutate("uuid-fake");
        });

        expect(deleteMotivoAprovacaoPcRessalva).toHaveBeenCalledWith("uuid-fake");
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao apagar o motivo de PC aprovada com ressalva",
            "Erro ao deletar");
    });
});
