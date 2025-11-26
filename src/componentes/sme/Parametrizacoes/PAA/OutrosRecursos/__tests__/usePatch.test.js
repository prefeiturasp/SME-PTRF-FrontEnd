import { act } from "react";
import { renderHook } from "@testing-library/react";
import { usePatch } from "../hooks/usePatch";
import { patchOutrosRecursos } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OutrosRecursosPaaContext } from "../context/index";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    patchOutrosRecursos: jest.fn(),
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
            <OutrosRecursosPaaContext.Provider value={{ setShowModalForm }}>
                {children}
            </OutrosRecursosPaaContext.Provider>
        </QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve editar um Recurso com sucesso", async () => {
        patchOutrosRecursos.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePatch(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                uuid: "uuid-fake",
                payload: { nome: "Novo Recurso" },
            });
        });

        expect(patchOutrosRecursos).toHaveBeenCalled();
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Edição salva",
            "A edição foi salva com sucesso!"
        );
    });

    it("deve exibir erro quando já existe um Recurso com o mesmo nome", async () => {
        patchOutrosRecursos.mockRejectedValueOnce({
            response: { data: { mensagem: "Já existe um Recurso com esse nome" } },
        });

        const { result } = renderHook(() => usePatch(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                UUID: "uuid-fake",
                payload: { nome: "Recurso Existente" },
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao alterar!", "Já existe um Recurso com esse nome"
        );
    });

    it("deve exibir mensagem genérica quando ocorre outro erro", async () => {
        patchOutrosRecursos.mockRejectedValueOnce({
            response: { data: {erro: 'Mensagem prop erro'} },
        });

        const { result } = renderHook(() => usePatch(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                uuid: "uuid-fake",
                payload: { nome: "Novo Recurso" },
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao alterar!",
            "Não foi possível alterar o Recurso."
        );
    });
});
