import { renderHook } from "@testing-library/react";
import { useDesvincularUnidade } from "../../../components/UnidadesVinculadas/hooks/useDesvincularUnidade"; // Ajuste o caminho
import { desvincularUnidadesTipoCusteio } from "../../../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";
import { CustomModalConfirm } from "../../../../../../../Globais/Modal/CustomModalConfirm";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { createStore } from "redux";

// Mock das funções externas
jest.mock("../../../../../../../../services/sme/Parametrizacoes.service", () => ({
  desvincularUnidadesTipoCusteio: jest.fn(),
}));

jest.mock("../../../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
  },
}));

jest.mock("../../../../../../../Globais/Modal/CustomModalConfirm", () => ({
  CustomModalConfirm: jest.fn(),
}));

const mockStore = createStore(() => ({}));

describe("useDesvincularUnidade", () => {
  const uuid = "uuid";
  const unidadeUUID = "unidadeUUID";
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <Provider store={mockStore}>{children}</Provider>
    </QueryClientProvider>
  );

  it("deve chamar sucesso quando a mutação for bem-sucedida para desvincular unidade", async () => {
    desvincularUnidadesTipoCusteio.mockResolvedValueOnce({ data: { success: true } }); // Simula sucesso da API

    const { result } = renderHook(() => useDesvincularUnidade(), { wrapper });

    // Executa a mutação
    act(() => {
      result.current.mutationDesvincularUnidadeEmLote.mutate({ uuid, unidadeUUID });
    });

    await act(async () => {});

    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith("Sucesso!", undefined);
  });

  it("deve chamar sucesso quando a mutação em lote for bem-sucedida para desvincular unidades", async () => {
    desvincularUnidadesTipoCusteio.mockResolvedValueOnce({ data: { success: true } }); // Simula sucesso da API

    const { result } = renderHook(() => useDesvincularUnidade(), { wrapper });

    // Executa a mutação em lote
    act(() => {
      result.current.mutationDesvincularUnidadeEmLote.mutate({ uuid, unidadeUUID: [unidadeUUID] });
    });

    await act(async () => {});

    // Verifica se a função de sucesso foi chamada
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith("Sucesso!", undefined);
  });

  it("deve chamar erro quando a mutação falhar para desvincular unidade", async () => {
    const mockError = { response: { data: { mensagem: "Erro ao desvincular unidade" } } };
    desvincularUnidadesTipoCusteio.mockRejectedValueOnce(mockError); // Simula erro na API

    const { result } = renderHook(() => useDesvincularUnidade(), { wrapper });

    // Executa a mutação
    act(() => {
      result.current.mutationDesvincularUnidadeEmLote.mutate({ uuid, unidadeUUID });
    });

    await act(async () => {});

    // Verifica se o modal de erro foi chamado
    expect(CustomModalConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Restrição do tipo de despesa de custeio",
      })
    );
  });

  it("deve chamar erro quando a mutação em lote falhar para desvincular unidades", async () => {
    const mockError = { response: { data: { mensagem: "Erro ao desvincular unidades" } } };
    desvincularUnidadesTipoCusteio.mockRejectedValueOnce(mockError); // Simula erro na API

    const { result } = renderHook(() => useDesvincularUnidade(), { wrapper });

    // Executa a mutação em lote
    act(() => {
      result.current.mutationDesvincularUnidadeEmLote.mutate({ uuid, unidadeUUID: [unidadeUUID] });
    });

    await act(async () => {});

    // Verifica se o modal de erro foi chamado
    expect(CustomModalConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Restrição do tipo de despesa de custeio",
      })
    );
  });
});
