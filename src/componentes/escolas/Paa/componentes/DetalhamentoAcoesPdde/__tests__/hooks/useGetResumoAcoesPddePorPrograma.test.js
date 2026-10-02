import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getResumoAcoesPddePorPrograma } from "../../../../../../../services/escolas/Paa.service";
import { useGetResumoAcoesPddePorPrograma } from "../../hooks/useGetResumoAcoesPddePorPrograma";

jest.mock("../../../../../../../services/escolas/Paa.service", () => ({
  getResumoAcoesPddePorPrograma: jest.fn(),
}));

const mockResponse = [
  {
    key: "programa-1",
    level: 0,
    nome: "Programa X",
    custeio: 300,
    capital: 400,
    livre_aplicacao: 0,
    children: [
      {
        key: "acao-1",
        level: 1,
        nome: "Ação Teste",
        custeio: 100,
        capital: 200,
        livre_aplicacao: 0,
      },
    ],
  },
];

describe("useGetResumoAcoesPddePorPrograma", () => {
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

  it("retorna os dados corretamente após requisição bem-sucedida", async () => {
    getResumoAcoesPddePorPrograma.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useGetResumoAcoesPddePorPrograma(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.dados).toEqual(mockResponse));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("chama getResumoAcoesPddePorPrograma sem argumentos", async () => {
    getResumoAcoesPddePorPrograma.mockResolvedValueOnce(mockResponse);

    renderHook(() => useGetResumoAcoesPddePorPrograma(), { wrapper });

    await waitFor(() =>
      expect(getResumoAcoesPddePorPrograma).toHaveBeenCalledWith()
    );
  });

  it("retorna dados como array vazio e isLoading true no estado inicial", () => {
    getResumoAcoesPddePorPrograma.mockReturnValue(new Promise(() => {})); // nunca resolve

    const { result } = renderHook(() => useGetResumoAcoesPddePorPrograma(), {
      wrapper,
    });

    expect(result.current.dados).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it("retorna error e dados vazio quando a API falha", async () => {
    getResumoAcoesPddePorPrograma.mockRejectedValueOnce(new Error("Erro na API"));

    const { result } = renderHook(() => useGetResumoAcoesPddePorPrograma(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error));

    expect(result.current.dados).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("expõe função refetch", async () => {
    getResumoAcoesPddePorPrograma.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useGetResumoAcoesPddePorPrograma(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.dados).toEqual(mockResponse));

    expect(typeof result.current.refetch).toBe("function");
  });

  it("refetch recarrega os dados chamando o serviço novamente", async () => {
    const mockResponseAtualizado = [
      { key: "programa-2", level: 0, nome: "Programa Y", custeio: 0, capital: 0, livre_aplicacao: 0 },
    ];
    getResumoAcoesPddePorPrograma
      .mockResolvedValueOnce(mockResponse)
      .mockResolvedValueOnce(mockResponseAtualizado);

    const { result } = renderHook(() => useGetResumoAcoesPddePorPrograma(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.dados).toEqual(mockResponse));

    result.current.refetch();

    await waitFor(() =>
      expect(getResumoAcoesPddePorPrograma).toHaveBeenCalledTimes(2)
    );

    await waitFor(() =>
      expect(result.current.dados).toEqual(mockResponseAtualizado)
    );
  });
});
