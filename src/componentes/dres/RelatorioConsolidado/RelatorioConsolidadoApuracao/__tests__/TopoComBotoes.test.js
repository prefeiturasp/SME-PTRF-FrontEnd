import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { TopoComBotoes } from "../TopoComBotoes";

describe("TopoComBotoes Component", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    delete window.location;
    window.location = { assign: jest.fn() };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  it("deve renderizar o nome do período e da conta", () => {
    render(<TopoComBotoes periodoNome="2025.1" contaNome="Cheque" />);

    expect(
      screen.getByRole("heading", { name: "Período 2025.1 | Conta Cheque" })
    ).toBeInTheDocument();
  });

  it("deve redirecionar para o relatório consolidado ao clicar em Voltar", () => {
    render(<TopoComBotoes periodoNome="2025.1" contaNome="Cheque" />);

    fireEvent.click(screen.getByRole("button", { name: "Voltar" }));

    expect(window.location.assign).toHaveBeenCalledWith("/dre-relatorio-consolidado");
  });
});
