import { act } from "react";
import { renderHook } from "@testing-library/react";
import { patchTipoReceita } from "../../../../../../../services/sme/Parametrizacoes.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import { usePatchTipoReceita } from "../../hooks/usePatchTipoReceita";
import { useNavigate, MemoryRouter } from 'react-router-dom';

jest.mock("../../../../../../../services/sme/Parametrizacoes.service", () => ({
  patchTipoReceita: jest.fn(),
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

describe("usePatchTipoReceita", () => {
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

  it("deve atualizar um tipo de receita com sucesso", async () => {
    patchTipoReceita.mockResolvedValueOnce();

    const { result } = renderHook(() => usePatchTipoReceita(), { wrapper });

    await act(async () => {
      result.current.mutationPatch.mutate({
        UUID: "uuid-teste",
        payload: { nome: "Novo Nome" },
      });
    });

    expect(patchTipoReceita).toHaveBeenCalledWith("uuid-teste", {
      nome: "Novo Nome",
    });
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Edição do tipo de crédito realizado com sucesso.",
      "O tipo de crédito foi editado no sistema com sucesso."
    );
  });

  it("deve lidar com erro ao atualizar um tipo de receita", async () => {
    patchTipoReceita.mockRejectedValueOnce(new Error("Erro desconhecido"));

    const { result } = renderHook(() => usePatchTipoReceita(), { wrapper });

    await act(async () => {
      result.current.mutationPatch.mutate({
        UUID: "uuid-teste",
        payload: { nome: "Novo Nome" },
      });
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Houve um erro ao tentar fazer essa atualização."
    );
  });
});
