import { renderHook, waitFor } from "@testing-library/react";
import { useGetFontesRecursos } from "../../hooks/useGetFontesRecursos";
import { getFontesRecursos } from "../../../../../../../../services/escolas/Paa.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../../../../../../../../services/escolas/Paa.service");

describe("useGetFontesRecursos", () => {
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
      { id: 1, nome: "Fonte 1" },
      { id: 2, nome: "Fonte 2" },
    ];
    getFontesRecursos.mockResolvedValue(mockData);

    const { result } = renderHook(() => useGetFontesRecursos(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toEqual(mockData);
      expect(getFontesRecursos).toHaveBeenCalledTimes(1);
    });
  });
});
