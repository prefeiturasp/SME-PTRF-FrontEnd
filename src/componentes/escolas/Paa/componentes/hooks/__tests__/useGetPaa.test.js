import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetPaa } from "../useGetPaa";
import { getPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
  getPaa: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomError: jest.fn(),
    ToastCustomSuccess: jest.fn(),
  },
}));

describe("useGetPaa", () => {
  let queryClient;
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  });

  describe("enabled", () => {
    it("não chama getPaa quando paaUuid não é fornecido", () => {
      renderHook(() => useGetPaa(undefined), { wrapper });

      expect(getPaa).not.toHaveBeenCalled();
    });

    it("não chama getPaa quando paaUuid é string vazia", () => {
      renderHook(() => useGetPaa(""), { wrapper });

      expect(getPaa).not.toHaveBeenCalled();
    });

    it("chama getPaa quando paaUuid é fornecido", async () => {
      getPaa.mockResolvedValueOnce({ uuid: "paa-uuid-123" });

      renderHook(() => useGetPaa("paa-uuid-123"), { wrapper });

      await waitFor(() => expect(getPaa).toHaveBeenCalledWith("paa-uuid-123"));
    });
  });

  describe("sucesso", () => {
    it("retorna os dados da query após sucesso", async () => {
      const mockData = { uuid: "paa-uuid-123", nome: "PAA Teste" };
      getPaa.mockResolvedValueOnce(mockData);

      const { result } = renderHook(() => useGetPaa("paa-uuid-123"), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockData);
    });

    it("salva o uuid do PAA no localStorage após sucesso", async () => {
      const mockData = { uuid: "paa-uuid-123" };
      getPaa.mockResolvedValueOnce(mockData);

      renderHook(() => useGetPaa("paa-uuid-123"), { wrapper });

      await waitFor(() =>
        expect(localStorage.getItem("PAA")).toBe("paa-uuid-123")
      );
    });

    it("salva os dados do PAA em DADOS_PAA no localStorage após sucesso", async () => {
      const mockData = { uuid: "paa-uuid-123", nome: "PAA Teste" };
      getPaa.mockResolvedValueOnce(mockData);

      renderHook(() => useGetPaa("paa-uuid-123"), { wrapper });

      await waitFor(() =>
        expect(localStorage.getItem("DADOS_PAA")).toBe(JSON.stringify(mockData))
      );
    });

    it("não exibe toast de erro após sucesso", async () => {
      getPaa.mockResolvedValueOnce({ uuid: "paa-uuid-123" });

      renderHook(() => useGetPaa("paa-uuid-123"), { wrapper });

      await waitFor(() =>
        expect(localStorage.getItem("PAA")).toBe("paa-uuid-123")
      );

      expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    });
  });

  describe("erro", () => {
    it("exibe toast de erro quando a query falha", async () => {
      const mockError = { response: { data: { mensagem: "PAA não encontrado" } } };
      getPaa.mockRejectedValueOnce(mockError);

      renderHook(() => useGetPaa("paa-uuid-123"), { wrapper });

      await waitFor(() =>
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
          "Não foi possível carregar o PAA",
          "PAA não encontrado"
        )
      );
    });

    it("exibe mensagem padrão quando o erro não possui mensagem na response", async () => {
      getPaa.mockRejectedValueOnce(new Error("Network error"));

      renderHook(() => useGetPaa("paa-uuid-123"), { wrapper });

      await waitFor(() =>
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
          "Não foi possível carregar o PAA",
          "Verifique se ele existe ou tente novamente."
        )
      );
    });

    it("retorna isError true quando a query falha", async () => {
      getPaa.mockRejectedValueOnce(new Error("Erro"));

      const { result } = renderHook(() => useGetPaa("paa-uuid-123"), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });

    it("não salva dados no localStorage quando a query falha", async () => {
      getPaa.mockRejectedValueOnce(new Error("Erro"));

      renderHook(() => useGetPaa("paa-uuid-123"), { wrapper });

      await waitFor(() => expect(getPaa).toHaveBeenCalled());
      await waitFor(() => expect(toastCustom.ToastCustomError).toHaveBeenCalled());

      expect(localStorage.getItem("PAA")).toBeNull();
      expect(localStorage.getItem("DADOS_PAA")).toBeNull();
    });
  });

  describe("retorno", () => {
    it("retorna o objeto query completo", async () => {
      getPaa.mockResolvedValueOnce({ uuid: "paa-uuid-123" });

      const { result } = renderHook(() => useGetPaa("paa-uuid-123"), { wrapper });

      expect(result.current).toHaveProperty("data");
      expect(result.current).toHaveProperty("isLoading");
      expect(result.current).toHaveProperty("isError");
      expect(result.current).toHaveProperty("isSuccess");
    });

    it("inicia com isLoading true quando paaUuid é fornecido", () => {
      getPaa.mockResolvedValueOnce({ uuid: "paa-uuid-123" });

      const { result } = renderHook(() => useGetPaa("paa-uuid-123"), { wrapper });

      expect(result.current.isLoading).toBe(true);
    });
  });
});
