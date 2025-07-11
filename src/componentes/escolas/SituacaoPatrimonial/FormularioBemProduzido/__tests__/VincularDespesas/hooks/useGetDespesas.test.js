import { renderHook, waitFor } from "@testing-library/react";
import { useGetDespesas } from "../../../VincularDespesas/hooks/useGetDespesas";
import { getListaDespesasSituacaoPatrimonial } from "../../../../../../../services/escolas/Despesas.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../../../../../../../services/escolas/Despesas.service");

describe("useGetDespesas", () => {
  let queryClient;
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
        },
      },
    });

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  });

  test("deve retornar dados corretamente quando a consulta é bem-sucedida", async () => {
    const mockData = [
      { id: 1, nome: "Despesa 1", valor: 100 },
      { id: 2, nome: "Despesa 2", valor: 200 },
    ];
    const filtros = { categoria: "alimentacao" };
    const page = 1;

    getListaDespesasSituacaoPatrimonial.mockResolvedValue(mockData);

    const { result } = renderHook(() => useGetDespesas(filtros, page), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);

      expect(result.current.isError).toBe(false);

      expect(result.current.data).toEqual(mockData);

      expect(getListaDespesasSituacaoPatrimonial).toHaveBeenCalledTimes(1);

      expect(getListaDespesasSituacaoPatrimonial).toHaveBeenCalledWith(
        filtros,
        page
      );
    });
  });

  test("deve retornar erro quando a consulta falha", async () => {
    const mockError = new Error("Falha ao carregar despesas");
    const filtros = { categoria: "alimentacao" };
    const page = 1;

    getListaDespesasSituacaoPatrimonial.mockRejectedValue(mockError);

    const { result } = renderHook(() => useGetDespesas(filtros, page), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);

      expect(result.current.isError).toBe(true);

      expect(result.current.data).toBeUndefined();

      expect(getListaDespesasSituacaoPatrimonial).toHaveBeenCalledTimes(1);

      expect(getListaDespesasSituacaoPatrimonial).toHaveBeenCalledWith(
        filtros,
        page
      );
    });
  });
});
