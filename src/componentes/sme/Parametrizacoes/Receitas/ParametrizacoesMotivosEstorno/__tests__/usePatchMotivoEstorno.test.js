import { act } from "react";
import { renderHook } from "@testing-library/react";
import { usePatchMotivoEstorno } from "../hooks/usePatchMotivoEstorno";
import { patchAlterarMotivoEstorno } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotivosEstornoContext } from "../context/MotivosEstorno";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    patchAlterarMotivoEstorno: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("usePatchMotivoEstorno", () => {
    const setShowModalForm = jest.fn();
    const queryClient =  new QueryClient({
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

    it("deve editar um motivo de estorno com sucesso", async () => {
        patchAlterarMotivoEstorno.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePatchMotivoEstorno(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                UUID: "uuid-fake",
                payload: { nome: "Novo Motivo" },
            });
        });

        expect(patchAlterarMotivoEstorno).toHaveBeenCalledWith("uuid-fake", { nome: "Novo Motivo" });
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Edição do motivo de estorno realizado com sucesso.",
            "O motivo de estorno foi editado no sistema com sucesso."
        );
    });

    it("deve exibir erro quando já existe um motivo de estorno com o mesmo nome", async () => {
        patchAlterarMotivoEstorno.mockRejectedValueOnce({
            response: { data: { non_field_errors: ["Já existe um motivo de estorno com esse nome"] } },
        });

        const { result } = renderHook(() => usePatchMotivoEstorno(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                UUID: "uuid-fake",
                payload: { nome: "Motivo Existente" },
            });
        });

        expect(patchAlterarMotivoEstorno).toHaveBeenCalledWith("uuid-fake", { nome: "Motivo Existente" });
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Já existe um motivo de estorno com esse nome");
    });

    it("deve exibir mensagem genérica quando ocorre outro erro", async () => {
        patchAlterarMotivoEstorno.mockRejectedValueOnce({
            response: { data: {} },
        });

        const { result } = renderHook(() => usePatchMotivoEstorno(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                UUID: "uuid-fake",
                payload: { nome: "Novo Motivo" },
            });
        });

        expect(patchAlterarMotivoEstorno).toHaveBeenCalledWith("uuid-fake", { nome: "Novo Motivo" });
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Houve um erro ao tentar fazer essa atualização.");
    });
});
