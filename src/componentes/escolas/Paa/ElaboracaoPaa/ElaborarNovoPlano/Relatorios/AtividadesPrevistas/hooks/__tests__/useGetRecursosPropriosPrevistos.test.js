import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getRecursosPropriosPrevistos } from "../../../../../../../../../services/escolas/Paa.service";
import { useGetRecursosPropriosPrevistos } from "../useGetRecursosPropriosPrevistos";

jest.mock("../../../../../../../../../services/escolas/Paa.service", () => ({
  getRecursosPropriosPrevistos: jest.fn(),
}));

const PAA_UUID = "paa-uuid-123";

const mockRecursos = [
  { uuid: "recurso-1", descricao: "Recurso A", valor: 1000 },
  { uuid: "recurso-2", descricao: "Recurso B", valor: 2000 },
];

describe("useGetRecursosPropriosPrevistos", () => {
  let queryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("retorna os dados corretamente após requisição bem-sucedida", async () => {
    localStorage.setItem("PAA", PAA_UUID);
    getRecursosPropriosPrevistos.mockResolvedValueOnce(mockRecursos);

    const { result } = renderHook(() => useGetRecursosPropriosPrevistos(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).toEqual(mockRecursos));

    expect(result.current.isError).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it("chama getRecursosPropriosPrevistos com o paaUuid lido do localStorage", async () => {
    localStorage.setItem("PAA", PAA_UUID);
    getRecursosPropriosPrevistos.mockResolvedValueOnce(mockRecursos);

    renderHook(() => useGetRecursosPropriosPrevistos(), { wrapper });

    await waitFor(() =>
      expect(getRecursosPropriosPrevistos).toHaveBeenCalledWith(PAA_UUID)
    );
  });

  it("retorna isLoading true enquanto a requisição está em andamento", () => {
    localStorage.setItem("PAA", PAA_UUID);
    getRecursosPropriosPrevistos.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useGetRecursosPropriosPrevistos(), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(true);
  });

  it("retorna isError true e error preenchido quando a API falha", async () => {
    localStorage.setItem("PAA", PAA_UUID);
    const mockError = new Error("Erro na API");
    getRecursosPropriosPrevistos.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useGetRecursosPropriosPrevistos(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("não executa a query quando PAA não está no localStorage", () => {
    renderHook(() => useGetRecursosPropriosPrevistos(), { wrapper });

    expect(getRecursosPropriosPrevistos).not.toHaveBeenCalled();
  });

  it("não executa a query quando PAA está vazio no localStorage", () => {
    localStorage.setItem("PAA", "");

    renderHook(() => useGetRecursosPropriosPrevistos(), { wrapper });

    expect(getRecursosPropriosPrevistos).not.toHaveBeenCalled();
  });

  it("expõe a função refetch", async () => {
    localStorage.setItem("PAA", PAA_UUID);
    getRecursosPropriosPrevistos.mockResolvedValueOnce(mockRecursos);

    const { result } = renderHook(() => useGetRecursosPropriosPrevistos(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).toEqual(mockRecursos));

    expect(typeof result.current.refetch).toBe("function");
  });

  it("refetch recarrega os dados chamando o serviço novamente", async () => {
    localStorage.setItem("PAA", PAA_UUID);
    const mockRecursosAtualizados = [{ uuid: "recurso-3", descricao: "Recurso C", valor: 3000 }];
    getRecursosPropriosPrevistos
      .mockResolvedValueOnce(mockRecursos)
      .mockResolvedValueOnce(mockRecursosAtualizados);

    const { result } = renderHook(() => useGetRecursosPropriosPrevistos(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).toEqual(mockRecursos));

    result.current.refetch();

    await waitFor(() =>
      expect(getRecursosPropriosPrevistos).toHaveBeenCalledTimes(2)
    );
  });
});
