import { act } from "react";
import { renderHook } from "@testing-library/react";
import { usePatch } from "../hooks/usePatch";
import { patchObjetivosPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ObjetivosPaaContext } from "../context/index";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    patchObjetivosPaa: jest.fn(),
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
            <ObjetivosPaaContext.Provider value={{ setShowModalForm }}>
                {children}
            </ObjetivosPaaContext.Provider>
        </QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve editar um objetivo com sucesso", async () => {
        patchObjetivosPaa.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePatch(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                uuid: "uuid-fake",
                payload: { nome: "Novo Objetivo" },
            });
        });

        expect(patchObjetivosPaa).toHaveBeenCalled();
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Edição salva",
            "A edição foi salva com sucesso!"
        );
    });

    it("deve exibir erro quando já existe um objetivo com o mesmo nome", async () => {
        patchObjetivosPaa.mockRejectedValueOnce({
            response: { data: { mensagem: "Já existe um objetivo com esse nome" } },
        });

        const { result } = renderHook(() => usePatch(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                UUID: "uuid-fake",
                payload: { nome: "Objetivo Existente" },
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro!", "Já existe um objetivo com esse nome"
        );
    });

    it("deve exibir mensagem genérica quando ocorre outro erro", async () => {
        patchObjetivosPaa.mockRejectedValueOnce({
            response: { data: {erro: 'Mensagem prop erro'} },
        });

        const { result } = renderHook(() => usePatch(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                uuid: "uuid-fake",
                payload: { nome: "Novo Objetivo" },
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro!",
            "Não foi possível alterar objetivo."
        );
    });
});
