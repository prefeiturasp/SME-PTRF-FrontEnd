import { act } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { useGetTabelas } from "../hooks/useGetTabelas";
import { getObjetivosTabelasPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ObjetivosPaaContext } from "../context/index";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    getObjetivosTabelasPaa: jest.fn(),
}));

const mockData = {
    status:[
        {key: 1,value: "Ativo"},
        {key: 0, value: "Inativo"}
    ]
}

describe("useGetTabelas", () => {
    let queryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false }
            }
        })
    });

    const renderCustomHook = (filterValue) => {
        return renderHook(() => useGetTabelas(), {
            wrapper: ({ children }) => (
                <QueryClientProvider client={queryClient}>
                    <ObjetivosPaaContext.Provider value={{ filter: { nome: filterValue } }}>
                        {children}
                    </ObjetivosPaaContext.Provider>
                </QueryClientProvider>
            ),
        });
    };

    test("deve retornar dados corretamente quando a API retorna sucesso", async () => {
        
        getObjetivosTabelasPaa.mockResolvedValue(mockData);

        const { result } = renderCustomHook();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
            expect(result.current.isError).toBe(false);
            expect(result.current.data).toBe(mockData);
        });
    });

    test("deve lidar com erro da API corretamente", async () => {
        getObjetivosTabelasPaa.mockRejectedValue(new Error("Erro na API"));

        const { result } = renderCustomHook("Erro");

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.data).toEqual({});
    });

});
