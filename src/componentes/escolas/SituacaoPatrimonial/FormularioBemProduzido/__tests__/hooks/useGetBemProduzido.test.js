import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetBemProduzido } from "../../hooks/useGetBemProduzido";
import { getBemProduzido } from "../../../../../../services/escolas/BensProduzidos.service";

jest.mock("../../../../../../services/escolas/BensProduzidos.service");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useGetBemProduzido", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar dados quando a query for bem-sucedida", async () => {
    const mockData = { id: 1, nome: "Bem Produzido Teste" };
    getBemProduzido.mockResolvedValue(mockData);

    const { result } = renderHook(() => useGetBemProduzido("test-uuid"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockData);
    });
  });
});
