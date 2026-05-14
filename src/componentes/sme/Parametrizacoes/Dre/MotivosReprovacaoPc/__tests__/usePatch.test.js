import { act } from "react";
import { renderHook } from "@testing-library/react";
import { usePatchMotivoReprovacaoPc } from "../hooks/usePatchMotivoReprovacaoPc";
import { patchMotivosReprovacaoPc } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotivosReprovacaoPcContext } from "../context/MotivosReprovacaoPc";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    patchMotivosReprovacaoPc: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("usePatchMotivoReprovacaoPc", () => {
    const setShowModalForm = jest.fn();
    const handleCloseModalForm = jest.fn();
    const queryClient =  new QueryClient()

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <MotivosReprovacaoPcContext.Provider value={{ setShowModalForm, handleCloseModalForm }}>
                {children}
            </MotivosReprovacaoPcContext.Provider>
        </QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve editar um motivo com sucesso", async () => {
        patchMotivosReprovacaoPc.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePatchMotivoReprovacaoPc(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                uuidMotivoReprovacaoPc: "uuid-fake",
                payload: { motivo: "Novo Motivo" },
            });
        });

        expect(patchMotivosReprovacaoPc).toHaveBeenCalled();
        expect(handleCloseModalForm).toHaveBeenCalled();
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Motivo de reprovação de PC atualizada',
            'O motivo de reprovação de PC foi atualizada com sucesso.'
        );
    });

    it("deve exibir erro quando já existe um motivo com o mesmo nome", async () => {
        patchMotivosReprovacaoPc.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Já existe um motivo com esse nome" } },
        });

        const { result } = renderHook(() => usePatchMotivoReprovacaoPc(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                uuidMotivoReprovacaoPc: "uuid-fake",
                payload: { motivo: "Motivo Existente" },
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao atualizar o motivo de reprovação de PC',
            'Já existe um motivo com esse nome'
        );
    });

    it("deve exibir mensagem genérica quando ocorre outro erro", async () => {
        patchMotivosReprovacaoPc.mockRejectedValueOnce({
            response: { data: {} },
        });

        const { result } = renderHook(() => usePatchMotivoReprovacaoPc(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                uuidMotivoReprovacaoPc: "uuid-fake",
                payload: { motivo: "Novo Motivo" },
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao atualizar o motivo de reprovação de PC',
            'Não foi possível atualizar o motivo de reprovação de PC'
        );
    });
});
