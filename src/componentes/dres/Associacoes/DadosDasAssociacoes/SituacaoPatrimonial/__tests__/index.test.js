import React from "react";
import { render, screen } from "@testing-library/react";
import { SituacaoPatrimonialUnidadeEducacional } from "../index";

jest.mock("../../../../../Globais/Dashborard", () => ({
  Dashboard: () => <div data-testid="dashboard" />,
}));

jest.mock("react-router-dom", () => ({
  Navigate: () => null,
}));

jest.mock("../../../../../../services/auth.service", () => ({
  DADOS_DA_ASSOCIACAO: "dados_da_associacao",
}));

jest.mock("../../../../../escolas/SituacaoPatrimonial/ListaBemProduzido", () => ({
  ListaBemProduzido: (props) => (
    <div data-testid="lista-bem-produzido">{String(props.visao_dre)}</div>
  ),
}));

describe("SituacaoPatrimonialUnidadeEducacional", () => {
  it("deve renderizar o título da seção", () => {
    render(<SituacaoPatrimonialUnidadeEducacional />);

    expect(
      screen.getByText("Situação Patrimonial da Associação")
    ).toBeInTheDocument();
  });

  it("deve renderizar ListaBemProduzido com visao_dre=true", () => {
    render(<SituacaoPatrimonialUnidadeEducacional />);

    const lista = screen.getByTestId("lista-bem-produzido");
    expect(lista).toBeInTheDocument();
    expect(lista).toHaveTextContent("true");
  });
});
