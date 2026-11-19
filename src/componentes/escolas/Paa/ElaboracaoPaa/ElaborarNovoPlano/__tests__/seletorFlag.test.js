import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ElaborarNovoPlano } from "../index";
import { visoesService } from "../../../../../../services/visoes.service";
import { FEATURE_FLAGS } from "../../../../../../constantes/featureFlags";

jest.mock("../../../../../../services/visoes.service", () => ({
  visoesService: { featureFlagAtiva: jest.fn() },
}));
jest.mock("../index_novo", () => ({
  __esModule: true,
  ElaborarNovoPlanoNovo: () => <div data-testid="versao-nova" />,
}));
jest.mock("../index_legado", () => ({
  __esModule: true,
  ElaborarNovoPlanoLegado: () => <div data-testid="versao-legada" />,
}));

describe("ElaborarNovoPlano: seleção pela flag paa-proxima-vigencia", () => {
  it("com a flag ligada exibe a versão nova", () => {
    visoesService.featureFlagAtiva.mockReturnValue(true);

    render(<ElaborarNovoPlano />);

    expect(screen.getByTestId("versao-nova")).toBeInTheDocument();
    expect(screen.queryByTestId("versao-legada")).not.toBeInTheDocument();
    expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith(FEATURE_FLAGS.PAA_PROXIMA_VIGENCIA);
  });

  it("com a flag desligada exibe a versão legada", () => {
    visoesService.featureFlagAtiva.mockReturnValue(false);

    render(<ElaborarNovoPlano />);

    expect(screen.getByTestId("versao-legada")).toBeInTheDocument();
    expect(screen.queryByTestId("versao-nova")).not.toBeInTheDocument();
  });
});
