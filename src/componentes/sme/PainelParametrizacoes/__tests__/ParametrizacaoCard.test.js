import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ParametrizacaoCard } from "../ParametrizacaoCard";
import { visoesService } from "../../../../services/visoes.service";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(),
    featureFlagAtiva: jest.fn(),
  },
}));

const itens = [
  {
    parametro: "Tipos de crédito",
    url: "parametrizacoes/tipos-de-credito",
    icone: "icone-credito.svg",
    permissoes: ["view_tipodecredito"],
  },
  {
    parametro: "Motivos de estorno",
    url: "parametrizacoes/motivos-estorno",
    icone: "icone-estorno.svg",
    permissoes: ["view_motivoestorno"],
    featureFlag: "motivos-estorno",
  },
];

describe("ParametrizacaoCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    visoesService.getPermissoes.mockReturnValue(true);
    visoesService.featureFlagAtiva.mockReturnValue(true);
  });

  const renderCards = () =>
    render(
      <MemoryRouter>
        <ParametrizacaoCard itensParametrizacao={itens} nomeGrupo="Receitas" />
      </MemoryRouter>
    );

  it("deve exibir apenas os parâmetros permitidos e abrir a tela ao selecionar o card", async () => {
    const user = userEvent.setup();
    visoesService.getPermissoes.mockImplementation(
      (permissoes) => permissoes[0] === "view_tipodecredito"
    );

    renderCards();

    expect(screen.getByRole("heading", { name: "Receitas" })).toBeInTheDocument();
    expect(screen.getByText("Tipos de crédito")).toBeInTheDocument();
    expect(screen.queryByText("Motivos de estorno")).not.toBeInTheDocument();

    await user.click(screen.getByText("Tipos de crédito"));

    expect(mockNavigate).toHaveBeenCalledWith("/parametrizacoes/tipos-de-credito");
  });

  it("deve ocultar o parâmetro quando a feature flag está desligada", () => {
    visoesService.featureFlagAtiva.mockReturnValue(false);

    renderCards();

    expect(screen.getByText("Tipos de crédito")).toBeInTheDocument();
    expect(screen.queryByText("Motivos de estorno")).not.toBeInTheDocument();
    expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith("motivos-estorno");
  });

  it("deve exibir o parâmetro quando a permissão e a feature flag estão ativas", () => {
    renderCards();

    expect(screen.getByText("Tipos de crédito")).toBeInTheDocument();
    expect(screen.getByText("Motivos de estorno")).toBeInTheDocument();
  });
});
