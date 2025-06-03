import { renderHook, waitFor } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import { useGetProgramasPddeTotais } from "../../hooks/useGetProgramasPddeTotais";
import { getProgramasPddeTotais } from "../../../../../../../../services/escolas/Paa.service";

jest.mock("@tanstack/react-query");
jest.mock("../../../../../../../../services/escolas/Paa.service");

describe('useGetProgramasPddeTotais', () => {
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

    const { result } = renderHook(() => useGetProgramasPddeTotais());

    expect(result.current).toEqual({
      isLoading: true,
      isError: false,
      programas: [],
      total: {},
      error: null,
      refetch: expect.any(Function),
    });
  });

  it("deve chamar getProgramasPddeTotais com os parâmetros corretos", () => {
    (useQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: { programas: [], total: {} },
      error: null,
      refetch: jest.fn(),
    });

    renderHook(() => useGetProgramasPddeTotais());

    expect(useQuery).toHaveBeenCalledWith(
      ["programas-pdde-totais"],
      expect.any(Function),
      {
        keepPreviousData: true,
        staleTime: 5000,
        refetchOnWindowFocus: true,
      }
    );

    const queryFn = (useQuery).mock.calls[0][1];
    queryFn();
    expect(getProgramasPddeTotais).toHaveBeenCalled();
  });

  it("deve retornar dados quando a requisição for bem-sucedida", () => {
    const mockData = {
      programas: [{ id: 1, nome: "programa 1" }],
      total: { valorTotal: 1000 },
    };

    (useQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockData,
      error: null,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useGetProgramasPddeTotais());

    expect(result.current).toEqual({
      isLoading: false,
      isError: false,
      programas: mockData.programas,
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

    const { result } = renderHook(() => useGetProgramasPddeTotais());

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      programas: [],
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

    const { result } = renderHook(() => useGetProgramasPddeTotais());

    expect(result.current.programas).toEqual([]);
    expect(result.current.total).toEqual({});
  });

  it("deve expor a função refetch corretamente", async () => {
    const mockRefetch = jest.fn();

    (useQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: { programas: [], total: {} },
      error: null,
      refetch: mockRefetch,
    });

    const { result } = renderHook(() => useGetProgramasPddeTotais());

    result.current.refetch();
    expect(mockRefetch).toHaveBeenCalled();
  });
});