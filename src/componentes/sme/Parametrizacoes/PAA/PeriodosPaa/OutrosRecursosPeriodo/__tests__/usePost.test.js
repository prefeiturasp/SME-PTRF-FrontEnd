import { act } from "react";
import { renderHook } from "@testing-library/react";
import { usePostOutroRecursoPeriodo } from "../hooks/usePost";
import { postOutroRecursoPeriodoPaa } from "../../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OutrosRecursosPeriodosPaaContext } from "../context/index";

// Mockando serviços externos
jest.mock("../../../../../../../services/sme/Parametrizacoes.service", () => ({
    postOutroRecursoPeriodoPaa: jest.fn(),
}));

jest.mock("../../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

const payload = { periodo_paa: "1111", outro_recurso: "2222" }

describe("usePostOutroRecursoPeriodo", () => {
    const queryClient = new QueryClient()

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <OutrosRecursosPeriodosPaaContext.Provider>
                {children}
            </OutrosRecursosPeriodosPaaContext.Provider>
        </QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve criar um Outro Recurso do período com sucesso", async () => {
        postOutroRecursoPeriodoPaa.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePostOutroRecursoPeriodo(), { wrapper });
        
        await act(async () => {
            result.current.mutate({ payload });
        });

        expect(postOutroRecursoPeriodoPaa).toHaveBeenCalledWith(payload);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Recurso habilitado no período."
        );
    });

    it("deve exibir erro quando já existe um OutroRecursoPeríodo com o mesmo período/OutroRecurso", async () => {
        postOutroRecursoPeriodoPaa.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Já existe um Recurso cadastrado para o período informado." } },
        });

        const { result } = renderHook(() => usePostOutroRecursoPeriodo(), { wrapper });

        await act(async () => {
            result.current.mutate({ payload });
        });

        expect(postOutroRecursoPeriodoPaa).toHaveBeenCalledWith(payload);
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro!",
            "Já existe um Recurso cadastrado para o período informado."
        );
    });

    it("deve exibir mensagem genérica quando ocorre retorno sem prop em response.data", async () => {
        postOutroRecursoPeriodoPaa.mockRejectedValueOnce({
            response: { data: {} },
        });
    
        const { result } = renderHook(() => usePostOutroRecursoPeriodo(), { wrapper });
    
        await act(async () => {
            result.current.mutate({ payload });
        });
    
        expect(postOutroRecursoPeriodoPaa).toHaveBeenCalledWith(payload);
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro!", "Falha ao habilitar recurso no período."
        );
    });

    it("deve exibir mensagem genérica quando ocorre retorno em prop response.data.detail", async () => {
        postOutroRecursoPeriodoPaa.mockRejectedValueOnce({
            response: { data: { detail : "Mensagem de Erro na prop detail"} },
        });
    
        const { result } = renderHook(() => usePostOutroRecursoPeriodo(), { wrapper });
    
        await act(async () => {
            result.current.mutate({ payload });
        });
    
        expect(postOutroRecursoPeriodoPaa).toHaveBeenCalledWith(payload);
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro!", "Mensagem de Erro na prop detail"
        );
    });

    it("deve exibir mensagem genérica quando ocorre retorno em prop response.data.mensagem", async () => {
        postOutroRecursoPeriodoPaa.mockRejectedValueOnce({
            response: { data: { mensagem : "Mensagem de Erro na prop mensagem"} },
        });
    
        const { result } = renderHook(() => usePostOutroRecursoPeriodo(), { wrapper });
    
        await act(async () => {
            result.current.mutate({ payload });
        });
    
        expect(postOutroRecursoPeriodoPaa).toHaveBeenCalledWith(payload);
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro!", "Mensagem de Erro na prop mensagem"
        );
    });

    it("deve exibir periodo_paa genérica quando ocorre retorno em prop response.data.periodo_paa", async () => {
        postOutroRecursoPeriodoPaa.mockRejectedValueOnce({
            response: { data: { periodo_paa : "Mensagem de Erro na prop periodo_paa"} },
        });
    
        const { result } = renderHook(() => usePostOutroRecursoPeriodo(), { wrapper });
    
        await act(async () => {
            result.current.mutate({ payload });
        });
    
        expect(postOutroRecursoPeriodoPaa).toHaveBeenCalledWith(payload);
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro!", "Mensagem de Erro na prop periodo_paa"
        );
    });

    it("deve exibir periodo_paa genérica quando ocorre retorno em prop response.data.outro_recurso", async () => {
        postOutroRecursoPeriodoPaa.mockRejectedValueOnce({
            response: { data: { outro_recurso : "Mensagem de Erro na prop outro_recurso"} },
        });
    
        const { result } = renderHook(() => usePostOutroRecursoPeriodo(), { wrapper });
    
        await act(async () => {
            result.current.mutate({ payload });
        });
    
        expect(postOutroRecursoPeriodoPaa).toHaveBeenCalledWith(payload);
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro!", "Mensagem de Erro na prop outro_recurso"
        );
    });

    it("deve exibir periodo_paa genérica quando ocorre retorno em prop response.data.non_field_errors", async () => {
        postOutroRecursoPeriodoPaa.mockRejectedValueOnce({
            response: { data: { non_field_errors : ["Mensagem de Erro na prop non_field_errors"]} },
        });
    
        const { result } = renderHook(() => usePostOutroRecursoPeriodo(), { wrapper });
    
        await act(async () => {
            result.current.mutate({ payload });
        });
    
        expect(postOutroRecursoPeriodoPaa).toHaveBeenCalledWith(payload);
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro!", ["Mensagem de Erro na prop non_field_errors"]
        );
    });
});
