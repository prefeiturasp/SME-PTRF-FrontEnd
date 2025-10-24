import { act } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { useGet } from "../hooks/useGet";
import { getAcoesPTRFPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AcoesPTRFPaaContext } from "../context/index";
import { mockData } from "../__fixtures__/mockData";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    getAcoesPTRFPaa: jest.fn(),
}));

const contexto = {
  patchingLoadingUUID: null,
  setPatchingLoadingUUID: jest.fn()
}

describe("useGet", () => {
    let queryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false }
            }
        })
    });

    const renderCustomHook = () => {
        return renderHook(() => useGet(), {
            wrapper: ({ children }) => (
                <QueryClientProvider client={queryClient}>
                    <AcoesPTRFPaaContext.Provider value={contexto}>
                        {children}
                    </AcoesPTRFPaaContext.Provider>
                </QueryClientProvider>
            ),
        });
    };

    test("deve retornar dados corretamente quando a API retorna sucesso", async () => {
        getAcoesPTRFPaa.mockResolvedValue(mockData);

        const { result } = renderCustomHook();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
            expect(result.current.isError).toBe(false);
            expect(result.current.data).toBe(mockData);
        });
    });

    test("deve lidar com erro da API corretamente", async () => {
        getAcoesPTRFPaa.mockRejectedValue(new Error("Erro na API"));

        const { result } = renderCustomHook("Erro");

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.data).toEqual([]);
    });

});
