import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetMandatosVacancia } from "../useGetMandatosVacancia";
import { getMandatosVacancia } from "../../../../../services/MandatosVacancia.service";

jest.mock("../../../../../services/MandatosVacancia.service", () => ({
    getMandatosVacancia: jest.fn(),
}));

describe("useGetMandatosVacancia", () => {
    const createWrapper = () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });
        return ({ children }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve buscar os mandatos repassando referência e página", async () => {
        const resposta = { count: 1, results: [{ uuid: "mandato-1" }] };
        getMandatosVacancia.mockResolvedValue(resposta);

        const { result } = renderHook(() => useGetMandatosVacancia("2023 a 2025", 1), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.data).toEqual(resposta));

        expect(getMandatosVacancia).toHaveBeenCalledWith("2023 a 2025", 1);
        expect(result.current.isError).toBe(false);
    });

    it("deve usar o valor padrão (count 0, results vazio) enquanto a consulta estiver pendente", () => {
        getMandatosVacancia.mockImplementation(() => new Promise(() => {}));

        const { result } = renderHook(() => useGetMandatosVacancia(undefined, 1), {
            wrapper: createWrapper(),
        });

        expect(result.current.data).toEqual({ count: 0, results: [] });
        expect(result.current.isLoading).toBe(true);
    });

    it("deve retornar erro quando a consulta falhar", async () => {
        const erro = new Error("Erro na API");
        getMandatosVacancia.mockRejectedValue(erro);

        const { result } = renderHook(() => useGetMandatosVacancia(undefined, 1), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error).toBe(erro);
    });
});
