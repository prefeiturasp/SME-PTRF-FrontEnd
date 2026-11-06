import { auxGetNomes } from "../auxGetNomes";
import { getPeriodos } from "../../../../services/dres/Dashboard.service";
import { getTiposConta } from "../../../../services/dres/RelatorioConsolidado.service";
import { exibeDataPT_BR } from "../../../../utils/ValidacoesAdicionaisFormularios";

jest.mock("../../../../services/dres/Dashboard.service", () => ({ getPeriodos: jest.fn() }));
jest.mock("../../../../services/dres/RelatorioConsolidado.service", () => ({ getTiposConta: jest.fn() }));
jest.mock("../../../../utils/ValidacoesAdicionaisFormularios", () => ({ exibeDataPT_BR: jest.fn() }));

describe("auxGetNomes.nomePeriodo", () => {
  beforeEach(() => {
    exibeDataPT_BR.mockImplementation((d) => `fmt(${d})`);
  });

  it("retorna undefined sem uuid", async () => {
    expect(await auxGetNomes.nomePeriodo(null)).toBeUndefined();
    expect(getPeriodos).not.toHaveBeenCalled();
  });

  it("monta nome com datas", async () => {
    getPeriodos.mockResolvedValue([{ uuid: "p1", referencia: "2024.1", data_inicio_realizacao_despesas: "a", data_fim_realizacao_despesas: "b" }]);
    expect(await auxGetNomes.nomePeriodo("p1")).toBe("2024.1 - fmt(a) até fmt(b)");
  });

  it("usa '-' sem datas", async () => {
    getPeriodos.mockResolvedValue([{ uuid: "p1", referencia: "2024.1" }]);
    expect(await auxGetNomes.nomePeriodo("p1")).toBe("2024.1 - - até -");
  });

  it("retorna undefined quando lista de períodos é vazia", async () => {
    getPeriodos.mockResolvedValue([]);
    expect(await auxGetNomes.nomePeriodo("p1")).toBeUndefined();
  });
});

describe("auxGetNomes.nomeConta", () => {
  it("retorna nome da conta", async () => {
    getTiposConta.mockResolvedValue([{ uuid: "c1", nome: "Cheque" }]);
    expect(await auxGetNomes.nomeConta("c1")).toBe("Cheque");
  });

  it("retorna undefined com lista vazia", async () => {
    getTiposConta.mockResolvedValue([]);
    expect(await auxGetNomes.nomeConta("c1")).toBeUndefined();
  });

  it("captura erro (conta não encontrada ou falha de API)", async () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});
    getTiposConta.mockResolvedValue([{ uuid: "c1", nome: "Cheque" }]);
    expect(await auxGetNomes.nomeConta("inexistente")).toBeUndefined();
    getTiposConta.mockRejectedValue(new Error("falha"));
    expect(await auxGetNomes.nomeConta("c1")).toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });
});
