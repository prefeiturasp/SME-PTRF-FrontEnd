import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetComissoes } from "../useGetComissoes";
import { getComissoes } from "../../../../../../../services/sme/Parametrizacoes.service";
import { ComissoesContext } from "../../context/Comissoes";

jest.mock("../../../../../../../services/sme/Parametrizacoes.service", () => ({
  getComissoes: jest.fn(),
}));

describe("useGetComissoes", () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const filter = { page: 1, page_size: 10, comissoes_uuid: [] };

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <ComissoesContext.Provider value={{ filter }}>
        {children}
      </ComissoesContext.Provider>
    </QueryClientProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it("busca comissões e expõe total/count", async () => {
    getComissoes.mockResolvedValueOnce({
      count: 2,
      results: [{ uuid: "c1" }, { uuid: "c2" }],
    });

    const { result } = renderHook(() => useGetComissoes(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(getComissoes).toHaveBeenCalledWith(filter, 1);
    expect(result.current.total).toBe(2);
    expect(result.current.count).toBe(2);
    expect(result.current.data.results).toHaveLength(2);
  });
});
