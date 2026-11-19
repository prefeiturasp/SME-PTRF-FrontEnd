import { renderHook } from "@testing-library/react";
import { useEstadoElaboracao } from "../useEstadoElaboracao";
import { useGetVigenciaElaboracaoPaa } from "../useGetVigenciaElaboracaoPaa";
import { visoesService } from "../../../../../../services/visoes.service";

jest.mock("../useGetVigenciaElaboracaoPaa");
jest.mock("../../../../../../services/visoes.service", () => ({ visoesService: { getPermissoes: jest.fn() } }));

const vigencia = {
  hoje: "2026-10-28",
  mes_elaboracao_paa: 10,
  proximaVigenciaHabilitada: true,
  periodosSobrepostos: false,
  statusVigenteExigidosParaProximaVigencia: null,
  periodos: [{
    uuid: "p-vig", referencia: "2026", data_inicial: "2026-05-01", data_final: "2027-04-30",
    vigencia: "VIGENTE", paa: null,
  }],
};

describe("useEstadoElaboracao", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    visoesService.getPermissoes.mockReturnValue(true);
  });

  it("sem vigência carregada devolve estado nulo e repassa o carregamento", () => {
    useGetVigenciaElaboracaoPaa.mockReturnValue({ vigencia: undefined, isLoading: true, isError: false });

    const { result } = renderHook(() => useEstadoElaboracao("assoc-1"));

    expect(result.current.estado).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it("calcula uma seção por período, usando a permissão custom_change_paa", () => {
    useGetVigenciaElaboracaoPaa.mockReturnValue({ vigencia, isLoading: false, isError: false });

    const { result } = renderHook(() => useEstadoElaboracao("assoc-1"));

    expect(visoesService.getPermissoes).toHaveBeenCalledWith(["custom_change_paa"]);
    expect(result.current.estado.secoesPeriodos).toHaveLength(1);
    expect(result.current.estado.secoesPeriodos[0].botao).toMatchObject({
      acao: "ELABORAR_NOVO", habilitado: true, periodoUuid: "p-vig",
    });
  });

  it("sem permissão bloqueia o botão de iniciar", () => {
    visoesService.getPermissoes.mockReturnValue(false);
    useGetVigenciaElaboracaoPaa.mockReturnValue({ vigencia, isLoading: false, isError: false });

    const { result } = renderHook(() => useEstadoElaboracao("assoc-1"));

    expect(result.current.estado.secoesPeriodos[0].botao).toMatchObject({
      habilitado: false, motivo: "SEM_PERMISSAO",
    });
  });

  it("repassa o erro da consulta", () => {
    useGetVigenciaElaboracaoPaa.mockReturnValue({ vigencia: undefined, isLoading: false, isError: true });

    const { result } = renderHook(() => useEstadoElaboracao("assoc-1"));

    expect(result.current.isError).toBe(true);
  });
});
