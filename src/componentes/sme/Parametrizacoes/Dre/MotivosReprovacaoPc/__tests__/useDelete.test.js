import { act } from "react";
import { renderHook } from "@testing-library/react";
import { useDeleteMotivoReprovacaoPc } from "../hooks/useDeleteMotivoReprovacaoPc";
import { deleteMotivoReprovacaoPc } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotivosReprovacaoPcContext } from "../context/MotivosReprovacaoPc";

// Mockando serviços externos
jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    deleteMotivoReprovacaoPc: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("useDeleteMotivoReprovacaoPc", () => {
    const setShowModalForm = jest.fn();
    const setBloquearBtnSalvarForm = jest.fn();
    const handleCloseModalForm = jest.fn();
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false } // Desativa retry apenas para esse teste
        }
    })

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <MotivosReprovacaoPcContext.Provider value={{ setShowModalForm, setBloquearBtnSalvarForm, handleCloseModalForm }}>
                {children}
            </MotivosReprovacaoPcContext.Provider>
        </QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve deletar um motivo com sucesso", async () => {
        deleteMotivoReprovacaoPc.mockResolvedValueOnce({});

        const { result } = renderHook(() => useDeleteMotivoReprovacaoPc(), { wrapper });

        await act(async () => {
            await result.current.mutationDelete.mutateAsync("uuid-fake");
        });

        expect(deleteMotivoReprovacaoPc).toHaveBeenCalledWith("uuid-fake");
        expect(handleCloseModalForm).toHaveBeenCalled();
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Motivo de reprovação de PC excluído',
            'O motivo de reprovação de PC foi excluído com sucesso.'
        );
    });

    it("deve exibir mensagem de erro quando a API retorna uma mensagem de erro", async () => {
        deleteMotivoReprovacaoPc.mockRejectedValueOnce({
            response: { data: { mensagem: "Erro ao deletar" } },
        });
        const { result } = renderHook(() => useDeleteMotivoReprovacaoPc(), { wrapper });

        await act(async () => {
            result.current.mutationDelete.mutate("uuid-fake");
        });

        expect(deleteMotivoReprovacaoPc).toHaveBeenCalledWith("uuid-fake");
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao apagar o motivo de reprovação de PC',
            'Erro ao deletar');
    });
});
