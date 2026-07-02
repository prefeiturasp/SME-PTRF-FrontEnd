import React from "react";
import { render, screen } from "@testing-library/react";
import { ContasDasAssociacoes } from "../index";

jest.mock("../../../../../../paginas/PaginasContainer", () => ({
  PaginasContainer: ({ children }) => <main>{children}</main>,
}));

jest.mock("../context/ContasDasAssociacoesContext", () => ({
  ContasDasAssociacoesProvider: ({ children }) => <div data-testid="provider">{children}</div>,
}));

jest.mock("../../../componentes/AbasPorRecurso", () => ({
  AbasPorRecurso: ({ extra_abas }) => (
    <div data-testid="abas">{extra_abas?.map((aba) => aba.label).join(",")}</div>
  ),
}));

jest.mock("../components/TopoComBotoes", () => ({
  TopoComBotoes: () => <div>TopoComBotoes</div>,
}));

jest.mock("../components/Filtros", () => ({
  Filtros: () => <div>Filtros</div>,
}));

jest.mock("../components/Lista", () => ({
  Lista: () => <div>Lista</div>,
}));

describe("ContasDasAssociacoes", () => {
  it("renderiza estrutura principal do módulo", () => {
    render(<ContasDasAssociacoes />);

    expect(screen.getByTestId("provider")).toBeInTheDocument();
    expect(screen.getByText("Contas das Associações")).toBeInTheDocument();
    expect(screen.getByTestId("abas")).toHaveTextContent("Cargas de arquivo");
    expect(screen.getByText("TopoComBotoes")).toBeInTheDocument();
    expect(screen.getByText("Filtros")).toBeInTheDocument();
    expect(screen.getByText("Lista")).toBeInTheDocument();
  });
});
