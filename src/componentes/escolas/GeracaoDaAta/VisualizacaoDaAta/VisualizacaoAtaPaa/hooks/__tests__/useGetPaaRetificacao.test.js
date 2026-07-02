import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetPaaRetificacao } from "../useGetPaaRetificacao";
import { getPaaRetificacao } from "../../../../../../../services/escolas/Paa.service";

jest.mock("../../../../../../../services/escolas/Paa.service", () => ({
  getPaaRetificacao: jest.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useGetPaaRetificacao", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve buscar os dados com sucesso quando o paaUuid for fornecido", async () => {
        const mockData = { id: 1, descricao: "Retificação de Ata PAA" };
        getPaaRetificacao.mockResolvedValueOnce(mockData);

        const paaUuid = "1234-abcd-5678";
        const { result } = renderHook(() => useGetPaaRetificacao(paaUuid), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(getPaaRetificacao).toHaveBeenCalledWith(paaUuid);
        expect(getPaaRetificacao).toHaveBeenCalledTimes(1);
        expect(result.current.data).toEqual(mockData);
    });

    it("não deve executar a query se o paaUuid não for fornecido (enabled: false)", () => {
        const { result } = renderHook(() => useGetPaaRetificacao(null), {
            wrapper: createWrapper(),
        });

        expect(result.current.isEnabled).toBeFalsy();
        expect(getPaaRetificacao).not.toHaveBeenCalled();
    });

    it("deve retornar erro quando a chamada do serviço falhar", async () => {
        const mockError = new Error("Erro ao buscar dados do PAA");
        getPaaRetificacao.mockRejectedValueOnce(mockError);

        const paaUuid = "1234-abcd-5678";
        const { result } = renderHook(() => useGetPaaRetificacao(paaUuid), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toEqual(mockError);
        expect(result.current.data).toBeUndefined();
    });
});