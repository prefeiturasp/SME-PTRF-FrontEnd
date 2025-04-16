import { renderHook, waitFor } from "@testing-library/react";
import { useGetRecursosProprios } from "../../hooks/useGetRecursosProprios";
import { getRecursosProprios } from "../../../../../../../../services/escolas/Paa.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../../../../../../../../services/escolas/Paa.service");

describe("useGetRecursosProprios", () => {
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

  test("não deve chamar getRecursosProprios quando associacaoUUID não é fornecido", async () => {
    renderHook(() => useGetRecursosProprios(undefined, 1), { wrapper });

    expect(getRecursosProprios).not.toHaveBeenCalled();
  });

  test("deve chamar getRecursosProprios com os parâmetros corretos", async () => {
    const mockData = { count: 5, results: [{ id: 1, nome: "Recurso 1" }] };
    getRecursosProprios.mockResolvedValueOnce(mockData);

    const associacaoUUID = "test-uuid-123";
    const page = 2;

    renderHook(() => useGetRecursosProprios(associacaoUUID, page), { wrapper });

    expect(getRecursosProprios).toHaveBeenCalledWith(associacaoUUID, page);
    expect(getRecursosProprios).toHaveBeenCalledTimes(1);
  });

  test("deve retornar estado de erro quando a consulta falha", async () => {
    const mockError = new Error("Falha ao carregar recursos");
    getRecursosProprios.mockRejectedValueOnce(mockError);

    const { result } = renderHook(
      () => useGetRecursosProprios("test-uuid", 1),
      { wrapper }
    );
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  test("deve retornar valores default quando não há dados", async () => {
    getRecursosProprios.mockResolvedValueOnce(null);

    const { result } = renderHook(
      () => useGetRecursosProprios("test-uuid", 1),
      { wrapper }
    );

    await waitFor(() => !result.current.isLoading);

    expect(result.current.data).toEqual({ count: 0, results: [] });
    expect(result.current.count).toBe(0);
  });
});
