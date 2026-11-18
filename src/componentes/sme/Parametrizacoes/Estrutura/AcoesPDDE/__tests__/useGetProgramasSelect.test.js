import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getProgramasPDDESelect } from "../../../../../../services/sme/Parametrizacoes.service";
import { useGetProgramasSelect } from "../hooks/useGetProgramasSelect";
import { programasPDDE as mockProgramasPDDE } from "../__fixtures__/mockData";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    getProgramasPDDESelect: jest.fn(),
}));

describe("useGetProgramasSelect", () => {
    const createWrapper = () => {
        const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
        return ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };

    it("deve começar carregando", () => {
        getProgramasPDDESelect.mockResolvedValueOnce([]);
        const { result } = renderHook(() => useGetProgramasSelect(), { wrapper: createWrapper() });

        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toEqual([]);
    });

    it("deve retornar os programas cadastrados", async () => {
        getProgramasPDDESelect.mockResolvedValueOnce(mockProgramasPDDE);
        const { result } = renderHook(() => useGetProgramasSelect(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.data).toEqual(mockProgramasPDDE);
    });

    it("deve lidar com erro na requisição", async () => {
        getProgramasPDDESelect.mockRejectedValueOnce(new Error("Erro ao buscar programas pdde"));
        const { result } = renderHook(() => useGetProgramasSelect(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error.message).toBe("Erro ao buscar programas pdde");
    });
});
