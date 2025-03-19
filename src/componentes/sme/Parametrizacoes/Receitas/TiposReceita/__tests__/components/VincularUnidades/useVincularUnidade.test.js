import { renderHook, waitFor } from "@testing-library/react";
import { useVincularUnidade } from '../../../components/VincularUnidades/hooks/useVincularUnidade'; // Ajuste o caminho
import { vincularUnidadeTipoReceita, vincularUnidadeTipoReceitaEmLote } from "../../../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";
import { CustomModalConfirm } from "../../../../../../../Globais/Modal/CustomModalConfirm";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { createStore } from "redux";

// Mock das funções externas
jest.mock("../../../../../../../../services/sme/Parametrizacoes.service", () => ({
  vincularUnidadeTipoReceita: jest.fn(),
  vincularUnidadeTipoReceitaEmLote: jest.fn(),
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

describe('useVincularUnidade', () => {
  const uuid = 'uuid';
  const unidadeUUID = 'unidadeUUID';
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
        <QueryClientProvider client={queryClient}><Provider store={mockStore}>{children}</Provider></QueryClientProvider>
    );
  
  it('deve chamar sucesso quando a mutação for bem-sucedida para vincular unidade', async () => {
    vincularUnidadeTipoReceita.mockResolvedValueOnce({ data: { success: true } }); // Simula sucesso da API

    const { result } = renderHook(() => useVincularUnidade(), {wrapper});

    // Executa a mutação
    act(() => {
      result.current.mutationVincularUnidade.mutate({ uuid, unidadeUUID });
    });

    await act(async () => {});

    // Verifica se a função de sucesso foi chamada
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith("Sucesso!", "Unidade vinculada ao tipo de crédito com sucesso.");
  });

  it('deve chamar sucesso quando a mutação em lote for bem-sucedida para vincular unidades', async () => {
    vincularUnidadeTipoReceitaEmLote.mockResolvedValueOnce({ data: { success: true } }); // Simula sucesso da API

    const { result } = renderHook(() => useVincularUnidade(), {wrapper});

    // Executa a mutação em lote
    act(() => {
      result.current.mutationVincularUnidadeEmLote.mutate({ uuid, unidadeUUID: [unidadeUUID] });
    });

    await act(async () => {});

    // Verifica se a função de sucesso foi chamada
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith("Sucesso!", "Unidades vinculadas ao tipo de crédito com sucesso.");
  });

  it('deve chamar erro quando a mutação falhar para vincular unidade', async () => {
    const mockError = { response: { data: { mensagem: "Erro ao vincular unidade" } } };
    vincularUnidadeTipoReceita.mockRejectedValueOnce(mockError); // Simula erro na API

    const { result } = renderHook(() => useVincularUnidade(), {wrapper});

    // Executa a mutação
    act(() => {
      result.current.mutationVincularUnidade.mutate({ uuid, unidadeUUID });
    });

    await act(async () => {});

    // Verifica se o modal de erro foi chamado
    expect(CustomModalConfirm).toHaveBeenCalledWith({
      dispatch: expect.any(Function),
      title: "Restrição do tipo de crédito",
      message: "Erro ao vincular unidade",
      cancelText: "Ok",
      dataQa: "modal-restricao-vincular-unidade-ao-tipo-de-credito",
    });
  });

  it('deve chamar erro quando a mutação em lote falhar para vincular unidades', async () => {
    const mockError = { response: { data: { mensagem: "Erro ao vincular unidades" } } };
    vincularUnidadeTipoReceitaEmLote.mockRejectedValueOnce(mockError); // Simula erro na API

    const { result } = renderHook(() => useVincularUnidade(), {wrapper});

    // Executa a mutação em lote
    act(() => {
      result.current.mutationVincularUnidadeEmLote.mutate({ uuid, unidadeUUID: [unidadeUUID] });
    });

    await act(async () => {});

    // Verifica se o modal de erro foi chamado
    expect(CustomModalConfirm).toHaveBeenCalledWith({
      dispatch: expect.any(Function),
      title: "Restrição do tipo de crédito",
      message: "Erro ao vincular unidades",
      cancelText: "Ok",
      dataQa: "modal-restricao-vincular-unidade-ao-tipo-de-credito-em-lote",
    });
  });
});
