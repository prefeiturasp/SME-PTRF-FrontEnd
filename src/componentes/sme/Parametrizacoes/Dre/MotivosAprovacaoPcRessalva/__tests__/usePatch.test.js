import { act } from "react";
import { renderHook } from "@testing-library/react";
import { usePatchMotivoAprovacaoPcRessalva } from "../hooks/usePatchMotivoAprovacaoPcRessalva";
import { patchMotivosAprovacaoPcRessalva } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotivosAprovacaoPcRessalvaContext } from "../context/MotivosAprovacaoPcRessalva";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    patchMotivosAprovacaoPcRessalva: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("usePatchMotivoAprovacaoPcRessalva", () => {
    const setShowModalForm = jest.fn();
    const queryClient =  new QueryClient()

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <MotivosAprovacaoPcRessalvaContext.Provider value={{ setShowModalForm }}>
                {children}
            </MotivosAprovacaoPcRessalvaContext.Provider>
        </QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve editar um motivo com sucesso", async () => {
        patchMotivosAprovacaoPcRessalva.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePatchMotivoAprovacaoPcRessalva(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                uuid: "uuid-fake",
                payload: { nome: "Novo Motivo" },
            });
        });

        expect(patchMotivosAprovacaoPcRessalva).toHaveBeenCalled();
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Edição do motivo de PC aprovada com ressalva realizada com sucesso",
            "O motivo de PC aprovada com ressalva foi editado com sucesso."
        );
    });

    it("deve exibir erro quando já existe um motivo com o mesmo nome", async () => {
        patchMotivosAprovacaoPcRessalva.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Já existe um motivo com esse nome" } },
        });

        const { result } = renderHook(() => usePatchMotivoAprovacaoPcRessalva(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                UUID: "uuid-fake",
                payload: { nome: "Motivo Existente" },
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao atualizar o motivo de PC aprovada com ressalva", 
            "Já existe um motivo com esse nome"
        );
    });

    it("deve exibir mensagem genérica quando ocorre outro erro", async () => {
        patchMotivosAprovacaoPcRessalva.mockRejectedValueOnce({
            response: { data: {} },
        });

        const { result } = renderHook(() => usePatchMotivoAprovacaoPcRessalva(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                UUID: "uuid-fake",
                payload: { nome: "Novo Motivo" },
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao atualizar o motivo de PC aprovada com ressalva",
            "Não foi possível atualizar o motivo de PC aprovada com ressalva"
        );
    });
});
