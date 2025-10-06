import { act } from "react";
import { renderHook } from "@testing-library/react";
import { usePost } from "../hooks/usePost";
import { postObjetivosPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ObjetivosPaaContext } from "../context/index";

// Mockando serviços externos
jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    postObjetivosPaa: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("usePost", () => {
    const setShowModalForm = jest.fn();
    const queryClient = new QueryClient()

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <ObjetivosPaaContext.Provider value={{ setShowModalForm }}>
                {children}
            </ObjetivosPaaContext.Provider>
        </QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve criar um objetivo com sucesso", async () => {
        postObjetivosPaa.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePost(), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Novo objetivo" },
            });
        });

        expect(postObjetivosPaa).toHaveBeenCalledWith({ nome: "Novo objetivo" });
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Sucesso!",
            "Objetivo adicionado com sucesso."
        );
    });

    it("deve exibir erro quando já existe um objetivo com o mesmo nome", async () => {
        postObjetivosPaa.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Já existe um objetivo com esse nome" } },
        });

        const { result } = renderHook(() => usePost(), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Objetivo Existente" },
            });
        });

        expect(postObjetivosPaa).toHaveBeenCalledWith({ nome: "Objetivo Existente" });
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao criar objetivo",
            "Já existe um objetivo com esse nome"
        );
    });

    it("deve exibir mensagem genérica quando ocorre outro erro", async () => {
        postObjetivosPaa.mockRejectedValueOnce({
            response: { data: {} },
        });
    
        const { result } = renderHook(() => usePost(), { wrapper });
    
        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Novo objetivo" },
            });
        });
    
        expect(postObjetivosPaa).toHaveBeenCalledWith({ nome: "Novo objetivo" });
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro!",
            "Não foi possível criar o objetivo"
        );
    });
});
