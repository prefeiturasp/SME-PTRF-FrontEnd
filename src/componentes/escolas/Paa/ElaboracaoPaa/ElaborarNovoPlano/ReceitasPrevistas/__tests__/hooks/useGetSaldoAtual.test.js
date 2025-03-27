import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetSaldoAtual } from "../../hooks/useGetSaldoAtual";
import { getSaldoAtualPorAcaoAssociacao } from "../../../../../../../../services/escolas/Paa.service";

jest.mock("../../../../../../../../services/escolas/Paa.service");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Evita tentativas repetidas para erro
      },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useGetSaldoAtual", () => {
  it("deve retornar os dados corretamente quando a API retorna sucesso", async () => {
    const mockData = {
      saldo_atual_custeio: 0,
      saldo_atual_capital: 0,
      saldo_atual_livre: 0,
    };

    getSaldoAtualPorAcaoAssociacao.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useGetSaldoAtual("UUID-1234"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBe(false);
  });

  it("deve retornar erro quando a API falhar", async () => {
    getSaldoAtualPorAcaoAssociacao.mockRejectedValueOnce(
      new Error("Erro na API")
    );

    const { result } = renderHook(() => useGetSaldoAtual("UUID-1234"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
  });
});
