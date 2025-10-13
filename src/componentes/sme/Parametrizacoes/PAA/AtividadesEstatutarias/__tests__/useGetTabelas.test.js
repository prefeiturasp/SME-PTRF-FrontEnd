import { act } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { useGetTabelas } from "../hooks/useGetTabelas";
import { getAtividadesEstatutariasTabelas } from "../../../../../../services/sme/Parametrizacoes.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AtividadesEstatutariasContext } from "../context/index";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    getAtividadesEstatutariasTabelas: jest.fn(),
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
                    <AtividadesEstatutariasContext.Provider value={{ filter: { nome: filterValue } }}>
                        {children}
                    </AtividadesEstatutariasContext.Provider>
                </QueryClientProvider>
            ),
        });
    };

    test("deve retornar dados corretamente quando a API retorna sucesso", async () => {
        
        getAtividadesEstatutariasTabelas.mockResolvedValue(mockData);

        const { result } = renderCustomHook();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
            expect(result.current.isError).toBe(false);
            expect(result.current.data).toBe(mockData);
        });
    });

    test("deve lidar com erro da API corretamente", async () => {
        getAtividadesEstatutariasTabelas.mockRejectedValue(new Error("Erro na API"));

        const { result } = renderCustomHook("Erro");

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.data).toEqual({});
    });

});
