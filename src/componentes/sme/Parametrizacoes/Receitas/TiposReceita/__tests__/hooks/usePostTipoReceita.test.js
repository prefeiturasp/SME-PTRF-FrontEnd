import { act } from "react";
import { renderHook } from "@testing-library/react";
import { postTipoReceita } from "../../../../../../../services/sme/Parametrizacoes.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigate, MemoryRouter } from 'react-router-dom';
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import { usePostTipoReceita } from "../../hooks/usePostTipoReceita";

jest.mock("../../../../../../../services/sme/Parametrizacoes.service", () => ({
  postTipoReceita: jest.fn(),
}));

jest.mock("../../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe("usePostTipoReceita", () => {
  let queryClient;
  let navigate;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );

  it("deve criar um tipo de receita com sucesso", async () => {
    postTipoReceita.mockResolvedValueOnce({ uuid: "uuid-teste" });

    const { result } = renderHook(() => usePostTipoReceita(), { wrapper });

    await act(async () => {
      result.current.mutationPost.mutate({
        payload: { nome: "Receita Teste" },
      });
    });

    expect(postTipoReceita).toHaveBeenCalledWith({ nome: "Receita Teste" });
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Inclusão de tipo de crédito realizado com sucesso.",
      "O tipo de crédito foi adicionado ao sistema com sucesso."
    );

    expect(navigate).toHaveBeenCalledWith(
      "/edicao-tipo-de-credito/uuid-teste",
      { state: { selecionar_todas: false } }
    );
  });

  it("deve lidar com erro ao criar um tipo de receita", async () => {
    postTipoReceita.mockRejectedValueOnce(new Error("Erro desconhecido"));

    const { result } = renderHook(() => usePostTipoReceita(), { wrapper });

    await act(async () => {
      result.current.mutationPost.mutate({
        payload: { nome: "Receita Teste" },
      });
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Houve um erro ao tentar fazer essa atualização."
    );
  });
});
