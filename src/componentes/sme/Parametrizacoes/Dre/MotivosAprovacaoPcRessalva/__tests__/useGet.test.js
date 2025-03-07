import { act } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { useGetMotivosAprovacaoPcRessalva } from "../hooks/useGetMotivosAprovacaoPcRessalva";
import { getMotivosAprovacaoPcRessalva } from "../../../../../../services/sme/Parametrizacoes.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotivosAprovacaoPcRessalvaContext } from "../context/MotivosAprovacaoPcRessalva";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    getMotivosAprovacaoPcRessalva: jest.fn(),
}));

describe("useGetMotivosAprovacaoPcRessalva", () => {
    let queryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false } // Desativa retry apenas para esse teste
            }
        })
    });

    const renderCustomHook = (filterValue) => {
        return renderHook(() => useGetMotivosAprovacaoPcRessalva(), {
            wrapper: ({ children }) => (
                <QueryClientProvider client={queryClient}>
                    <MotivosAprovacaoPcRessalvaContext.Provider value={{ filter: { motivo: filterValue } }}>
                        {children}
                    </MotivosAprovacaoPcRessalvaContext.Provider>
                </QueryClientProvider>
            ),
        });
    };

    test("deve retornar dados corretamente quando a API retorna sucesso", async () => {
        const mockData = [{ id: 1, motivo: "Motivo 1", uuid: "123" }];
        getMotivosAprovacaoPcRessalva.mockResolvedValue({results: mockData, count: 1});

        const { result } = renderCustomHook();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
            expect(result.current.isError).toBe(false);
            expect(result.current.data.results).toBe(mockData);
            expect(result.current.count).toBe(1);
        });
    });

    test("deve lidar com erro da API corretamente", async () => {
        getMotivosAprovacaoPcRessalva.mockRejectedValue(new Error("Erro na API"));

        const { result } = renderCustomHook("Erro");

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.data).toEqual({count: 0, results: []});
        expect(result.current.count).toBe(0);
    });

});
