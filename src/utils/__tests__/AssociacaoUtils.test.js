import { getUuidAssociacao, getDadosAssociacao } from "../AssociacaoUtils";
import { visoesService } from "../../services/visoes.service";
import { ASSOCIACAO_UUID, DADOS_DA_ASSOCIACAO } from "../../services/auth.service";

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock do visoesService
jest.mock("../../services/visoes.service", () => ({
  visoesService: {
    getItemUsuarioLogado: jest.fn(),
  },
}));

describe("AssociacaoUtils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUuidAssociacao", () => {
    it("deve retornar UUID quando visão é UE", () => {
      visoesService.getItemUsuarioLogado.mockReturnValue("UE");
      localStorageMock.getItem.mockReturnValue("uuid-ue");

      const result = getUuidAssociacao();

      expect(result).toBe("uuid-ue");
      expect(localStorageMock.getItem).toHaveBeenCalledWith(ASSOCIACAO_UUID);
    });

    it("deve retornar UUID quando visão é DRE", () => {
      const mockData = { dados_da_associacao: { uuid: "uuid-dre" } };
      visoesService.getItemUsuarioLogado.mockReturnValue("DRE");
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData));

      const result = getUuidAssociacao();

      expect(result).toBe("uuid-dre");
      expect(localStorageMock.getItem).toHaveBeenCalledWith(DADOS_DA_ASSOCIACAO);
    });

    it("deve retornar null para outras visões", () => {
      visoesService.getItemUsuarioLogado.mockReturnValue("OUTRA");

      const result = getUuidAssociacao();

      expect(result).toBe(null);
    });
  });

  describe("getDadosAssociacao", () => {
    it("deve retornar dados quando visão é UE", () => {
      visoesService.getItemUsuarioLogado.mockReturnValue("UE");
      localStorageMock.getItem.mockReturnValue("uuid-ue");

      const result = getDadosAssociacao();

      expect(result).toEqual({ uuid: "uuid-ue" });
    });

    it("deve retornar dados completos quando visão é DRE", () => {
      const mockData = { dados_da_associacao: { uuid: "uuid-dre", nome: "Teste" } };
      visoesService.getItemUsuarioLogado.mockReturnValue("DRE");
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData));

      const result = getDadosAssociacao();

      expect(result).toEqual({ uuid: "uuid-dre", nome: "Teste" });
    });

    it("deve retornar null para outras visões", () => {
      visoesService.getItemUsuarioLogado.mockReturnValue("OUTRA");

      const result = getDadosAssociacao();

      expect(result).toBe(null);
    });
  });
});
