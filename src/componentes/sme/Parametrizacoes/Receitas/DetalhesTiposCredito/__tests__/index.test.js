import React from "react";
import { render, screen } from "@testing-library/react";
import { ParametrizacoesDetalhesTiposCredito } from "../index";

jest.mock("../context/DetalhesTiposCredito", () => ({
  DetalhesTipoCreditoProvider: ({ children }) => <div data-testid="context-provider">{children}</div>
}));

jest.mock("../../../../../../paginas/PaginasContainer", () => ({
  PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>
}));

jest.mock("../components/TopoComBotoes", () => ({
  TopoComBotoes: () => <div data-testid="topo-com-botoes" />
}));

jest.mock("../../../componentes/AbasPorRecurso", () => ({
  AbasPorRecurso: () => <div data-testid="abas-por-recurso" />
}));

jest.mock("../components/Filtros", () => ({
  Filtros: () => <div data-testid="filtros" />
}));

jest.mock("../components/Lista", () => ({
  Lista: () => <div data-testid="lista" />
}));

describe("ParametrizacoesDetalhesTiposCredito", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderização Básica", () => {
    it("deve renderizar página principal", () => {
      const { container } = render(<ParametrizacoesDetalhesTiposCredito />);
      expect(container).toBeInTheDocument();
    });

    it("deve renderizar sem erros", () => {
      expect(() => {
        render(<ParametrizacoesDetalhesTiposCredito />);
      }).not.toThrow();
    });
  });

  describe("Estrutura de Componentes", () => {
    it("deve envolver com Context Provider", () => {
      render(<ParametrizacoesDetalhesTiposCredito />);
      expect(screen.getByTestId("context-provider")).toBeInTheDocument();
    });

    it("deve envolver com PaginasContainer", () => {
      render(<ParametrizacoesDetalhesTiposCredito />);
      expect(screen.getByTestId("paginas-container")).toBeInTheDocument();
    });

    it("deve renderizar TopoComBotoes", () => {
      render(<ParametrizacoesDetalhesTiposCredito />);
      expect(screen.getByTestId("topo-com-botoes")).toBeInTheDocument();
    });

    it("deve renderizar AbasPorRecurso", () => {
      render(<ParametrizacoesDetalhesTiposCredito />);
      expect(screen.getByTestId("abas-por-recurso")).toBeInTheDocument();
    });

    it("deve renderizar Filtros", () => {
      render(<ParametrizacoesDetalhesTiposCredito />);
      expect(screen.getByTestId("filtros")).toBeInTheDocument();
    });

    it("deve renderizar Lista", () => {
      render(<ParametrizacoesDetalhesTiposCredito />);
      expect(screen.getByTestId("lista")).toBeInTheDocument();
    });
  });

  describe("Composição", () => {
    it("deve ter todos os componentes necessários", () => {
      render(<ParametrizacoesDetalhesTiposCredito />);
      
      expect(screen.getByTestId("context-provider")).toBeInTheDocument();
      expect(screen.getByTestId("paginas-container")).toBeInTheDocument();
      expect(screen.getByTestId("topo-com-botoes")).toBeInTheDocument();
      expect(screen.getByTestId("abas-por-recurso")).toBeInTheDocument();
      expect(screen.getByTestId("filtros")).toBeInTheDocument();
      expect(screen.getByTestId("lista")).toBeInTheDocument();
    });
  });
});
