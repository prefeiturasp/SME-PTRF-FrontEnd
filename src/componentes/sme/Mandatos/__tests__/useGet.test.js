import { act } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { useGetMandatos } from "../hooks/useGetMandatos";
import { getMandatos } from "../../../../services/Mandatos.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MandatosContext } from "../context/Mandatos";
import { count } from "console";


// Mockando serviços externos
jest.mock("../../../../services/Mandatos.service", () => ({
    getMandatos: jest.fn(),
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false } // Desativa retry apenas para esse teste
    }
})
const mockContextValue = {
    filter: {},
    currentPage: 1,
};

const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient} >
        <MandatosContext.Provider value={mockContextValue}>{children}</MandatosContext.Provider>
    </QueryClientProvider>
);

describe("useGetMandato", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve buscar os mandatos", async () => {
        getMandatos.mockResolvedValueOnce({results: [], count: 0});

        const { result } = renderHook(() => useGetMandatos(), { wrapper });

        expect(getMandatos).toHaveBeenCalledWith({}, 1);
    });

    it("deve exibir mensagem de erro quando a API retorna uma mensagem de erro", async () => {
        getMandatos.mockRejectedValue(new Error("Erro na API"));
    
        const { result } = renderHook(() => useGetMandatos(), { wrapper });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual({count: 0, results: []});
        expect(result.current.count).toBe(0);
    });
});
