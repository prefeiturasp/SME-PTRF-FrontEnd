import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { waitFor } from "@testing-library/react";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { usePostBemProduzido } from "../../hooks/usePostBemProduzido";
import { postBemProduzido } from "../../../../../../services/escolas/BensProduzidos.service";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("../../../../../../services/escolas/BensProduzidos.service");
jest.mock("../../../../../Globais/ToastCustom");

const navigate = jest.fn();

describe("usePostBemProduzido", () => {
  let queryClient;
  let wrapper;
  let handleCloseFieldsToEdit;

  beforeEach(() => {
    jest.clearAllMocks();

    handleCloseFieldsToEdit = jest.fn();

    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  });

  test("deve chamar a função postBemProduzido com o payload correto", async () => {
    const mockResponseData = { id: 1, nome: "Novo Bem Produzido" };
    postBemProduzido.mockResolvedValueOnce(mockResponseData);

    const { result } = renderHook(
      () => usePostBemProduzido(handleCloseFieldsToEdit),
      { wrapper }
    );

    const payload = { nome: "Novo Bem Produzido", valor: 1000 };

    await result.current.mutationPost.mutateAsync({ payload });

    expect(postBemProduzido).toHaveBeenCalledWith(payload);
    expect(postBemProduzido).toHaveBeenCalledTimes(1);
  });

  test("deve exibir toast de sucesso, invalidar queries e chamar o callback após criação bem-sucedida", async () => {
    const mockResponseData = { id: 1, nome: "Novo Bem Produzido" };
    postBemProduzido.mockResolvedValueOnce(mockResponseData);

    const { result } = renderHook(() => usePostBemProduzido(navigate), {
      wrapper,
    });

    await result.current.mutationPost.mutateAsync({
      payload: { nome: "Novo Bem Produzido", valor: 1000 },
    });

    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Rascunho do bem produzido salvo com sucesso."
    );
  });

  test("deve exibir toast de erro quando a API falha", async () => {
    postBemProduzido.mockRejectedValueOnce(new Error("Erro na API"));

    const { result } = renderHook(() => usePostBemProduzido(navigate), {
      wrapper,
    });

    try {
      await result.current.mutationPost.mutateAsync({
        payload: { nome: "Teste" },
      });
    } catch (error) {}

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Houve um erro ao salvar rascunho."
    );
  });

  test("deve exibir toast de erro quando a API falha (usando waitFor)", async () => {
    postBemProduzido.mockRejectedValueOnce(new Error("Erro na API"));

    const { result } = renderHook(() => usePostBemProduzido(navigate), {
      wrapper,
    });

    try {
      await result.current.mutationPost.mutateAsync({
        payload: { nome: "Teste" },
      });
    } catch (error) {}

    await waitFor(() => {
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Houve um erro ao salvar rascunho."
      );
    });
  });
});
