import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useGetTiposCredito,
  useGetTiposCreditoQuePossuemDetalhamento,
} from "../useGetTiposCredito";
import {
  getTiposDeCredito,
  getTiposDeCreditoQueAceitamDetalhamento,
} from "../../../../../../../services/sme/Parametrizacoes.service";

jest.mock("../../../../../../../services/sme/Parametrizacoes.service", () => ({
  getTiposDeCredito: jest.fn(),
  getTiposDeCreditoQueAceitamDetalhamento: jest.fn(),
}));

const criarWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useGetTiposCredito", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("não deve consultar a API quando o recurso não foi selecionado", async () => {
    const { result } = renderHook(
      () => useGetTiposCredito({ filters: { currentPage: 1 } }),
      { wrapper: criarWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(getTiposDeCredito).not.toHaveBeenCalled();
    expect(result.current.results).toEqual([]);
    expect(result.current.total).toBe(0);
  });

  it("deve consultar os tipos de crédito convertendo tipo, classificação e unidade", async () => {
    getTiposDeCredito.mockResolvedValue({
      count: 1,
      results: [{ id: 7, nome: "Repasse" }],
    });

    const { result } = renderHook(
      () =>
        useGetTiposCredito({
          filters: {
            currentPage: 2,
            recurso_uuid: "recurso-1",
            nome: "Repasse",
            tipo: "e_repasse",
            classificacao: "aceita_capital",
            unidades__uuid: { uuid: "selecao", unidade: { uuid: "unidade-9" } },
          },
        }),
      { wrapper: criarWrapper() }
    );

    await waitFor(() => expect(result.current.results).toEqual([{ id: 7, nome: "Repasse" }]));

    expect(getTiposDeCredito).toHaveBeenCalledWith(
      {
        nome: "Repasse",
        recurso_uuid: "recurso-1",
        e_repasse: 1,
        aceita_capital: 1,
        unidades__uuid: "unidade-9",
        uso_associacao: 0,
      },
      2
    );
    expect(result.current.total).toBe(1);
    expect(result.current.isError).toBe(false);
  });

  it.each([
    ["e_estorno", { e_estorno: 1 }],
    ["e_devolucao", { e_devolucao: 1 }],
    ["e_rendimento", { e_rendimento: 1 }],
  ])("deve marcar o filtro %s na consulta", async (tipo, esperado) => {
    getTiposDeCredito.mockResolvedValue({ count: 0, results: [] });

    renderHook(
      () =>
        useGetTiposCredito({
          filters: { currentPage: 1, recurso_uuid: "recurso-1", tipo },
        }),
      { wrapper: criarWrapper() }
    );

    await waitFor(() => expect(getTiposDeCredito).toHaveBeenCalled());
    expect(getTiposDeCredito).toHaveBeenCalledWith(
      expect.objectContaining(esperado),
      1
    );
  });

  it.each([
    ["aceita_custeio", { aceita_custeio: 1 }],
    ["aceita_livre", { aceita_livre: 1 }],
  ])("deve marcar a classificação %s na consulta", async (classificacao, esperado) => {
    getTiposDeCredito.mockResolvedValue({ count: 0, results: [] });

    renderHook(
      () =>
        useGetTiposCredito({
          filters: { currentPage: 1, recurso_uuid: "recurso-1", classificacao },
        }),
      { wrapper: criarWrapper() }
    );

    await waitFor(() => expect(getTiposDeCredito).toHaveBeenCalled());
    expect(getTiposDeCredito).toHaveBeenCalledWith(
      expect.objectContaining(esperado),
      1
    );
  });

  it("deve sinalizar erro quando a consulta de tipos de crédito falha", async () => {
    getTiposDeCredito.mockRejectedValue(new Error("falha"));

    const { result } = renderHook(
      () =>
        useGetTiposCredito({
          filters: { currentPage: 1, recurso_uuid: "recurso-1" },
        }),
      { wrapper: criarWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useGetTiposCreditoQuePossuemDetalhamento", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("não deve consultar o detalhamento sem recurso selecionado", async () => {
    const { result } = renderHook(
      () => useGetTiposCreditoQuePossuemDetalhamento({}),
      { wrapper: criarWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(getTiposDeCreditoQueAceitamDetalhamento).not.toHaveBeenCalled();
    expect(result.current.results).toEqual([]);
  });

  it("deve retornar os tipos de crédito que aceitam detalhamento", async () => {
    getTiposDeCreditoQueAceitamDetalhamento.mockResolvedValue([{ id: 3 }]);

    const { result } = renderHook(
      () => useGetTiposCreditoQuePossuemDetalhamento({ recurso_uuid: "recurso-1" }),
      { wrapper: criarWrapper() }
    );

    await waitFor(() => expect(result.current.results).toEqual([{ id: 3 }]));
    expect(getTiposDeCreditoQueAceitamDetalhamento).toHaveBeenCalledWith("recurso-1");
  });
});
