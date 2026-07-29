import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetStatusDelecaoBemProduzido } from "../../hooks/useGetStatusDelecaoBemProduzido";
import { getStatusDelecaoBemProduzido } from "../../../../../../services/escolas/BensProduzidos.service";

jest.mock("../../../../../../services/escolas/BensProduzidos.service", () => ({
  getStatusDelecaoBemProduzido: jest.fn(),
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe("useGetStatusDelecaoBemProduzido", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("não deve executar a query quando o uuid não for fornecido", async () => {
        const { result } = renderHook(() => useGetStatusDelecaoBemProduzido(undefined), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(result.current.data).toBeUndefined();
        expect(getStatusDelecaoBemProduzido).not.toHaveBeenCalled();
    });

    it("deve retornar os dados de sucesso quando a query for executada com uuid válido", async () => {
        const mockData = { deletavel: true };
        (getStatusDelecaoBemProduzido).mockResolvedValueOnce(mockData);

        const { result } = renderHook(() => useGetStatusDelecaoBemProduzido("123-abc"), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.data).toEqual(mockData);
        expect(result.current.isError).toBe(false);
        expect(getStatusDelecaoBemProduzido).toHaveBeenCalledWith("123-abc");
    });

    it("deve retornar o estado de erro quando a API falhar", async () => {
        const mockError = new Error("Erro ao buscar status");
        (getStatusDelecaoBemProduzido).mockRejectedValueOnce(mockError);

        const { result } = renderHook(() => useGetStatusDelecaoBemProduzido("123-abc"), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toEqual(mockError);
        expect(result.current.isLoading).toBe(false);
        expect(getStatusDelecaoBemProduzido).toHaveBeenCalledWith("123-abc");
    });

    it("deve permitir refazer a busca manualmente utilizando o refetch", async () => {
        const mockData = { deletavel: false };
        (getStatusDelecaoBemProduzido).mockResolvedValue(mockData);

        const { result } = renderHook(() => useGetStatusDelecaoBemProduzido("123-abc"), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(getStatusDelecaoBemProduzido).toHaveBeenCalledTimes(1);

        await result.current.refetch();

        expect(getStatusDelecaoBemProduzido).toHaveBeenCalledTimes(2);
    });
});