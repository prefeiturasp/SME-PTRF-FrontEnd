import React from "react";
import { render, screen } from "@testing-library/react";
import { PaaPage } from "../index";

jest.mock("../../../PaginasContainer", () => ({
  PaginasContainer: ({ children }) => (
    <div data-testid="paginas-container">{children}</div>
  ),
}));

jest.mock("../../../../componentes/dres/Paa", () => ({
  Paa: () => <div data-testid="paa-component">PAA Component</div>,
}));

describe("PaaPage", () => {
  it("deve renderizar o título corretamente", () => {
    render(<PaaPage />);
    
    const titulo = screen.getByText("Plano Anual de Atividades");
    expect(titulo).toBeInTheDocument();
  });

  it("deve renderizar o componente Paa", () => {
    render(<PaaPage />);
    
    const paa = screen.getByTestId("paa-component");
    expect(paa).toBeInTheDocument();
  });

  it("deve renderizar dentro do PaginasContainer", () => {
    render(<PaaPage />);
    
    const container = screen.getByTestId("paginas-container");
    expect(container).toBeInTheDocument();
  });

  it("deve conter a estrutura da página corretamente", () => {
    render(<PaaPage />);
    
    const titulo = screen.getByRole("heading", {
      name: "Plano Anual de Atividades",
    });
    
    expect(titulo).toHaveClass("titulo-itens-painel");
  });
});