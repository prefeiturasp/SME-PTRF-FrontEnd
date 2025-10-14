import { act } from "react";
import { renderHook } from "@testing-library/react";
import { usePost } from "../hooks/usePost";
import { postAtividadesEstatutarias } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AtividadesEstatutariasContext } from "../context/index";

// Mockando serviços externos
jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    postAtividadesEstatutarias: jest.fn(),
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
            <AtividadesEstatutariasContext.Provider value={{ setShowModalForm }}>
                {children}
            </AtividadesEstatutariasContext.Provider>
        </QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve criar uma atividade estatutária com sucesso", async () => {
        postAtividadesEstatutarias.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePost(), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Nova atividade estatutária" },
            });
        });

        expect(postAtividadesEstatutarias).toHaveBeenCalledWith({ nome: "Nova atividade estatutária" });
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Sucesso!",
            "Atividade Estatutária adicionada com sucesso."
        );
    });

    it("deve exibir erro quando já existe uma atividade estatutária com o mesmo nome", async () => {
        postAtividadesEstatutarias.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Já existe uma atividade estatutária com esse nome" } },
        });

        const { result } = renderHook(() => usePost(), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Atividade Estatutária Existente" },
            });
        });

        expect(postAtividadesEstatutarias).toHaveBeenCalledWith({ nome: "Atividade Estatutária Existente" });
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao criar atividade estatutária",
            "Já existe uma atividade estatutária com esse nome"
        );
    });

    it("deve exibir mensagem genérica quando ocorre outro erro", async () => {
        postAtividadesEstatutarias.mockRejectedValueOnce({
            response: { data: {} },
        });
    
        const { result } = renderHook(() => usePost(), { wrapper });
    
        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { nome: "Nova atividade estatutária" },
            });
        });
    
        expect(postAtividadesEstatutarias).toHaveBeenCalledWith({ nome: "Nova atividade estatutária" });
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro!",
            "Não foi possível criar a atividade estatutária"
        );
    });
});
