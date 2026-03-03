import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getAcoesPDDE } from "../../../../../../../../services/escolas/Paa.service";
import { useGetAcoesPdde } from "../../hooks/useGetAcoesPdde";

jest.mock("../../../../../../../../services/escolas/Paa.service", () => ({
  getAcoesPDDE: jest.fn(),
}));

const mockResponse = {
  count: 2,
  results: [
    { uuid: "uuid-1", acao: { nome: "Ação Teste 1" } },
    { uuid: "uuid-2", acao: { nome: "Ação Teste 2" } },
  ],
};

describe("useGetAcoesPdde", () => {
  let queryClient;
  const currentPage = 1;
  const rowsPerPage = 10;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("retorna os dados corretamente após requisição bem-sucedida", async () => {
    getAcoesPDDE.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(
      () => useGetAcoesPdde(currentPage, rowsPerPage),
      { wrapper }
    );

    await waitFor(() => expect(result.current.data).toEqual(mockResponse));

    expect(result.current.isError).toBe(false);
    expect(result.current.count).toBe(mockResponse.count);
  });

  it("chama getAcoesPDDE com os parâmetros de página e linhas por página", async () => {
    getAcoesPDDE.mockResolvedValueOnce(mockResponse);

    renderHook(() => useGetAcoesPdde(currentPage, rowsPerPage), { wrapper });

    await waitFor(() =>
      expect(getAcoesPDDE).toHaveBeenCalledWith(currentPage, rowsPerPage)
    );
  });

  it("retorna count do response corretamente", async () => {
    getAcoesPDDE.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(
      () => useGetAcoesPdde(currentPage, rowsPerPage),
      { wrapper }
    );

    await waitFor(() => expect(result.current.count).toBe(mockResponse.count));
  });

  it("retorna data como array vazio e count undefined no estado inicial", () => {
    getAcoesPDDE.mockReturnValue(new Promise(() => {})); // nunca resolve

    const { result } = renderHook(
      () => useGetAcoesPdde(currentPage, rowsPerPage),
      { wrapper }
    );

    expect(result.current.data).toEqual([]);
    expect(result.current.count).toBeUndefined();
  });

  it("retorna isError true e data vazio quando a API falha", async () => {
    getAcoesPDDE.mockRejectedValueOnce(new Error("Erro na API"));

    const { result } = renderHook(
      () => useGetAcoesPdde(currentPage, rowsPerPage),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("expõe função refetch", async () => {
    getAcoesPDDE.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(
      () => useGetAcoesPdde(currentPage, rowsPerPage),
      { wrapper }
    );

    await waitFor(() => expect(result.current.data).toEqual(mockResponse));

    expect(typeof result.current.refetch).toBe("function");
  });

  it("refetch recarrega os dados chamando o serviço novamente", async () => {
    const mockResponsePage2 = { count: 1, results: [{ uuid: "uuid-3" }] };
    getAcoesPDDE
      .mockResolvedValueOnce(mockResponse)
      .mockResolvedValueOnce(mockResponsePage2);

    const { result } = renderHook(
      () => useGetAcoesPdde(currentPage, rowsPerPage),
      { wrapper }
    );

    await waitFor(() => expect(result.current.data).toEqual(mockResponse));

    result.current.refetch();

    await waitFor(() =>
      expect(getAcoesPDDE).toHaveBeenCalledTimes(2)
    );
  });
});
