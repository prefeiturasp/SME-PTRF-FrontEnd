import { act } from "react";
import { renderHook } from "@testing-library/react";
import { usePatch } from "../hooks/usePatch";
import { patchPeriodosPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PeriodosPaaContext } from "../context/index";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    patchPeriodosPaa: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("usePatch", () => {
    const setShowModalForm = jest.fn();
    const queryClient =  new QueryClient()

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <PeriodosPaaContext.Provider value={{ setShowModalForm }}>
                {children}
            </PeriodosPaaContext.Provider>
        </QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve editar um motivo com sucesso", async () => {
        patchPeriodosPaa.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePatch(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                uuid: "uuid-fake",
                payload: { referencia: "Novo Período" },
            });
        });

        expect(patchPeriodosPaa).toHaveBeenCalled();
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Edição do período realizada com sucesso."
        );
    });

    it("deve exibir erro quando já existe um periodo com o mesmo nome", async () => {
        patchPeriodosPaa.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Já existe um periodo com esse nome" } },
        });

        const { result } = renderHook(() => usePatch(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                UUID: "uuid-fake",
                payload: { referencia: "Periodo Existente" },
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao atualizar período", "Já existe um periodo com esse nome"
        );
    });

    it("deve exibir mensagem genérica quando ocorre outro erro", async () => {
        patchPeriodosPaa.mockRejectedValueOnce({
            response: { data: {} },
        });

        const { result } = renderHook(() => usePatch(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                uuid: "uuid-fake",
                payload: { referencia: "Novo Período" },
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao atualizar período",
            "Não foi possível atualizar o período"
        );
    });
});
