import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getFiltrosTipoReceita } from "../../../../../../../services/sme/Parametrizacoes.service";
import { useGetFiltrosTiposReceita } from "../../hooks/useGetFiltrosTiposReceita";

jest.mock("../../../../../../../services/sme/Parametrizacoes.service", () => ({
    getFiltrosTipoReceita: jest.fn(),
}));

describe("useGetFiltrosTiposReceita", () => {
    let queryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
    });

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    it("deve retornar os dados corretamente quando a requisição for bem-sucedida", async () => {
        const mockData = {
            tipos_contas: ["Conta A", "Conta B"],
            tipos: ["Tipo 1", "Tipo 2"],
            aceita: ["Sim", "Não"],
            detalhes: ["Detalhe 1", "Detalhe 2"],
        };
        getFiltrosTipoReceita.mockResolvedValueOnce(mockData);

        const { result } = renderHook(() => useGetFiltrosTiposReceita(), { wrapper });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.data).toEqual(mockData);
        expect(result.current.isError).toBe(false);
    });

    it("deve lidar corretamente com erro na requisição", async () => {
        getFiltrosTipoReceita.mockRejectedValueOnce(new Error("Erro ao buscar filtros"));

        const { result } = renderHook(() => useGetFiltrosTiposReceita(), { wrapper });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.isError).toBe(true);
        expect(result.current.data).toEqual({
            tipos_contas: [],
            tipos: [],
            aceita: [],
            detalhes: [],
        });
    });
});
