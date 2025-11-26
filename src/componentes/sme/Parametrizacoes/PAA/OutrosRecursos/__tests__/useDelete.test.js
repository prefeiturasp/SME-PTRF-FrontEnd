import { act } from "react";
import { renderHook } from "@testing-library/react";
import { useDelete } from "../hooks/useDelete";
import { deleteOutrosRecursos } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OutrosRecursosPaaContext } from "../context/index";

const mockOnSuccessDelete = jest.fn();
// Mockando serviços externos
jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    deleteOutrosRecursos: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("useDelete", () => {
    const setShowModalForm = jest.fn();
    const setBloquearBtnSalvarForm = jest.fn();
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false } // Desativa retry apenas para esse teste
        }
    })

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <OutrosRecursosPaaContext.Provider value={{ setShowModalForm, setBloquearBtnSalvarForm }}>
                {children}
            </OutrosRecursosPaaContext.Provider>
        </QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve excluir um Recurso com sucesso", async () => {
        deleteOutrosRecursos.mockResolvedValueOnce({});

        const { result } = renderHook(() => useDelete(mockOnSuccessDelete), { wrapper });

        await act(async () => {
            await result.current.mutationDelete.mutateAsync("uuid-fake");
        });

        expect(deleteOutrosRecursos).toHaveBeenCalledWith("uuid-fake");
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Sucesso!",
            "Recurso excluído com sucesso."
        );
    });

    it("deve exibir mensagem de erro quando a API retorna uma mensagem de erro", async () => {
        deleteOutrosRecursos.mockRejectedValueOnce({
            response: { data: { mensagem: "Mensagem de erro na prop mensagem" } },
        });
        const { result } = renderHook(() => useDelete(mockOnSuccessDelete), { wrapper });

        await act(async () => {
            result.current.mutationDelete.mutate("uuid-fake");
        });

        expect(deleteOutrosRecursos).toHaveBeenCalledWith("uuid-fake");
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro!",
            "Mensagem de erro na prop mensagem");
    });

    it("deve exibir mensagem de erro quando a API retorna um non_fields de erro", async () => {
        deleteOutrosRecursos.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Erro ao excluir" } },
        });
        const { result } = renderHook(() => useDelete(mockOnSuccessDelete), { wrapper });

        await act(async () => {
            result.current.mutationDelete.mutate("uuid-fake");
        });

        expect(deleteOutrosRecursos).toHaveBeenCalledWith("uuid-fake");
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro!",
            "Não foi possível excluir o Recurso.");
    });

    it("deve exibir mensagem de erro quando a API retorna sem prop data", async () => {
        deleteOutrosRecursos.mockRejectedValueOnce({
            response: {},
        });
        const { result } = renderHook(() => useDelete(mockOnSuccessDelete), { wrapper });

        await act(async () => {
            result.current.mutationDelete.mutate("uuid-fake");
        });

        expect(deleteOutrosRecursos).toHaveBeenCalledWith("uuid-fake");
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro!",
            "Não foi possível excluir o Recurso.");
    });

    it("deve exibir mensagem de erro quando a API retorna outra prop de erro", async () => {
        deleteOutrosRecursos.mockRejectedValueOnce({
            response: { data: { detail: "Mensagem de Erro na prop detail" } },
        });
        const { result } = renderHook(() => useDelete(mockOnSuccessDelete), { wrapper });

        await act(async () => {
            result.current.mutationDelete.mutate("uuid-fake");
        });

        expect(deleteOutrosRecursos).toHaveBeenCalledWith("uuid-fake");
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro!",
            "Mensagem de Erro na prop detail");
    });
});
