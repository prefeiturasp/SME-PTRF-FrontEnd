import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Retificar } from "../index";
import { visoesService } from "../../../../../services/visoes.service";

jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: { getPermissoes: jest.fn() },
}));

jest.mock("react-tooltip", () => ({
  Tooltip: () => <div data-testid="tooltip" />,
}));

const renderIt = (consolidadoDre) =>
  render(<MemoryRouter><Retificar consolidadoDre={consolidadoDre} /></MemoryRouter>);

describe("Retificar", () => {
  beforeEach(() => {
    visoesService.getPermissoes.mockReturnValue(true);
  });

  it("não renderiza sem consolidadoDre", () => {
    renderIt(undefined);
    expect(screen.queryByText("Retificar")).not.toBeInTheDocument();
  });

  it("não renderiza se não exibe botão", () => {
    renderIt({ uuid: "u", exibe_botao_retificar: false });
    expect(screen.queryByText("Retificar")).not.toBeInTheDocument();
  });

  it("não renderiza sem permissão de acesso", () => {
    visoesService.getPermissoes.mockReturnValue(false);
    renderIt({ uuid: "u", exibe_botao_retificar: true, habilita_retificar: true });
    expect(screen.queryByText("Retificar")).not.toBeInTheDocument();
  });

  it("renderiza botão habilitado com link e tooltip", () => {
    renderIt({ uuid: "u1", exibe_botao_retificar: true, habilita_retificar: true, tooltip_habilita_retificar: "dica" });
    expect(screen.getByRole("link")).toHaveAttribute("href", "/dre-relatorio-consolidado-retificacao/u1");
    expect(screen.getByRole("button")).toBeEnabled();
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("desabilitado quando habilita_retificar é falso, sem tooltip", () => {
    renderIt({ uuid: "u1", exibe_botao_retificar: true, habilita_retificar: false });
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.queryByTestId("tooltip")).not.toBeInTheDocument();
  });

  it("desabilitado sem permissão de alteração", () => {
    visoesService.getPermissoes.mockImplementation((p) => p[0] !== "change_relatorio_consolidado_dre");
    renderIt({ uuid: "u1", exibe_botao_retificar: true, habilita_retificar: true });
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
