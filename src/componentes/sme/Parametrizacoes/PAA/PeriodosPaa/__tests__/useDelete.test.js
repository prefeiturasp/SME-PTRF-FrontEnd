import { act } from "react";
import { renderHook } from "@testing-library/react";
import { useDelete } from "../hooks/useDelete";
import { deletePeriodosPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PeriodosPaaContext } from "../context/index";

// Mockando serviços externos
jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    deletePeriodosPaa: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("useDelete", () => {
    const setShowModalForm = jest.fn();
    const setBloquearBtnSalvarForm = jest.fn();
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false } // Desativa retry apenas para esse teste
        }
    })

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <PeriodosPaaContext.Provider value={{ setShowModalForm, setBloquearBtnSalvarForm }}>
                {children}
            </PeriodosPaaContext.Provider>
        </QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve deletar um motivo com sucesso", async () => {
        deletePeriodosPaa.mockResolvedValueOnce({});

        const { result } = renderHook(() => useDelete(), { wrapper });

        await act(async () => {
            await result.current.mutationDelete.mutateAsync("uuid-fake");
        });

        expect(deletePeriodosPaa).toHaveBeenCalledWith("uuid-fake");
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Remoção do período efetuada com sucesso.",
            "O período foi removido com sucesso."
        );
    });

    it("deve exibir mensagem de erro quando a API retorna uma mensagem de erro", async () => {
        deletePeriodosPaa.mockRejectedValueOnce({
            response: { data: { mensagem: "Erro ao deletar" } },
        });
        const { result } = renderHook(() => useDelete(), { wrapper });

        await act(async () => {
            result.current.mutationDelete.mutate("uuid-fake");
        });

        expect(deletePeriodosPaa).toHaveBeenCalledWith("uuid-fake");
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao remover período de PAA",
            "Erro ao deletar");
    });

    it("deve exibir mensagem de erro quando a API retorna um non_fields de erro", async () => {
        deletePeriodosPaa.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Erro ao deletar" } },
        });
        const { result } = renderHook(() => useDelete(), { wrapper });

        await act(async () => {
            result.current.mutationDelete.mutate("uuid-fake");
        });

        expect(deletePeriodosPaa).toHaveBeenCalledWith("uuid-fake");
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao remover período de PAA",
            "Erro ao deletar");
    });
    it("deve exibir mensagem de erro quando a API retorna outra prop de erro", async () => {
        deletePeriodosPaa.mockRejectedValueOnce({
            response: { data: { outra_prop: "Erro ao deletar" } },
        });
        const { result } = renderHook(() => useDelete(), { wrapper });

        await act(async () => {
            result.current.mutationDelete.mutate("uuid-fake");
        });

        expect(deletePeriodosPaa).toHaveBeenCalledWith("uuid-fake");
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao remover período de PAA",
            "Não foi possível excluir o período de PAA");
    });
});
