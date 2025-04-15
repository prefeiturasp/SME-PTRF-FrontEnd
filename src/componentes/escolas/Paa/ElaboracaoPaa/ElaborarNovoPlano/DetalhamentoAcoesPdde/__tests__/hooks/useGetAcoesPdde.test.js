import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getAcoesPDDE } from "../../../../../../../../services/escolas/Paa.service";
import { useGetAcoesPdde } from "../../hooks/useGetAcoesPdde";

jest.mock("../../../../../../../../services/escolas/Paa.service");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useGetAcoesPdde", () => {
  const currentPage = 1;
  const rowsPerPage = 10;

  it("retorna dados com sucesso", async () => {
    const mockResponse = {"count": 1, "results": [{"acao": {"nome": "Ação Teste"}}]};

    getAcoesPDDE.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useGetAcoesPdde(currentPage, rowsPerPage), {
      wrapper: createWrapper(),
    });
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const { data, count, isLoading, isError } = result.current;

    expect(isError).toBe(false);
    expect(data).toEqual(mockResponse);
    expect(count).toBe(mockResponse.count);
  });

  it("deve retornar erro quando a API falhar", async () => {
    getAcoesPDDE.mockRejectedValueOnce(new Error("Erro na API"));

    const { result } = renderHook(() => useGetAcoesPdde(currentPage, rowsPerPage), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(true));

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
