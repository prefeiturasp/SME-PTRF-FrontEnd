import { getPaaAtivoUuid, getDadosPaaAtivo, gravarPaaAtivo, limparPaaAtivo } from "../paaAtivoStorage";
import { visoesService } from "../../services/visoes.service";
import { FEATURE_FLAGS } from "../../constantes/featureFlags";

jest.mock("../../services/visoes.service", () => ({
  visoesService: { featureFlagAtiva: jest.fn() },
}));

const comFlag = (ativa) => visoesService.featureFlagAtiva.mockImplementation(
  (flag) => ativa && flag === FEATURE_FLAGS.PAA_PROXIMA_VIGENCIA);

describe("paaAtivoStorage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  describe("com a flag paa-proxima-vigencia ligada (sessionStorage, uma cópia por aba)", () => {
    beforeEach(() => comFlag(true));

    it("sem PAA ativo devolve null", () => {
      expect(getPaaAtivoUuid()).toBeNull();
      expect(getDadosPaaAtivo()).toBeNull();
    });

    it("consulta a flag do PAA da próxima vigência", () => {
      getPaaAtivoUuid();

      expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith(FEATURE_FLAGS.PAA_PROXIMA_VIGENCIA);
    });

    it("grava uuid e dados na aba (sessionStorage), não no localStorage compartilhado", () => {
      gravarPaaAtivo({ uuid: "paa-1", texto: "a" });

      expect(getPaaAtivoUuid()).toBe("paa-1");
      expect(getDadosPaaAtivo()).toEqual({ uuid: "paa-1", texto: "a" });
      expect(sessionStorage.getItem("PAA")).toBe("paa-1");
      expect(localStorage.getItem("PAA")).toBeNull();
      expect(localStorage.getItem("DADOS_PAA")).toBeNull();
    });

    it("trocar de PAA substitui o uuid e os dados por completo", () => {
      gravarPaaAtivo({ uuid: "paa-vigente", texto: "vigente", campoSoDoVigente: 1 });
      gravarPaaAtivo({ uuid: "paa-proxima", texto: "proxima" });

      expect(getPaaAtivoUuid()).toBe("paa-proxima");
      expect(getDadosPaaAtivo()).toEqual({ uuid: "paa-proxima", texto: "proxima" });
    });

    it("dados corrompidos viram null em vez de quebrar a tela", () => {
      sessionStorage.setItem("DADOS_PAA", "{nao-e-json");

      expect(getDadosPaaAtivo()).toBeNull();
    });

    it("ignora o PAA que está no localStorage", () => {
      localStorage.setItem("PAA", "paa-legado");

      expect(getPaaAtivoUuid()).toBeNull();
    });

    it("limpar remove o PAA da aba e as chaves do localStorage", () => {
      gravarPaaAtivo({ uuid: "paa-1" });
      localStorage.setItem("PAA", "legado");
      localStorage.setItem("DADOS_PAA", "{}");

      limparPaaAtivo();

      expect(getPaaAtivoUuid()).toBeNull();
      expect(getDadosPaaAtivo()).toBeNull();
      expect(localStorage.getItem("PAA")).toBeNull();
      expect(localStorage.getItem("DADOS_PAA")).toBeNull();
    });
  });

  describe("com a flag paa-proxima-vigencia desligada (comportamento legado: localStorage)", () => {
    beforeEach(() => comFlag(false));

    it("sem PAA ativo devolve null", () => {
      expect(getPaaAtivoUuid()).toBeNull();
      expect(getDadosPaaAtivo()).toBeNull();
    });

    it("grava uuid e dados no localStorage, como antes", () => {
      gravarPaaAtivo({ uuid: "paa-1", texto: "a" });

      expect(localStorage.getItem("PAA")).toBe("paa-1");
      expect(JSON.parse(localStorage.getItem("DADOS_PAA"))).toEqual({ uuid: "paa-1", texto: "a" });
      expect(sessionStorage.getItem("PAA")).toBeNull();
      expect(sessionStorage.getItem("DADOS_PAA")).toBeNull();
    });

    it("lê o PAA gravado diretamente no localStorage", () => {
      localStorage.setItem("PAA", "paa-legado");
      localStorage.setItem("DADOS_PAA", JSON.stringify({ uuid: "paa-legado" }));

      expect(getPaaAtivoUuid()).toBe("paa-legado");
      expect(getDadosPaaAtivo()).toEqual({ uuid: "paa-legado" });
    });

    it("ignora o PAA que está no sessionStorage", () => {
      sessionStorage.setItem("PAA", "paa-da-aba");

      expect(getPaaAtivoUuid()).toBeNull();
    });

    it("dados corrompidos viram null em vez de quebrar a tela", () => {
      localStorage.setItem("DADOS_PAA", "{nao-e-json");

      expect(getDadosPaaAtivo()).toBeNull();
    });

    it("limpar remove o PAA do localStorage", () => {
      gravarPaaAtivo({ uuid: "paa-1" });

      limparPaaAtivo();

      expect(getPaaAtivoUuid()).toBeNull();
      expect(localStorage.getItem("PAA")).toBeNull();
      expect(localStorage.getItem("DADOS_PAA")).toBeNull();
    });
  });

  it("sem a flag nem usuário logado, usa o armazenamento legado", () => {
    visoesService.featureFlagAtiva.mockReturnValue(false);

    gravarPaaAtivo({ uuid: "paa-1" });

    expect(localStorage.getItem("PAA")).toBe("paa-1");
  });
});
