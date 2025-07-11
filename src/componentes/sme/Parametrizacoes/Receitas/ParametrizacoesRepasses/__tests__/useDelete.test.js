import { act } from "react";
import { renderHook } from "@testing-library/react";
import { useDeleteRepasse } from "../hooks/useDeleteRepasse";
import { deleteRepasse } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RepassesContext } from "../context/Repasse";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    deleteRepasse: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("useDeleteRepasse", () => {
    const setShowModalForm = jest.fn();
    const setBloquearBtnSalvarForm = jest.fn()
    const queryClient = new QueryClient()

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <RepassesContext.Provider value={{ setShowModalForm, setBloquearBtnSalvarForm }}>
                {children}
            </RepassesContext.Provider>
        </QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve deletar um registro com sucesso", async () => {
        deleteRepasse.mockResolvedValue({data:{mensagem: "Não foi possível apagar o repasse"}});

        const { result } = renderHook(() => useDeleteRepasse(), { wrapper });

        await act(async () => {
            await result.current.mutationDelete.mutateAsync("uuid-fake");
        });

        expect(deleteRepasse).toHaveBeenCalledWith("uuid-fake");
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Exclusão do repasse realizada com sucesso",
            "O repasse foi excluído com sucesso."
        );
        expect(setBloquearBtnSalvarForm).toHaveBeenCalledWith(false)
    });

    it("deve exibir mensagem de erro quando a API retorna uma mensagem de erro (sem data.mensagem)", async () => {
        deleteRepasse.mockRejectedValueOnce({
            response: { data: { non_fields_errors: "Erro ao deletar" } },
        });
        const { result } = renderHook(() => useDeleteRepasse(), { wrapper });
    
        await act(async () => {
            result.current.mutationDelete.mutate("uuid-fake");
        });
    
        expect(deleteRepasse).toHaveBeenCalledWith("uuid-fake");
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Erro ao apagar o repasse", "Não foi possível apagar o repasse");
    });

    it("deve exibir mensagem de erro quando a API retorna uma mensagem de erro (com data.mensagem)", async () => {
        deleteRepasse.mockRejectedValueOnce({
            response: { data: { mensagem: "Erro ao deletar" } },
        });
        const { result } = renderHook(() => useDeleteRepasse(), { wrapper });
    
        await act(async () => {
            result.current.mutationDelete.mutate("uuid-fake");
        });
    
        expect(deleteRepasse).toHaveBeenCalledWith("uuid-fake");
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Erro ao apagar o repasse", "Erro ao deletar");
    });
});
