import { act } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { useGetTabelasPorAssociacao } from "../hooks/useGetTabelasPorAssociacao";
import { getTabelasRepassePorAssociacao } from "../../../../../../services/sme/Parametrizacoes.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RepassesContext } from "../context/Repasse";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    getTabelasRepassePorAssociacao: jest.fn(),
}));

describe("useGetTabelasPorAssociacao", () => {
    let queryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false }
            }
        })
    });

    const renderCustomHook = () => {
        return renderHook(() => useGetTabelasPorAssociacao(), {
            wrapper: ({ children }) => (
                <QueryClientProvider client={queryClient}>
                    <RepassesContext.Provider value={{stateFormModal: {associacao: 'test-id'}}}>
                        {children}
                    </RepassesContext.Provider>
                </QueryClientProvider>
            ),
        });
    };

    test("deve retornar dados corretamente quando a API retorna sucesso", async () => {
        const mockData = [{ id: 1, repasse: "Repasse 1" }];
        getTabelasRepassePorAssociacao.mockResolvedValue(mockData);

        const { result } = renderCustomHook();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
            expect(result.current.isError).toBe(false);
            expect(result.current.data).toEqual(mockData);
        });
    });

});
