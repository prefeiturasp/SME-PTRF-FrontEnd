import React from "react";
import { render, screen } from "@testing-library/react";
import { ParametrizacoesMotivosDeEstorno } from "../index";

jest.mock("../context/MotivosEstorno", () => ({
  MotivosEstornoProvider: ({ children }) => (
    <div data-testid="motivos-estorno-provider">{children}</div>
  ),
}));

jest.mock("../../../../../../paginas/PaginasContainer", () => ({
  PaginasContainer: (({ children }) => <div data-testid="paginas-container">{children}</div>)
}));

jest.mock("../Lista", () => ({
  Lista: () => <div data-testid="lista-component"></div>,
}));

describe("ParametrizacoesMotivosDeEstorno", () => {
  it("deve renderizar o título e o componente Lista dentro do provider", () => {
    render(<ParametrizacoesMotivosDeEstorno />);
    expect(screen.getByTestId("motivos-estorno-provider")).toBeInTheDocument();
    expect(screen.getByText("Motivos de estorno")).toBeInTheDocument();
    expect(screen.getByTestId("paginas-container")).toBeInTheDocument();
    expect(screen.getByTestId("lista-component")).toBeInTheDocument();
  });
});
