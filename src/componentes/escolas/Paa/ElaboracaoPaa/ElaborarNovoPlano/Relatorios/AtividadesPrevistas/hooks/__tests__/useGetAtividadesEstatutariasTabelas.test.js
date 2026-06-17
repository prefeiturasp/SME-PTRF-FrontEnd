import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getAtividadesEstatutariasTabelas } from "../../../../../../../../../services/sme/Parametrizacoes.service";
import { useGetAtividadesEstatutariasTabelas } from "../useGetAtividadesEstatutariasTabelas";

jest.mock("../../../../../../../../../services/sme/Parametrizacoes.service", () => ({
  getAtividadesEstatutariasTabelas: jest.fn(),
}));

const mockTabelas = [
  { uuid: "tabela-1", nome: "Tipo A" },
  { uuid: "tabela-2", nome: "Tipo B" },
];

describe("useGetAtividadesEstatutariasTabelas", () => {
  let queryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("retorna os dados corretamente após requisição bem-sucedida", async () => {
    getAtividadesEstatutariasTabelas.mockResolvedValueOnce(mockTabelas);

    const { result } = renderHook(() => useGetAtividadesEstatutariasTabelas(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).toEqual(mockTabelas));

    expect(result.current.isError).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it("chama getAtividadesEstatutariasTabelas uma vez ao montar", async () => {
    getAtividadesEstatutariasTabelas.mockResolvedValueOnce(mockTabelas);

    renderHook(() => useGetAtividadesEstatutariasTabelas(), { wrapper });

    await waitFor(() =>
      expect(getAtividadesEstatutariasTabelas).toHaveBeenCalledTimes(1)
    );
  });

  it("retorna isLoading true enquanto a requisição está em andamento", () => {
    getAtividadesEstatutariasTabelas.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useGetAtividadesEstatutariasTabelas(), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(true);
  });

  it("retorna isError true quando a API falha", async () => {
    const mockError = new Error("Erro na API");
    getAtividadesEstatutariasTabelas.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useGetAtividadesEstatutariasTabelas(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("expõe a função refetch", async () => {
    getAtividadesEstatutariasTabelas.mockResolvedValueOnce(mockTabelas);

    const { result } = renderHook(() => useGetAtividadesEstatutariasTabelas(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).toEqual(mockTabelas));

    expect(typeof result.current.refetch).toBe("function");
  });

  it("refetch recarrega os dados chamando o serviço novamente", async () => {
    const mockTabelasAtualizadas = [{ uuid: "tabela-3", nome: "Tipo C" }];
    getAtividadesEstatutariasTabelas
      .mockResolvedValueOnce(mockTabelas)
      .mockResolvedValueOnce(mockTabelasAtualizadas);

    const { result } = renderHook(() => useGetAtividadesEstatutariasTabelas(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).toEqual(mockTabelas));

    result.current.refetch();

    await waitFor(() =>
      expect(getAtividadesEstatutariasTabelas).toHaveBeenCalledTimes(2)
    );
  });

  it("utiliza keepPreviousData — dados permanecem acessíveis durante refetch", async () => {
    getAtividadesEstatutariasTabelas.mockResolvedValue(mockTabelas);

    const { result } = renderHook(() => useGetAtividadesEstatutariasTabelas(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).toEqual(mockTabelas));

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toEqual(mockTabelas);
  });
});
