import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUnidadesEmSuporte } from "../useUnidadesEmSuporte";
import { getUnidadesEmSuporte } from "../../../../../../../services/auth.service";

jest.mock("../../../../../../../services/auth.service", () => ({
    getUnidadesEmSuporte: jest.fn(),
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
    return ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe("useUnidadesEmSuporte", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve chamar getUnidadesEmSuporte com usuario e page ao montar", async () => {
        getUnidadesEmSuporte.mockResolvedValue({ count: 0, results: [] });
        renderHook(() => useUnidadesEmSuporte("user_teste", 1), {
            wrapper: createWrapper(),
        });
        await waitFor(() => expect(getUnidadesEmSuporte).toHaveBeenCalledWith("user_teste", 1));
    });

    it("deve usar page=1 como padrão quando não informada", async () => {
        getUnidadesEmSuporte.mockResolvedValue({ count: 0, results: [] });
        renderHook(() => useUnidadesEmSuporte("user_teste"), {
            wrapper: createWrapper(),
        });
        await waitFor(() => expect(getUnidadesEmSuporte).toHaveBeenCalledWith("user_teste", 1));
    });

    it("deve retornar dados após sucesso", async () => {
        const mockData = { count: 2, results: [{ uuid: "1" }, { uuid: "2" }] };
        getUnidadesEmSuporte.mockResolvedValue(mockData);

        const { result } = renderHook(() => useUnidadesEmSuporte("user_teste", 1), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.data).toEqual(mockData);
        expect(result.current.count).toBe(2);
        expect(result.current.isError).toBe(false);
    });

    it("deve retornar isError=true quando a chamada falha", async () => {
        getUnidadesEmSuporte.mockRejectedValue(new Error("Erro de rede"));

        const { result } = renderHook(() => useUnidadesEmSuporte("user_teste", 1), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.data).toEqual({ count: 0, results: [] });
    });

    it("não deve executar a query quando usuario é falsy", async () => {
        const { result } = renderHook(() => useUnidadesEmSuporte("", 1), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(getUnidadesEmSuporte).not.toHaveBeenCalled();
    });

    it("deve retornar count=0 e results=[] como padrão antes dos dados chegarem", async () => {
        getUnidadesEmSuporte.mockResolvedValue({ count: 5, results: [] });

        const { result } = renderHook(() => useUnidadesEmSuporte("user_teste", 1), {
            wrapper: createWrapper(),
        });

        expect(result.current.count).toBe(0);
        expect(result.current.data).toEqual({ count: 0, results: [] });
    });

    it("deve chamar getUnidadesEmSuporte com a page informada", async () => {
        getUnidadesEmSuporte.mockResolvedValue({ count: 0, results: [] });
        renderHook(() => useUnidadesEmSuporte("user_teste", 3), {
            wrapper: createWrapper(),
        });
        await waitFor(() => expect(getUnidadesEmSuporte).toHaveBeenCalledWith("user_teste", 3));
    });

    it("deve expor a função refetch", async () => {
        getUnidadesEmSuporte.mockResolvedValue({ count: 0, results: [] });

        const { result } = renderHook(() => useUnidadesEmSuporte("user_teste", 1), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(typeof result.current.refetch).toBe("function");
    });
});
