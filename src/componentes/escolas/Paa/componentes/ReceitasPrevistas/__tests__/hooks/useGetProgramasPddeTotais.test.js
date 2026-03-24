import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getProgramasPddeTotais } from "../../../../../../../../services/escolas/Paa.service";
import { useGetProgramasPddeTotais } from "../../hooks/useGetProgramasPddeTotais";

jest.mock("../../../../../../../../services/escolas/Paa.service", () => ({
  getProgramasPddeTotais: jest.fn(),
}));

const mockResponse = {
  programas: [{ id: 1, nome: "Programa 1" }],
  total: { valorTotal: 1000 },
};

describe("useGetProgramasPddeTotais", () => {
  let queryClient;

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

  it("retorna dados corretamente após requisição bem-sucedida", async () => {
    getProgramasPddeTotais.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useGetProgramasPddeTotais(), {
      wrapper,
    });

    await waitFor(() =>
      expect(result.current.programas).toEqual(mockResponse.programas)
    );

    expect(result.current.isError).toBe(false);
    expect(result.current.total).toEqual(mockResponse.total);
  });

  it("chama getProgramasPddeTotais sem parâmetros", async () => {
    getProgramasPddeTotais.mockResolvedValueOnce(mockResponse);

    renderHook(() => useGetProgramasPddeTotais(), { wrapper });

    await waitFor(() => expect(getProgramasPddeTotais).toHaveBeenCalled());
    expect(getProgramasPddeTotais).toHaveBeenCalledWith();
  });

  it("retorna programas e total do response corretamente", async () => {
    getProgramasPddeTotais.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useGetProgramasPddeTotais(), {
      wrapper,
    });

    await waitFor(() =>
      expect(result.current.programas).toEqual(mockResponse.programas)
    );

    expect(result.current.total).toEqual(mockResponse.total);
  });

  it("retorna programas=[] e total={} no estado inicial (antes de resolver)", () => {
    getProgramasPddeTotais.mockReturnValue(new Promise(() => {})); // nunca resolve

    const { result } = renderHook(() => useGetProgramasPddeTotais(), {
      wrapper,
    });

    expect(result.current.programas).toEqual([]);
    expect(result.current.total).toEqual({});
  });

  it("retorna isError true quando a API falha", async () => {
    getProgramasPddeTotais.mockRejectedValueOnce(new Error("Erro na API"));

    const { result } = renderHook(() => useGetProgramasPddeTotais(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.programas).toEqual([]);
    expect(result.current.total).toEqual({});
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("retorna isLoading true enquanto a requisição está em andamento", async () => {
    let resolve;
    getProgramasPddeTotais.mockReturnValue(
      new Promise((res) => {
        resolve = res;
      })
    );

    const { result } = renderHook(() => useGetProgramasPddeTotais(), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(true);

    resolve(mockResponse);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it("expõe função refetch", async () => {
    getProgramasPddeTotais.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useGetProgramasPddeTotais(), {
      wrapper,
    });

    await waitFor(() =>
      expect(result.current.programas).toEqual(mockResponse.programas)
    );

    expect(typeof result.current.refetch).toBe("function");
  });
});
