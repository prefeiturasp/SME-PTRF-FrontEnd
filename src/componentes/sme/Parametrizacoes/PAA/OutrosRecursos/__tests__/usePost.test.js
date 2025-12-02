import { act } from "react";
import { renderHook } from "@testing-library/react";
import { usePost } from "../hooks/usePost";
import { postOutrosRecursos } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OutrosRecursosPaaContext } from "../context/index";

// Mockando serviços externos
jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    postOutrosRecursos: jest.fn(),
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
            <OutrosRecursosPaaContext.Provider value={{ setShowModalForm }}>
                {children}
            </OutrosRecursosPaaContext.Provider>
        </QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve criar um Recurso com sucesso", async () => {
        postOutrosRecursos.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePost(), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Novo Recurso" },
            });
        });

        expect(postOutrosRecursos).toHaveBeenCalledWith({ nome: "Novo Recurso" });
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Sucesso!",
            "Recurso adicionado com sucesso."
        );
    });

    it("deve exibir erro quando já existe um Recurso com o mesmo nome", async () => {
        postOutrosRecursos.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Já existe um Recurso com esse nome" } },
        });

        const { result } = renderHook(() => usePost(), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Recurso Existente" },
            });
        });

        expect(postOutrosRecursos).toHaveBeenCalledWith({ nome: "Recurso Existente" });
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao criar!",
            "Já existe um Recurso com esse nome"
        );
    });

    it("deve exibir mensagem genérica quando ocorre outro erro", async () => {
        postOutrosRecursos.mockRejectedValueOnce({
            response: { data: {} },
        });
    
        const { result } = renderHook(() => usePost(), { wrapper });
    
        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Novo Recurso" },
            });
        });
    
        expect(postOutrosRecursos).toHaveBeenCalledWith({ nome: "Novo Recurso" });
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao criar!",
            "Não foi possível criar o Recurso"
        );
    });
});
