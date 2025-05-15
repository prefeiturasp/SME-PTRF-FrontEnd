import React from "react";
import { render, screen } from "@testing-library/react";
import { FormularioBemProduzido } from "../index";

jest.mock("../../../../Globais/UI", () => ({
  IconButton: ({ label }) => <button>{label}</button>,
}));

jest.mock("../components/Steps", () => ({
  Steps: ({ currentStep }) => (
    <div data-testid="steps">Passo atual: {currentStep}</div>
  ),
}));

jest.mock("../VincularDespesas", () => ({
  VincularDespesas: ({ uuid }) => (
    <div data-testid="vincular-despesas">UUID: {uuid}</div>
  ),
}));

describe("Componente FormularioBemProduzido", () => {
  it("deve renderizar o botão 'Informar valores'", () => {
    render(<FormularioBemProduzido />);
    expect(screen.getByText("Informar valores")).toBeInTheDocument();
  });

  it("deve renderizar o componente Steps com o passo atual", () => {
    render(<FormularioBemProduzido />);
    expect(screen.getByTestId("steps")).toHaveTextContent("Passo atual: 1");
  });

  it("deve renderizar o componente VincularDespesas quando o step é 1", () => {
    render(<FormularioBemProduzido />);
    expect(screen.getByTestId("vincular-despesas")).toHaveTextContent("UUID:");
  });
});
