import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getProgramasPDDE } from "../../../../../../services/sme/Parametrizacoes.service";
import { useGetProgramasPDDE } from "../hooks/useGetProgramasPDDE";
import { programasPDDE } from "../__fixtures__/mockData";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    getProgramasPDDE: jest.fn(),
}));

const createWrapper = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe("useGetProgramasPDDE", () => {
    beforeEach(() => jest.clearAllMocks());

    it("deve buscar os programas com filtro por nome e paginação", async () => {
        getProgramasPDDE.mockResolvedValueOnce(programasPDDE);

        const { result } = renderHook(
            () => useGetProgramasPDDE({ filtrar_por_nome: "Quali" }, 2, 20),
            { wrapper: createWrapper() }
        );

        expect(result.current.data).toEqual({ count: 0, results: [] });
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(getProgramasPDDE).toHaveBeenCalledWith({ nome: "Quali" }, 2, 20);
        expect(result.current.data).toEqual(programasPDDE);
    });

    it("deve lidar com erro na requisição", async () => {
        getProgramasPDDE.mockRejectedValueOnce(new Error("Erro ao buscar programas"));

        const { result } = renderHook(
            () => useGetProgramasPDDE({ filtrar_por_nome: "" }, 1, 20),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error.message).toBe("Erro ao buscar programas");
    });
});
