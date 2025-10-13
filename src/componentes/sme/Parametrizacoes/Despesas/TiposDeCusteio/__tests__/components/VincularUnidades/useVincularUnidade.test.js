import { renderHook } from "@testing-library/react";
import { useVincularUnidade } from "../../../components/VincularUnidades/hooks/useVincularUnidade"; // Ajuste o caminho
import { vincularUnidadesTipoCusteio } from "../../../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";
import { CustomModalConfirm } from "../../../../../../../Globais/Modal/CustomModalConfirm";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { createStore } from "redux";

// Mock das funções externas
jest.mock("../../../../../../../../services/sme/Parametrizacoes.service", () => ({
  vincularUnidadesTipoCusteio: jest.fn(),
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

describe("useVincularUnidade", () => {
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

  it("deve chamar sucesso quando a mutação for bem-sucedida para vincular unidade", async () => {
    vincularUnidadesTipoCusteio.mockResolvedValueOnce({ data: { success: true } }); // Simula sucesso da API

    const { result } = renderHook(() => useVincularUnidade(), { wrapper });

    // Executa a mutação
    act(() => {
      result.current.mutationVincularUnidadeEmLote.mutate({ uuid, unidadeUUID });
    });

    await act(async () => {});

    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith("Sucesso!", undefined);
  });

  it("deve chamar sucesso quando a mutação em lote for bem-sucedida para vincular unidades", async () => {
    vincularUnidadesTipoCusteio.mockResolvedValueOnce({ data: { success: true } }); // Simula sucesso da API

    const { result } = renderHook(() => useVincularUnidade(), { wrapper });

    act(() => {
      result.current.mutationVincularUnidadeEmLote.mutate({ uuid, unidadeUUID: [unidadeUUID] });
    });

    await act(async () => {});

    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith("Sucesso!", undefined);
  });

  it("deve chamar erro quando a mutação falhar para vincular unidade", async () => {
    const mockError = { response: { data: { mensagem: "Erro ao vincular unidade" } } };
    vincularUnidadesTipoCusteio.mockRejectedValueOnce(mockError); // Simula erro na API

    const { result } = renderHook(() => useVincularUnidade(), { wrapper });

    act(() => {
      result.current.mutationVincularUnidadeEmLote.mutate({ uuid, unidadeUUID });
    });

    await act(async () => {});

    expect(CustomModalConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Restrição do tipo de despesa de custeio",
      })
    );
  });

  it("deve chamar erro quando a mutação em lote falhar para vincular unidades", async () => {
    const mockError = { response: { data: { mensagem: "Erro ao vincular unidades" } } };
    vincularUnidadesTipoCusteio.mockRejectedValueOnce(mockError); // Simula erro na API

    const { result } = renderHook(() => useVincularUnidade(), { wrapper });

    act(() => {
      result.current.mutationVincularUnidadeEmLote.mutate({ uuid, unidadeUUID: [unidadeUUID] });
    });

    await act(async () => {});

    expect(CustomModalConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Restrição do tipo de despesa de custeio",
      })
    );
  });
});
