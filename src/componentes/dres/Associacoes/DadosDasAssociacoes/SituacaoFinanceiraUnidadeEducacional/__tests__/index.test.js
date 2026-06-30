import React from "react";
import { render, screen } from "@testing-library/react";
import { SituacaoFinanceiraUnidadeEducacional } from "../index";

jest.mock("../../../../../Globais/Dashborard", () => ({
  Dashboard: () => <div data-testid="dashboard" />,
}));

jest.mock("react-router-dom", () => ({
  Navigate: () => null,
}));

jest.mock("../../../../../../services/auth.service", () => ({
  DADOS_DA_ASSOCIACAO: "dados_da_associacao",
}));

const mockDados = {
  dados_da_associacao: {
    nome: "Associação Teste",
  },
};

describe("SituacaoFinanceiraUnidadeEducacional", () => {
  it("deve renderizar o título da seção", () => {
    render(<SituacaoFinanceiraUnidadeEducacional dadosDaAssociacao={mockDados} />);

    expect(
      screen.getByText("Situação financeira da associação")
    ).toBeInTheDocument();
  });

  it("deve renderizar o componente Dashboard", () => {
    render(<SituacaoFinanceiraUnidadeEducacional dadosDaAssociacao={mockDados} />);

    expect(screen.getByTestId("dashboard")).toBeInTheDocument();
  });
});
