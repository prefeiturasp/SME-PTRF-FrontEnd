import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PreviaDocumentos from "../PreviaDocumento";
import { visoesService } from "../../../../services/visoes.service";

jest.mock("../../../../services/visoes.service", () => ({
  visoesService: { getPermissoes: jest.fn() },
}));

describe("PreviaDocumento", () => {
  it("habilitado com permissão e chama gerarPrevia", () => {
    visoesService.getPermissoes.mockReturnValue(true);
    const gerar = jest.fn();
    render(<PreviaDocumentos gerarPreviaConsolidadoDre={gerar} />);
    const btn = screen.getByRole("button", { name: "Prévias" });
    expect(btn).toBeEnabled();
    fireEvent.click(btn);
    expect(gerar).toHaveBeenCalled();
    expect(visoesService.getPermissoes).toHaveBeenCalledWith(["gerar_relatorio_consolidado_dre"]);
  });

  it("desabilitado sem permissão", () => {
    visoesService.getPermissoes.mockReturnValue(false);
    render(<PreviaDocumentos gerarPreviaConsolidadoDre={jest.fn()} />);
    expect(screen.getByRole("button", { name: "Prévias" })).toBeDisabled();
  });
});
