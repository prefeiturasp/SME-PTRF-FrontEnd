import { act } from "react";
import { renderHook } from "@testing-library/react";
import { useDeleteMotivoEstorno } from "../hooks/useDeleteMotivoEstorno";
import { deleteMotivoEstorno } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotivosEstornoContext } from "../context/MotivosEstorno";

// Mockando serviços externos
jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    deleteMotivoEstorno: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("useDeleteMotivoEstorno", () => {
    const setShowModalForm = jest.fn();
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false } // Desativa retry apenas para esse teste
        }
    })

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <MotivosEstornoContext.Provider value={{ setShowModalForm }}>
                {children}
            </MotivosEstornoContext.Provider>
        </QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve deletar um motivo de estorno com sucesso", async () => {
        deleteMotivoEstorno.mockResolvedValueOnce({});

        const { result } = renderHook(() => useDeleteMotivoEstorno(), { wrapper });

        await act(async () => {
            await result.current.mutationDelete.mutateAsync("uuid-fake");
        });

        expect(deleteMotivoEstorno).toHaveBeenCalledWith("uuid-fake");
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Remoção do motivo de estorno efetuado com sucesso.",
            "O motivo de estorno foi removido do sistema com sucesso."
        );
    });

    it("deve exibir mensagem de erro quando a API retorna uma mensagem de erro", async () => {
        deleteMotivoEstorno.mockRejectedValueOnce({
            response: { data: { mensagem: "Erro ao deletar" } },
        });
        const { result } = renderHook(() => useDeleteMotivoEstorno(), { wrapper });
    
        await act(async () => {
            result.current.mutationDelete.mutate("uuid-fake");
        });
    
        expect(deleteMotivoEstorno).toHaveBeenCalledWith("uuid-fake");
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Erro ao deletar");
    });
});
