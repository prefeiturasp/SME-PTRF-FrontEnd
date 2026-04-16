import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePaaVigenteEAnteriores } from "../../hooks/usePaaVigenteEAnteriores";
import { getPaaVigenteEAnteriores } from "../../../../../../services/escolas/Paa.service";

jest.mock("../../../../../../services/escolas/Paa.service", () => ({
    getPaaVigenteEAnteriores: jest.fn(),
}));

describe("usePaaVigenteEAnteriores", () => {
    let queryClient;
    let wrapper;

    beforeEach(() => {
        jest.clearAllMocks();

        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false, gcTime: 0 },
            },
        });

        wrapper = ({ children }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );
    });

    describe("quando associacaoUuid não é fornecido", () => {
        it("não deve chamar getPaaVigenteEAnteriores", () => {
            renderHook(() => usePaaVigenteEAnteriores(undefined), { wrapper });
            expect(getPaaVigenteEAnteriores).not.toHaveBeenCalled();
        });

        it("não deve chamar getPaaVigenteEAnteriores com string vazia", () => {
            renderHook(() => usePaaVigenteEAnteriores(""), { wrapper });
            expect(getPaaVigenteEAnteriores).not.toHaveBeenCalled();
        });

        it("deve retornar data como objeto vazio por padrão", () => {
            const { result } = renderHook(() => usePaaVigenteEAnteriores(undefined), { wrapper });
            expect(result.current.data).toEqual({});
        });

        it("deve retornar isError como false", () => {
            const { result } = renderHook(() => usePaaVigenteEAnteriores(undefined), { wrapper });
            expect(result.current.isError).toBe(false);
        });

        it("deve expor refetch como função", () => {
            const { result } = renderHook(() => usePaaVigenteEAnteriores(undefined), { wrapper });
            expect(typeof result.current.refetch).toBe("function");
        });
    });

    describe("quando associacaoUuid é fornecido", () => {
        const uuid = "associacao-uuid-123";

        it("deve chamar getPaaVigenteEAnteriores com o uuid correto", async () => {
            getPaaVigenteEAnteriores.mockResolvedValueOnce({ vigente: {}, anteriores: [] });

            renderHook(() => usePaaVigenteEAnteriores(uuid), { wrapper });

            await waitFor(() => expect(getPaaVigenteEAnteriores).toHaveBeenCalledWith(uuid));
        });

        it("deve retornar os dados após consulta bem-sucedida", async () => {
            const mockData = { vigente: { uuid: "paa-uuid" }, anteriores: [] };
            getPaaVigenteEAnteriores.mockResolvedValueOnce(mockData);

            const { result } = renderHook(() => usePaaVigenteEAnteriores(uuid), { wrapper });

            await waitFor(() => expect(result.current.isLoading).toBe(false));

            expect(result.current.data).toEqual(mockData);
        });

        it("deve retornar isError como true quando a consulta falha", async () => {
            getPaaVigenteEAnteriores.mockRejectedValueOnce(new Error("Falha na API"));

            const { result } = renderHook(() => usePaaVigenteEAnteriores(uuid), { wrapper });

            await waitFor(() => expect(result.current.isError).toBe(true));
        });

        it("deve expor o objeto error quando a consulta falha", async () => {
            const mockError = new Error("Erro de rede");
            getPaaVigenteEAnteriores.mockRejectedValueOnce(mockError);

            const { result } = renderHook(() => usePaaVigenteEAnteriores(uuid), { wrapper });

            await waitFor(() => expect(result.current.isError).toBe(true));

            expect(result.current.error).toBeDefined();
        });

        it("deve deixar de carregar após sucesso", async () => {
            getPaaVigenteEAnteriores.mockResolvedValueOnce({});

            const { result } = renderHook(() => usePaaVigenteEAnteriores(uuid), { wrapper });

            await waitFor(() => expect(result.current.isLoading).toBe(false));
        });
    });
});
