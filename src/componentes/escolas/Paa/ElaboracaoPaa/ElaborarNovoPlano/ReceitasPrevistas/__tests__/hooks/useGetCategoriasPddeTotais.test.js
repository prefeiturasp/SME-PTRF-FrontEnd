import { renderHook, waitFor } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import { useGetCategoriasPddeTotais } from "../../hooks/useGetCategoriasPddeTotais";
import { getCategoriasPddeTotais } from "../../../../../../../../services/escolas/Paa.service";

jest.mock("@tanstack/react-query");
jest.mock("../../../../../../../../services/escolas/Paa.service");

describe('useGetCategoriasPddeTotais', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar os valores iniciais corretamente', () => {
    (useQuery).mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      error: null,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGetCategoriasPddeTotais());

    expect(result.current).toEqual({
      isLoading: true,
      isError: false,
      categorias: [],
      total: {},
      error: null,
      refetch: expect.any(Function),
    });
  });

  it("deve chamar getCategoriasPddeTotais com os parâmetros corretos", () => {
    (useQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: { categorias: [], total: {} },
      error: null,
      refetch: jest.fn(),
    });

    renderHook(() => useGetCategoriasPddeTotais());

    expect(useQuery).toHaveBeenCalledWith(
      ["categorias-pdde-totais"],
      expect.any(Function),
      {
        keepPreviousData: true,
        staleTime: 5000,
        refetchOnWindowFocus: true,
      }
    );

    const queryFn = (useQuery).mock.calls[0][1];
    queryFn();
    expect(getCategoriasPddeTotais).toHaveBeenCalled();
  });

  it("deve retornar dados quando a requisição for bem-sucedida", () => {
    const mockData = {
      categorias: [{ id: 1, nome: "Categoria 1" }],
      total: { valorTotal: 1000 },
    };

    (useQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockData,
      error: null,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGetCategoriasPddeTotais());

    expect(result.current).toEqual({
      isLoading: false,
      isError: false,
      categorias: mockData.categorias,
      total: mockData.total,
      error: null,
      refetch: expect.any(Function),
    });
  });

  it("deve retornar erro quando a requisição falhar", () => {
    const mockError = new Error("Erro na requisição");

    (useQuery).mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
      error: mockError,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGetCategoriasPddeTotais());

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      categorias: [],
      total: {},
      error: mockError,
      refetch: expect.any(Function),
    });
  });

  it("deve fornecer valores padrão quando data for undefined", () => {
    (useQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: undefined,
      error: null,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGetCategoriasPddeTotais());

    expect(result.current.categorias).toEqual([]);
    expect(result.current.total).toEqual({});
  });

  it("deve expor a função refetch corretamente", async () => {
    const mockRefetch = jest.fn();

    (useQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: { categorias: [], total: {} },
      error: null,
      refetch: mockRefetch,
    });

    const { result } = renderHook(() => useGetCategoriasPddeTotais());

    result.current.refetch();
    expect(mockRefetch).toHaveBeenCalled();
  });
});