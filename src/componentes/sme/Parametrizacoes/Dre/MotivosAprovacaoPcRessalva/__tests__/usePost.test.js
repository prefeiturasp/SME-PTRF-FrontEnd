import { act } from "react";
import { renderHook } from "@testing-library/react";
import { usePostMotivoAprovacaoPcRessalva } from "../hooks/usePostMotivoAprovacaoPcRessalva";
import { postMotivoAprovacaoPcRessalva } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotivosAprovacaoPcRessalvaContext } from "../context/MotivosAprovacaoPcRessalva";

// Mockando serviços externos
jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    postMotivoAprovacaoPcRessalva: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("usePostMotivoAprovacaoPcRessalva", () => {
    const setShowModalForm = jest.fn();
    const queryClient = new QueryClient()

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

    it("deve criar um motivo com sucesso", async () => {
        postMotivoAprovacaoPcRessalva.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePostMotivoAprovacaoPcRessalva(), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Novo Motivo" },
            });
        });

        expect(postMotivoAprovacaoPcRessalva).toHaveBeenCalledWith({ nome: "Novo Motivo" });
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Inclusão do motivo de PC aprovada com ressalva realizada com sucesso",
            "O motivo de PC aprovada com ressalva foi adicionado com sucesso."
        );
    });

    it("deve exibir erro quando já existe um motivo com o mesmo nome", async () => {
        postMotivoAprovacaoPcRessalva.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Já existe um motivo com esse nome" } },
        });

        const { result } = renderHook(() => usePostMotivoAprovacaoPcRessalva(), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Motivo Existente" },
            });
        });

        expect(postMotivoAprovacaoPcRessalva).toHaveBeenCalledWith({ nome: "Motivo Existente" });
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao criar o motivo de PC aprovada com ressalva",
            "Já existe um motivo com esse nome"
        );
    });

    it("deve exibir mensagem genérica quando ocorre outro erro", async () => {
        postMotivoAprovacaoPcRessalva.mockRejectedValueOnce({
            response: { data: {} },
        });
    
        const { result } = renderHook(() => usePostMotivoAprovacaoPcRessalva(), { wrapper });
    
        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Novo Motivo" },
            });
        });
    
        expect(postMotivoAprovacaoPcRessalva).toHaveBeenCalledWith({ nome: "Novo Motivo" });
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao criar o motivo de PC aprovada com ressalva",
            "Não foi possível criar o motivo de PC aprovada com ressalva"
        );
    });
});
