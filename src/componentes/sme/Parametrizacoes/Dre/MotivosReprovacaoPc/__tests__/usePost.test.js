import { act } from "react";
import { renderHook } from "@testing-library/react";
import { usePostMotivoReprovacaoPc } from "../hooks/usePostMotivoReprovacaoPc";
import { postMotivoReprovacaoPc } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotivosReprovacaoPcContext } from "../context/MotivosReprovacaoPc";

// Mockando serviços externos
jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    postMotivoReprovacaoPc: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("usePostMotivoReprovacaoPc", () => {
    const setShowModalForm = jest.fn();
    const handleCloseModalForm = jest.fn();
    const queryClient = new QueryClient()

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

    it("deve criar um motivo com sucesso", async () => {
        postMotivoReprovacaoPc.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePostMotivoReprovacaoPc(), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Novo Motivo" },
            });
        });

        expect(postMotivoReprovacaoPc).toHaveBeenCalledWith({ nome: "Novo Motivo" });
        expect(handleCloseModalForm).toHaveBeenCalled();
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Motivo de reprovação adicionado",
            "O motivo de reprovação de PC foi adicionado com sucesso."
        );
    });

    it("deve exibir erro quando já existe um motivo com o mesmo nome", async () => {
        postMotivoReprovacaoPc.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Já existe um motivo com esse nome" } },
        });

        const { result } = renderHook(() => usePostMotivoReprovacaoPc(), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Motivo Existente" },
            });
        });

        expect(postMotivoReprovacaoPc).toHaveBeenCalledWith({ nome: "Motivo Existente" });
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao adicionar o motivo de reprovação de PC",
            "Já existe um motivo com esse nome"
        );
    });

    it("deve exibir mensagem genérica quando ocorre outro erro", async () => {
        postMotivoReprovacaoPc.mockRejectedValueOnce({
            response: { data: {} },
        });
    
        const { result } = renderHook(() => usePostMotivoReprovacaoPc(), { wrapper });
    
        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Novo Motivo" },
            });
        });
    
        expect(postMotivoReprovacaoPc).toHaveBeenCalledWith({ nome: "Novo Motivo" });
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao adicionar o motivo de reprovação de PC",
            "Não foi possível adicionar o motivo de PC reprovada"
        );
    });
});
