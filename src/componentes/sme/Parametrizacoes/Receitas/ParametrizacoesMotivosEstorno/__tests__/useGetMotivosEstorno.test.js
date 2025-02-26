import { renderHook, act, waitFor } from "@testing-library/react";
import { useGetMotivosEstorno } from "../hooks/useGetMotivosEstorno";
import { getMotivosEstorno } from "../../../../../../services/sme/Parametrizacoes.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotivosEstornoContext } from "../context/MotivosEstorno";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    getMotivosEstorno: jest.fn(),
}));

describe("useGetMotivosEstorno", () => {
    let queryClient;

    beforeEach(() => {
        queryClient = new QueryClient();
    });

    const renderCustomHook = (filterValue) => {
        return renderHook(() => useGetMotivosEstorno(), {
            wrapper: ({ children }) => (
                <QueryClientProvider client={queryClient}>
                    <MotivosEstornoContext.Provider value={{ filter: { motivo: filterValue } }}>
                        {children}
                    </MotivosEstornoContext.Provider>
                </QueryClientProvider>
            ),
        });
    };

    test("deve retornar dados corretamente quando a API retorna sucesso", async () => {
        const mockData = [{ id: 1, motivo: "Motivo de Estorno 1" }];
        getMotivosEstorno.mockResolvedValue(mockData);

        const { result } = renderCustomHook("Erro");

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.isError).toBe(false);
        expect(result.current.data).toEqual(mockData);
        expect(result.current.count).toBe(1);
    });

    test("deve lidar com erro da API corretamente", async () => {
        getMotivosEstorno.mockRejectedValue(new Error("Erro na API"));

        const { result } = renderCustomHook("Erro");

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.isError).toBe(true);
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.data).toEqual([]);
        expect(result.current.count).toBe(0);
    });

    test("deve refazer a requisição ao chamar `refetch`", async () => {
        const mockData = [{ id: 2, motivo: "Cancelamento" }];
        getMotivosEstorno.mockResolvedValue(mockData);

        const { result } = renderCustomHook("");

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.data).toEqual(mockData);

        getMotivosEstorno.mockResolvedValue([{ id: 3, motivo: "Nova tentativa" }]);

        act(() => {
            result.current.refetch();
        });

        await waitFor(() => expect(result.current.data).toEqual([{ id: 3, motivo: "Nova tentativa" }]));
    });
});
