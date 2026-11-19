import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import Relatorios from "../index";
import { visoesService } from "../../../../../../../services/visoes.service";
import { FEATURE_FLAGS } from "../../../../../../../constantes/featureFlags";

jest.mock("../../../../../../../services/visoes.service", () => ({
  visoesService: { featureFlagAtiva: jest.fn() },
}));
jest.mock("../index_novo", () => ({
  __esModule: true,
  default: (p) => <div data-testid="versao-nova" data-prop={p.exemplo} />,
}));
jest.mock("../index_legado", () => ({
  __esModule: true,
  default: (p) => <div data-testid="versao-legada" data-prop={p.exemplo} />,
}));

describe("Relatorios: seleção pela flag paa-proxima-vigencia", () => {
  it("com a flag ligada exibe a versão nova", () => {
    visoesService.featureFlagAtiva.mockReturnValue(true);

    render(<Relatorios />);

    expect(screen.getByTestId("versao-nova")).toBeInTheDocument();
    expect(screen.queryByTestId("versao-legada")).not.toBeInTheDocument();
    expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith(FEATURE_FLAGS.PAA_PROXIMA_VIGENCIA);
  });

  it("com a flag desligada exibe a versão legada", () => {
    visoesService.featureFlagAtiva.mockReturnValue(false);

    render(<Relatorios />);

    expect(screen.getByTestId("versao-legada")).toBeInTheDocument();
    expect(screen.queryByTestId("versao-nova")).not.toBeInTheDocument();
  });

  it("repassa as props à versão exibida", () => {
    visoesService.featureFlagAtiva.mockReturnValue(true);
    render(<Relatorios exemplo="repassada" />);

    expect(screen.getByTestId("versao-nova")).toHaveAttribute("data-prop", "repassada");

    cleanup();
    visoesService.featureFlagAtiva.mockReturnValue(false);
    render(<Relatorios exemplo="repassada" />);

    expect(screen.getByTestId("versao-legada")).toHaveAttribute("data-prop", "repassada");
  });
});
