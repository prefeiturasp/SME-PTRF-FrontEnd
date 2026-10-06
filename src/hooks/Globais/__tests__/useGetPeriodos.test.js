import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetPeriodos } from "../useGetPeriodo";
import { getTodosPeriodos } from "../../../services/sme/Parametrizacoes.service";

jest.mock("../../../services/sme/Parametrizacoes.service", () => ({
  getTodosPeriodos: jest.fn(),
}));

const criarWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useGetPeriodos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve listar os períodos filtrados pela referência", async () => {
    getTodosPeriodos.mockResolvedValue([
      { uuid: "p1", referencia: "2026.1" },
      { uuid: "p2", referencia: "2026.2" },
    ]);

    const { result } = renderHook(
      () => useGetPeriodos({ filtrar_por_referencia: "2026" }),
      { wrapper: criarWrapper() }
    );

    await waitFor(() => expect(result.current.data).toHaveLength(2));
    expect(getTodosPeriodos).toHaveBeenCalledWith("2026");
    expect(result.current.count).toBe(2);
    expect(result.current.isError).toBe(false);
  });

  it("deve sinalizar erro quando a consulta de períodos falha", async () => {
    getTodosPeriodos.mockRejectedValue(new Error("falha"));

    const { result } = renderHook(
      () => useGetPeriodos({ filtrar_por_referencia: "2026" }),
      { wrapper: criarWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
