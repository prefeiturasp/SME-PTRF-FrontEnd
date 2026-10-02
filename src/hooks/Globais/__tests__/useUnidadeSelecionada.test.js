import { renderHook } from "@testing-library/react";
import useUnidadeSelecionada from "../useUnidadeSelecionada";

const visoesService = {
  getDadosDoUsuarioLogado: jest.fn(),
};

describe("useUnidadeSelecionada", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve identificar a unidade selecionada como SME", () => {
    visoesService.getDadosDoUsuarioLogado.mockReturnValue({
      unidade_selecionada: { tipo_unidade: "SME", uuid: "sme-1" },
    });

    const { result } = renderHook(() => useUnidadeSelecionada(visoesService));

    expect(result.current.isSME()).toBe(true);
    expect(result.current.isDRE()).toBe(false);
    expect(result.current.getUUIDUnidadeSelecionadaTipoDRE()).toBeNull();
  });

  it("deve identificar a DRE e devolver o uuid da unidade", () => {
    visoesService.getDadosDoUsuarioLogado.mockReturnValue({
      unidade_selecionada: { tipo_unidade: "DRE", uuid: "dre-9" },
    });

    const { result } = renderHook(() => useUnidadeSelecionada(visoesService));

    expect(result.current.isSME()).toBe(false);
    expect(result.current.isDRE()).toBe(true);
    expect(result.current.getUUIDUnidadeSelecionadaTipoDRE()).toBe("dre-9");
  });

  it("deve tratar unidade educacional e usuário sem unidade selecionada", () => {
    visoesService.getDadosDoUsuarioLogado.mockReturnValue({
      unidade_selecionada: { tipo_unidade: "UE", uuid: "ue-1" },
    });

    const { result } = renderHook(() => useUnidadeSelecionada(visoesService));

    expect(result.current.isSME()).toBe(false);
    expect(result.current.isDRE()).toBe(false);
    expect(result.current.getUUIDUnidadeSelecionadaTipoDRE()).toBeNull();

    visoesService.getDadosDoUsuarioLogado.mockReturnValue({});
    expect(result.current.isSME()).toBe(false);
    expect(result.current.getUUIDUnidadeSelecionadaTipoDRE()).toBeNull();
  });
});
