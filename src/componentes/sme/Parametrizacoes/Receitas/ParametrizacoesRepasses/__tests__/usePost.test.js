import { act } from "react";
import { renderHook } from "@testing-library/react";
import { usePostRepasse } from "../hooks/usePostRepasse";
import { postRepasse } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RepassesContext } from "../context/Repasse";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    postRepasse: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("usePostRepasse", () => {
    const setShowModalForm = jest.fn();
    const queryClient = new QueryClient()

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <RepassesContext.Provider value={{ setShowModalForm }}>
                {children}
            </RepassesContext.Provider>
        </QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve criar um registro com sucesso", async () => {
        postRepasse.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePostRepasse(), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Novo Registro" },
            });
        });

        expect(postRepasse).toHaveBeenCalledWith({ nome: "Novo Registro" });
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Inclusão do repasse realizado com sucesso",
            "O repasse foi adicionado com sucesso."
        );
    });

    it("deve exibir erro quando já existe um registro com o mesmo nome", async () => {
        postRepasse.mockRejectedValueOnce({
            response: { data: { non_field_errors: ["Já existe um registro com esse nome"] } },
        });

        const { result } = renderHook(() => usePostRepasse(), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Registro Existente" },
            });
        });

        expect(postRepasse).toHaveBeenCalledWith({ nome: "Registro Existente" });
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Erro ao criar o repasse", "Não foi possível criar o repasse.");
    });

    it("deve exibir mensagem genérica quando ocorre outro erro", async () => {
        postRepasse.mockRejectedValueOnce({
            response: { data: {} },
        });
    
        const { result } = renderHook(() => usePostRepasse(), { wrapper });
    
        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Novo Registro" },
            });
        });
    
        expect(postRepasse).toHaveBeenCalledWith({ nome: "Novo Registro" });
        
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao criar o repasse",
            "Não foi possível criar o repasse."
        );
    });
});
