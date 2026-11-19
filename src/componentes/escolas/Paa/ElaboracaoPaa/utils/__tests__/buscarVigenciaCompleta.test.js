import { buscarVigenciaCompleta } from "../buscarVigenciaCompleta";
import { getVigenciaElaboracaoPaa } from "../../../../../../services/escolas/Paa.service";

jest.mock("../../../../../../services/escolas/Paa.service", () => ({
  getVigenciaElaboracaoPaa: jest.fn(),
}));

const pagina = (numero, totalPaginas, results) => ({
  hoje: "2026-10-28",
  mes_elaboracao_paa: 10,
  proxima_vigencia_habilitada: true,
  periodos_sobrepostos: false,
  periodos: { count: 3, page: numero, page_size: 20, total_pages: totalPaginas, results },
});

describe("buscarVigenciaCompleta", () => {
  beforeEach(() => jest.clearAllMocks());

  it("faz uma única chamada quando há uma página", async () => {
    getVigenciaElaboracaoPaa.mockResolvedValueOnce(pagina(1, 1, [{ uuid: "a" }]));

    const vigenciaElaboracao = await buscarVigenciaCompleta("assoc-1");

    expect(getVigenciaElaboracaoPaa).toHaveBeenCalledTimes(1);
    expect(getVigenciaElaboracaoPaa).toHaveBeenCalledWith("assoc-1", 1);
    expect(vigenciaElaboracao).toEqual({
      hoje: "2026-10-28",
      mes_elaboracao_paa: 10,
      proximaVigenciaHabilitada: true,
      periodosSobrepostos: false,
      periodos: [{ uuid: "a" }],
    });
  });

  it("junta as páginas na ordem", async () => {
    getVigenciaElaboracaoPaa
      .mockResolvedValueOnce(pagina(1, 3, [{ uuid: "a" }]))
      .mockResolvedValueOnce(pagina(2, 3, [{ uuid: "b" }]))
      .mockResolvedValueOnce(pagina(3, 3, [{ uuid: "c" }]));

    const vigenciaElaboracao = await buscarVigenciaCompleta("assoc-1");

    expect(getVigenciaElaboracaoPaa).toHaveBeenCalledTimes(3);
    expect(vigenciaElaboracao.periodos.map((periodo) => periodo.uuid)).toEqual(["a", "b", "c"]);
  });

  it("propaga o erro de qualquer página", async () => {
    getVigenciaElaboracaoPaa
      .mockResolvedValueOnce(pagina(1, 2, [{ uuid: "a" }]))
      .mockRejectedValueOnce(new Error("falhou"));

    await expect(buscarVigenciaCompleta("assoc-1")).rejects.toThrow("falhou");
  });
});
