import { act } from "react";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigate, MemoryRouter } from 'react-router-dom';
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import { useDeleteTipoReceita } from "../../hooks/useDeleteTipoReceita";
import { deleteTipoReceita } from "../../../../../../../services/sme/Parametrizacoes.service";

jest.mock("../../../../../../../services/sme/Parametrizacoes.service", () => ({
  deleteTipoReceita: jest.fn(),
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

describe("useDeleteTipoReceita", () => {
  let queryClient;
  let navigate;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
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

  it("deve deletar um tipo de receita com sucesso", async () => {
    deleteTipoReceita.mockResolvedValueOnce();

    const { result } = renderHook(() => useDeleteTipoReceita(), { wrapper });

    await act(async () => {
      result.current.mutationDelete.mutate("uuid-teste");
    });

    expect(deleteTipoReceita).toHaveBeenCalledWith("uuid-teste");
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Remoção do tipo de crédito efetuado com sucesso.",
      "O tipo de crédito foi removido do sistema com sucesso."
    );
    expect(navigate).toHaveBeenCalledWith("/parametro-tipos-receita");
  });

  it("deve lidar com erro específico na exclusão", async () => {
    const erro = {
      response: { data: { mensagem: "Erro ao excluir tipo de receita." } },
    };
    deleteTipoReceita.mockRejectedValueOnce(erro);

    const { result } = renderHook(() => useDeleteTipoReceita(), { wrapper });

    await act(async () => {
      result.current.mutationDelete.mutate("uuid-teste");
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Erro ao excluir tipo de receita."
    );
  });

  it("deve lidar com erro genérico na exclusão", async () => {
    deleteTipoReceita.mockRejectedValueOnce(new Error("Erro desconhecido"));

    const { result } = renderHook(() => useDeleteTipoReceita(), { wrapper });

    await act(async () => {
      result.current.mutationDelete.mutate("uuid-teste");
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Houve um erro ao tentar excluir tipo de crédito."
    );
  });
});
