import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetMandatoMaisRecenteVacancia } from "../useGetMandatoMaisRecenteVacancia";
import { getMandatoMaisRecenteVacancia } from "../../../../../services/MandatosVacancia.service";

jest.mock("../../../../../services/MandatosVacancia.service", () => ({
    getMandatoMaisRecenteVacancia: jest.fn(),
}));

describe("useGetMandatoMaisRecenteVacancia", () => {
    const createWrapper = () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });
        return ({ children }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve buscar o mandato mais recente", async () => {
        const mandato = { uuid: "mandato-1", data_inicial_proximo_mandato: "2026-01-01" };
        getMandatoMaisRecenteVacancia.mockResolvedValue(mandato);

        const { result } = renderHook(() => useGetMandatoMaisRecenteVacancia(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.data).toEqual(mandato));
        expect(getMandatoMaisRecenteVacancia).toHaveBeenCalled();
    });

    it("deve retornar erro quando a consulta falhar", async () => {
        const erro = new Error("Erro na API");
        getMandatoMaisRecenteVacancia.mockRejectedValue(erro);

        const { result } = renderHook(() => useGetMandatoMaisRecenteVacancia(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error).toBe(erro);
    });
});
