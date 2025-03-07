import { renderHook, waitFor } from "@testing-library/react";
import { getTodosPeriodos } from "../../../../../../services/sme/Parametrizacoes.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetPeriodos } from "../hooks/useGetPeriodos";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
  getTodosPeriodos: jest.fn(),
}));

const mokeFilters = { filtrar_por_referencia: '' }
const mockData = [
    {
        "uuid": "uuid-fake",
        "referencia": "2025.1",
        "data_inicio_realizacao_despesas": "2025-01-01",
        "data_fim_realizacao_despesas": "2025-04-30",
        "data_prevista_repasse": null,
        "data_inicio_prestacao_contas": "2025-05-01",
        "data_fim_prestacao_contas": "2025-05-10",
        "editavel": true,
        "periodo_anterior": {
            "uuid": "uuid-fake",
            "referencia": "2024.3",
            "data_inicio_realizacao_despesas": "2024-09-01",
            "data_fim_realizacao_despesas": "2024-12-31",
            "referencia_por_extenso": "3° repasse de 2024"
        }
    }
];
describe("useGetPeriodos", () => {
    const createWrapper = () => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                retry: false, // Evita retries automáticos nos testes
                },
            },
        });
        return ({ children }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );
    };
  
  it("deve começar carregando", () => {
    getTodosPeriodos.mockResolvedValueOnce([]);
    const { result } = renderHook(() => useGetPeriodos(mokeFilters), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);
  });

  it("deve retornar os dados corretamente após a requisição", async () => {
    getTodosPeriodos.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useGetPeriodos(mokeFilters), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockData);
    expect(result.current.count).toBe(1);
  });

  it("deve lidar com erro na requisição", async () => {
    getTodosPeriodos.mockRejectedValueOnce(new Error("Erro ao buscar períodos"));

    const { result } = renderHook(() => useGetPeriodos(mokeFilters), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.message).toBe("Erro ao buscar períodos");
  });

  it("deve permitir refetch manual", async () => {
    getTodosPeriodos.mockResolvedValueOnce([{ id: 1, nome: "Período 1" }]);

    const { result } = renderHook(() => useGetPeriodos(mokeFilters), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data.length).toBe(1);

    getTodosPeriodos.mockResolvedValueOnce([{ id: 1, nome: "Período 1" }, { id: 2, nome: "Período 2" }]);

    await result.current.refetch();

    await waitFor(() => expect(result.current.data.length).toBe(2));
  });
});
