import { act } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { useGetMandatoMaisRecente } from "../hooks/useGetMandatoMaisRecente";
import { getMandatoMaisRecente } from "../../../../services/Mandatos.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MandatosContext } from "../context/Mandatos";
import { count } from "console";


// Mockando serviços externos
jest.mock("../../../../services/Mandatos.service", () => ({
    getMandatoMaisRecente: jest.fn(),
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
        {children}
    </QueryClientProvider>
);

describe("useGetMandato", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve buscar os mandatos", async () => {
        getMandatoMaisRecente.mockResolvedValueOnce([]);

        const { result } = renderHook(() => useGetMandatoMaisRecente(), { wrapper });

        expect(getMandatoMaisRecente).toHaveBeenCalledTimes(1);
    });

    it("deve exibir mensagem de erro quando a API retorna uma mensagem de erro", async () => {
        getMandatoMaisRecente.mockRejectedValue(new Error("Erro na API"));
    
        const { result } = renderHook(() => useGetMandatoMaisRecente(), { wrapper });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual([]);
    });
});
