import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TopoComBotoes } from "../TopoComBotoes";

const mockNavigate = jest.fn();
const mockUseParams = jest.fn();

jest.mock("react-router-dom", () => ({
  useParams: () => mockUseParams(),
  useNavigate: () => mockNavigate,
}));

const mockDados = {
  dados_da_associacao: {
    nome: "Associação Teste",
  },
};

describe("TopoComBotoes", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseParams.mockReset();
  });

  it("deve exibir o nome da associação no título", () => {
    mockUseParams.mockReturnValue({});
    render(<TopoComBotoes dadosDaAssociacao={mockDados} />);

    expect(screen.getByText("Associação Teste")).toBeInTheDocument();
  });

  it("deve navegar para /dre-associacoes quando origem é undefined", () => {
    mockUseParams.mockReturnValue({});
    render(<TopoComBotoes dadosDaAssociacao={mockDados} />);

    fireEvent.click(screen.getByText("Voltar"));

    expect(mockNavigate).toHaveBeenCalledWith("/dre-associacoes");
  });

  it("deve navegar para /dre-relatorio-consolidado-dados-das-ues/:periodo/:conta quando origem é dre-relatorio-consolidado com periodo e conta", () => {
    mockUseParams.mockReturnValue({
      origem: "dre-relatorio-consolidado",
      periodo_uuid: "p1",
      conta_uuid: "c1",
    });
    render(<TopoComBotoes dadosDaAssociacao={mockDados} />);

    fireEvent.click(screen.getByText("Voltar"));

    expect(mockNavigate).toHaveBeenCalledWith(
      "/dre-relatorio-consolidado-dados-das-ues/p1/c1/"
    );
  });

  it("deve navegar com path undefined quando origem é diferente e sem periodo/conta", () => {
    mockUseParams.mockReturnValue({
      origem: "outra-origem",
    });
    render(<TopoComBotoes dadosDaAssociacao={mockDados} />);

    fireEvent.click(screen.getByText("Voltar"));

    expect(mockNavigate).toHaveBeenCalledWith(undefined);
  });
});
