import { act } from "react";
import { renderHook } from "@testing-library/react";
import { usePostMotivoEstorno } from "../hooks/usePostMotivoEstorno";
import { postCreateMotivoEstorno } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotivosEstornoContext } from "../context/MotivosEstorno";

// Mockando serviços externos
jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    postCreateMotivoEstorno: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("usePostMotivoEstorno", () => {
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

    it("deve criar um motivo de estorno com sucesso", async () => {
        postCreateMotivoEstorno.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePostMotivoEstorno(), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Novo Motivo" },
            });
        });

        expect(postCreateMotivoEstorno).toHaveBeenCalledWith({ nome: "Novo Motivo" });
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Inclusão de motivo de estorno realizado com sucesso.",
            "O motivo do estorno foi adicionado ao sistema com sucesso."
        );
    });

    it("deve exibir erro quando já existe um motivo de estorno com o mesmo nome", async () => {
        postCreateMotivoEstorno.mockRejectedValueOnce({
            response: { data: { non_field_errors: ["Já existe um motivo de estorno com esse nome"] } },
        });

        const { result } = renderHook(() => usePostMotivoEstorno(), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Motivo Existente" },
            });
        });

        expect(postCreateMotivoEstorno).toHaveBeenCalledWith({ nome: "Motivo Existente" });
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Já existe um motivo de estorno com esse nome");
    });

    it("deve exibir mensagem genérica quando ocorre outro erro", async () => {
        postCreateMotivoEstorno.mockRejectedValueOnce({
            response: { data: {} },
        });
    
        const { result } = renderHook(() => usePostMotivoEstorno(), { wrapper });
    
        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Novo Motivo" },
            });
        });
    
        expect(postCreateMotivoEstorno).toHaveBeenCalledWith({ nome: "Novo Motivo" });
        
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Houve um erro ao tentar fazer essa atualização.");
    });
});
