import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetPaaRetificacao } from "../useGetPaaRetificacao";
import { getPaaRetificacao } from "../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

jest.mock("../../../../../../services/escolas/Paa.service", () => ({
  getPaaRetificacao: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomError: jest.fn(),
    ToastCustomSuccess: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("useGetPaaRetificacao", () => {
  let queryClient;
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
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

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("enabled", () => {
    it("não chama getPaaRetificacao quando paaUuid não é fornecido", () => {
      renderHook(() => useGetPaaRetificacao(undefined), { wrapper });

      expect(getPaaRetificacao).not.toHaveBeenCalled();
    });

    it("não chama getPaaRetificacao quando paaUuid é string vazia", () => {
      renderHook(() => useGetPaaRetificacao(""), { wrapper });

      expect(getPaaRetificacao).not.toHaveBeenCalled();
    });

    it("chama getPaaRetificacao quando paaUuid é fornecido", async () => {
      getPaaRetificacao.mockResolvedValueOnce({ uuid: "paa-uuid-123" });

      renderHook(() => useGetPaaRetificacao("paa-uuid-123"), { wrapper });

      await waitFor(() =>
        expect(getPaaRetificacao).toHaveBeenCalledWith("paa-uuid-123")
      );
    });
  });

  describe("sucesso", () => {
    it("retorna os dados da query após sucesso", async () => {
      const mockData = { uuid: "paa-uuid-123", nome: "PAA Retificação" };
      getPaaRetificacao.mockResolvedValueOnce(mockData);

      const { result } = renderHook(() => useGetPaaRetificacao("paa-uuid-123"), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockData);
    });

    it("salva o uuid do PAA no localStorage após sucesso", async () => {
      const mockData = { uuid: "paa-uuid-123" };
      getPaaRetificacao.mockResolvedValueOnce(mockData);

      renderHook(() => useGetPaaRetificacao("paa-uuid-123"), { wrapper });

      await waitFor(() =>
        expect(localStorage.getItem("PAA")).toBe("paa-uuid-123")
      );
    });

    it("salva os dados do PAA em DADOS_PAA no localStorage após sucesso", async () => {
      const mockData = { uuid: "paa-uuid-123", nome: "PAA Retificação" };
      getPaaRetificacao.mockResolvedValueOnce(mockData);

      renderHook(() => useGetPaaRetificacao("paa-uuid-123"), { wrapper });

      await waitFor(() =>
        expect(localStorage.getItem("DADOS_PAA")).toBe(JSON.stringify(mockData))
      );
    });

    it("não exibe toast de erro após sucesso", async () => {
      getPaaRetificacao.mockResolvedValueOnce({ uuid: "paa-uuid-123" });

      renderHook(() => useGetPaaRetificacao("paa-uuid-123"), { wrapper });

      await waitFor(() =>
        expect(localStorage.getItem("PAA")).toBe("paa-uuid-123")
      );

      expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    });

    it("não redireciona após sucesso", async () => {
      getPaaRetificacao.mockResolvedValueOnce({ uuid: "paa-uuid-123" });

      renderHook(() => useGetPaaRetificacao("paa-uuid-123"), { wrapper });

      await waitFor(() =>
        expect(localStorage.getItem("PAA")).toBe("paa-uuid-123")
      );

      jest.runAllTimers();

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("erro genérico", () => {
    it("exibe toast de erro quando a query falha", async () => {
      const mockError = { response: { data: { mensagem: "PAA não encontrado" } } };
      getPaaRetificacao.mockRejectedValueOnce(mockError);

      renderHook(() => useGetPaaRetificacao("paa-uuid-123"), { wrapper });

      await waitFor(() =>
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
          "Não foi possível carregar o PAA de Retificação",
          "PAA não encontrado"
        )
      );
    });

    it("exibe mensagem padrão quando o erro não possui mensagem na response", async () => {
      getPaaRetificacao.mockRejectedValueOnce(new Error("Network error"));

      renderHook(() => useGetPaaRetificacao("paa-uuid-123"), { wrapper });

      await waitFor(() =>
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
          "Não foi possível carregar o PAA de Retificação",
          "Verifique se ele existe ou tente novamente."
        )
      );
    });

    it("retorna isError true quando a query falha", async () => {
      getPaaRetificacao.mockRejectedValueOnce(new Error("Erro"));

      const { result } = renderHook(() => useGetPaaRetificacao("paa-uuid-123"), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });

    it("não redireciona para /paa quando o erro não é 404", async () => {
      const mockError = { status: 500, response: { data: { mensagem: "Erro interno" } } };
      getPaaRetificacao.mockRejectedValueOnce(mockError);

      renderHook(() => useGetPaaRetificacao("paa-uuid-123"), { wrapper });

      await waitFor(() => expect(toastCustom.ToastCustomError).toHaveBeenCalled());

      jest.runAllTimers();

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("não salva dados no localStorage quando a query falha", async () => {
      getPaaRetificacao.mockRejectedValueOnce(new Error("Erro"));

      renderHook(() => useGetPaaRetificacao("paa-uuid-123"), { wrapper });

      await waitFor(() => expect(toastCustom.ToastCustomError).toHaveBeenCalled());

      expect(localStorage.getItem("PAA")).toBeNull();
      expect(localStorage.getItem("DADOS_PAA")).toBeNull();
    });
  });

  describe("erro 404", () => {
    it("exibe toast de erro quando o status é 404", async () => {
      const mockError = { status: 404, response: { data: { mensagem: "Não encontrado" } } };
      getPaaRetificacao.mockRejectedValueOnce(mockError);

      renderHook(() => useGetPaaRetificacao("paa-uuid-123"), { wrapper });

      await waitFor(() =>
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
          "Não foi possível carregar o PAA de Retificação",
          "Não encontrado"
        )
      );
    });

    it("exibe toast de sucesso de redirecionamento após 1 segundo quando o status é 404", async () => {
      const mockError = { status: 404 };
      getPaaRetificacao.mockRejectedValueOnce(mockError);

      renderHook(() => useGetPaaRetificacao("paa-uuid-123"), { wrapper });

      await waitFor(() => expect(toastCustom.ToastCustomError).toHaveBeenCalled());

      jest.advanceTimersByTime(1000);

      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
        "Redirecionando para tela de PAA"
      );
    });

    it("não exibe toast de sucesso antes de 1 segundo quando o status é 404", async () => {
      const mockError = { status: 404 };
      getPaaRetificacao.mockRejectedValueOnce(mockError);

      renderHook(() => useGetPaaRetificacao("paa-uuid-123"), { wrapper });

      await waitFor(() => expect(toastCustom.ToastCustomError).toHaveBeenCalled());

      jest.advanceTimersByTime(999);

      expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
    });

    it("navega para /paa após 3 segundos quando o status é 404", async () => {
      const mockError = { status: 404 };
      getPaaRetificacao.mockRejectedValueOnce(mockError);

      renderHook(() => useGetPaaRetificacao("paa-uuid-123"), { wrapper });

      await waitFor(() => expect(toastCustom.ToastCustomError).toHaveBeenCalled());

      jest.advanceTimersByTime(3000);

      expect(mockNavigate).toHaveBeenCalledWith("/paa");
    });

    it("não navega para /paa antes de 3 segundos quando o status é 404", async () => {
      const mockError = { status: 404 };
      getPaaRetificacao.mockRejectedValueOnce(mockError);

      renderHook(() => useGetPaaRetificacao("paa-uuid-123"), { wrapper });

      await waitFor(() => expect(toastCustom.ToastCustomError).toHaveBeenCalled());

      jest.advanceTimersByTime(2999);

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("retorno", () => {
    it("retorna o objeto query completo", async () => {
      getPaaRetificacao.mockResolvedValueOnce({ uuid: "paa-uuid-123" });

      const { result } = renderHook(() => useGetPaaRetificacao("paa-uuid-123"), { wrapper });

      expect(result.current).toHaveProperty("data");
      expect(result.current).toHaveProperty("isLoading");
      expect(result.current).toHaveProperty("isError");
      expect(result.current).toHaveProperty("isSuccess");
    });
  });
});
