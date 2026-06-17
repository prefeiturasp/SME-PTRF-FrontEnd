import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getPlanoOrcamentario } from "../../../../../../../../../services/escolas/Paa.service";
import { useGetPlanoOrcamentario } from "../useGetPlanoOrcamentario";

jest.mock("../../../../../../../../../services/escolas/Paa.service", () => ({
  getPlanoOrcamentario: jest.fn(),
}));

const mockResponse = {
  uuid: "paa-uuid-1",
  atividades: [{ uuid: "ativ-1", nome: "Atividade Teste" }],
};

describe("useGetPlanoOrcamentario", () => {
  let queryClient;
  const paaUuid = "paa-uuid-1";

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
    getPlanoOrcamentario.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useGetPlanoOrcamentario(paaUuid), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).toEqual(mockResponse));

    expect(result.current.isError).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it("chama getPlanoOrcamentario com o paaUuid correto", async () => {
    getPlanoOrcamentario.mockResolvedValueOnce(mockResponse);

    renderHook(() => useGetPlanoOrcamentario(paaUuid), { wrapper });

    await waitFor(() =>
      expect(getPlanoOrcamentario).toHaveBeenCalledWith(paaUuid)
    );
  });

  it("retorna data como objeto vazio no estado inicial", () => {
    getPlanoOrcamentario.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useGetPlanoOrcamentario(paaUuid), {
      wrapper,
    });

    expect(result.current.data).toEqual({});
  });

  it("retorna isLoading true enquanto a requisição está em andamento", () => {
    getPlanoOrcamentario.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useGetPlanoOrcamentario(paaUuid), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(true);
  });

  it("retorna isError true e error preenchido quando a API falha", async () => {
    const mockError = new Error("Erro na API");
    getPlanoOrcamentario.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useGetPlanoOrcamentario(paaUuid), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.data).toEqual({});
  });

  it("não executa a query quando paaUuid é undefined", () => {
    renderHook(() => useGetPlanoOrcamentario(undefined), { wrapper });

    expect(getPlanoOrcamentario).not.toHaveBeenCalled();
  });

  it("não executa a query quando paaUuid é string vazia", () => {
    renderHook(() => useGetPlanoOrcamentario(""), { wrapper });

    expect(getPlanoOrcamentario).not.toHaveBeenCalled();
  });

  it("não executa a query quando options.enabled é false", () => {
    renderHook(
      () => useGetPlanoOrcamentario(paaUuid, { enabled: false }),
      { wrapper }
    );

    expect(getPlanoOrcamentario).not.toHaveBeenCalled();
  });

  it("expõe a função refetch", async () => {
    getPlanoOrcamentario.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useGetPlanoOrcamentario(paaUuid), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).toEqual(mockResponse));

    expect(typeof result.current.refetch).toBe("function");
  });

  it("refetch recarrega os dados chamando o serviço novamente", async () => {
    const mockResponseUpdated = { uuid: "paa-uuid-1", atividades: [] };
    getPlanoOrcamentario
      .mockResolvedValueOnce(mockResponse)
      .mockResolvedValueOnce(mockResponseUpdated);

    const { result } = renderHook(() => useGetPlanoOrcamentario(paaUuid), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).toEqual(mockResponse));

    result.current.refetch();

    await waitFor(() => expect(getPlanoOrcamentario).toHaveBeenCalledTimes(2));
  });
});
