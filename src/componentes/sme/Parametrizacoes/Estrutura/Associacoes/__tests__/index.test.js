import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Associacoes } from "..";

jest.mock("../context/AssociacaoListagem", () => ({
  AssociacaoListagemProvider: ({ children }) => (
    <div data-testid="associacao-listagem-provider">{children}</div>
  ),
}));

jest.mock("../components/BtnAddAssociacoes", () => ({
  BtnAddAssociacoes: () => <button>Adicionar Associacao</button>,
}));

jest.mock("../components/Filtros", () => ({
  Filtros: () => <div data-testid="filtros-associacoes" />,
}));

jest.mock("../components/TabelaAssociacoes", () => ({
  TabelaAssociacoes: () => <div data-testid="tabela-associacoes" />,
}));

jest.mock("../../../../../Globais/MenuInterno", () => ({
  MenuInterno: () => <nav data-testid="menu-interno" />,
}));

describe("Pagina de associacoes", () => {
  it("renderiza a estrutura da listagem dentro do provider", () => {
    render(
      <MemoryRouter>
        <Associacoes />
      </MemoryRouter>
    );

    expect(screen.getByTestId("associacao-listagem-provider")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Associações" })).toBeInTheDocument();
    expect(screen.getByTestId("menu-interno")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adicionar Associacao" })).toBeInTheDocument();
    expect(screen.getByTestId("filtros-associacoes")).toBeInTheDocument();
    expect(screen.getByTestId("tabela-associacoes")).toBeInTheDocument();
  });
});
