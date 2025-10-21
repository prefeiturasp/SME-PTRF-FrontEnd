import { act } from "react";
import { renderHook } from "@testing-library/react";
import { usePatch } from "../hooks/usePatch";
import { patchAtividadesEstatutarias } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AtividadesEstatutariasContext } from "../context/index";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    patchAtividadesEstatutarias: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("usePatch", () => {
    const setShowModalForm = jest.fn();
    const queryClient =  new QueryClient()

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

    it("deve editar uma atividade estatutária com sucesso", async () => {
        patchAtividadesEstatutarias.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePatch(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                uuid: "uuid-fake",
                payload: { nome: "Nova Atividade Estatutária" },
            });
        });

        expect(patchAtividadesEstatutarias).toHaveBeenCalled();
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Edição salva",
            "A edição foi salva com sucesso!"
        );
    });

    it("deve exibir erro quando já existe uma atividade estatutária com o mesmo nome", async () => {
        patchAtividadesEstatutarias.mockRejectedValueOnce({
            response: { data: { mensagem: "Já existe uma atividade estatutária com esse nome" } },
        });

        const { result } = renderHook(() => usePatch(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                UUID: "uuid-fake",
                payload: { nome: "Atividade Estatutária Existente" },
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro!", "Já existe uma atividade estatutária com esse nome"
        );
    });

    it("deve exibir mensagem genérica quando ocorre outro erro", async () => {
        patchAtividadesEstatutarias.mockRejectedValueOnce({
            response: { data: {erro: 'Mensagem prop erro'} },
        });

        const { result } = renderHook(() => usePatch(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                uuid: "uuid-fake",
                payload: { nome: "Nova Atividade Estatutária" },
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro!",
            "Não foi possível alterar atividade estatutária."
        );
    });
});
