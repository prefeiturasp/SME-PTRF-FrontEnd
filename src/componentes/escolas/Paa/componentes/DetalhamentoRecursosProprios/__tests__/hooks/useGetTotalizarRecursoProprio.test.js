import { renderHook, waitFor } from "@testing-library/react";
import { useGetTotalizadorRecursoProprio } from "../../hooks/useGetTotalizarRecursoProprio";

import { getTotalizadorRecursoProprio } from "../../../../../../../../services/escolas/Paa.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../../../../../../../../services/escolas/Paa.service");

describe("useGetTotalizadorRecursoProprio", () => {
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
    const mockData = { total: 1000 };
    getTotalizadorRecursoProprio.mockResolvedValue(mockData);

    const associacaoUUID = "uuid-fake";
    const paaUUID = "paa-uuid-123";

    const { result } = renderHook(
      () => useGetTotalizadorRecursoProprio(associacaoUUID, paaUUID),
      {
        wrapper,
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toEqual(mockData);
      expect(getTotalizadorRecursoProprio).toHaveBeenCalledWith(associacaoUUID, paaUUID);
      expect(getTotalizadorRecursoProprio).toHaveBeenCalledTimes(1);
    });
  });
});
