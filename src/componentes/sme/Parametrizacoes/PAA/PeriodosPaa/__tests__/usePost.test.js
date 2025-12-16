import { act } from "react";
import { renderHook } from "@testing-library/react";
import { usePost } from "../hooks/usePost";
import { postPeriodosPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PeriodosPaaContext } from "../context/index";

// Mockando serviços externos
jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    postPeriodosPaa: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

const mockOnSuccess = jest.fn();
const mockOnError = jest.fn();

describe("usePost", () => {
    const queryClient = new QueryClient()

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <PeriodosPaaContext.Provider>
                {children}
            </PeriodosPaaContext.Provider>
        </QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve criar um período com sucesso", async () => {
        postPeriodosPaa.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePost({onSuccessPost: mockOnSuccess, onErrorPost: mockOnError}), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { referencia: "Novo Período" },
            });
        });

        expect(postPeriodosPaa).toHaveBeenCalledWith({ referencia: "Novo Período" });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Inclusão de Período do PAA", "Período registrado na lista com sucesso."
        );
        expect(mockOnSuccess).toHaveBeenCalled();
        expect(mockOnError).not.toHaveBeenCalled();
    });

    it("deve exibir erro quando já existe um período com o mesmo nome", async () => {
        postPeriodosPaa.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Já existe um período com esse nome" } },
        });

        const { result } = renderHook(() => usePost({onSuccessPost: mockOnSuccess, onErrorPost: mockOnError}), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { referencia: "Periodo Existente" },
            });
        });

        expect(postPeriodosPaa).toHaveBeenCalledWith({ referencia: "Periodo Existente" });
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao criar período",
            "Já existe um período com esse nome"
        );
        expect(mockOnSuccess).not.toHaveBeenCalled();
        expect(mockOnError).toHaveBeenCalled();
    });

    it("deve exibir mensagem genérica quando ocorre outro erro", async () => {
        postPeriodosPaa.mockRejectedValueOnce({
            response: { data: {} },
        });
    
        const { result } = renderHook(() => usePost({onSuccessPost: mockOnSuccess, onErrorPost: mockOnError}), { wrapper });
    
        await act(async () => {
            result.current.mutationPost.mutate({
                payload: { referencia: "Novo Período" },
            });
        });
    
        expect(postPeriodosPaa).toHaveBeenCalledWith({ referencia: "Novo Período" });
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro ao criar período", "Não foi possível criar o período"
        );
        expect(mockOnError).toHaveBeenCalled();
        expect(mockOnSuccess).not.toHaveBeenCalled();
    });
});
