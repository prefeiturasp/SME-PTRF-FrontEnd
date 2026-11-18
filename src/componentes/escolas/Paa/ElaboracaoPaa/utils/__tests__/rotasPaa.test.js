import { rotaElaboracaoPaa } from "../rotasPaa";
import { visoesService } from "../../../../../../services/visoes.service";
import { FEATURE_FLAGS } from "../../../../../../constantes/featureFlags";

jest.mock("../../../../../../services/visoes.service", () => ({
  visoesService: { featureFlagAtiva: jest.fn() },
}));

describe("rotaElaboracaoPaa", () => {
  it("com a flag ligada devolve a rota com o uuid do PAA", () => {
    visoesService.featureFlagAtiva.mockReturnValue(true);

    expect(rotaElaboracaoPaa("paa-1")).toBe("/elaborar-novo-paa/paa-1");
    expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith(FEATURE_FLAGS.PAA_PROXIMA_VIGENCIA);
  });

  it("com a flag desligada devolve a rota legada, sem uuid", () => {
    visoesService.featureFlagAtiva.mockReturnValue(false);

    expect(rotaElaboracaoPaa("paa-1")).toBe("/elaborar-novo-paa");
  });

  it("com a flag desligada ignora o uuid, mesmo indefinido", () => {
    visoesService.featureFlagAtiva.mockReturnValue(false);

    expect(rotaElaboracaoPaa(undefined)).toBe("/elaborar-novo-paa");
  });
});
