import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ListaBemProduzido } from "../index";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const RouterWrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;

describe("ListaBemProduzido", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('deve renderizar o botão "Adicionar bem produzido"', () => {
    render(<ListaBemProduzido />, { wrapper: RouterWrapper });

    const button = screen.getByRole("button", {
      name: /adicionar bem produzido/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("btn", "btn-success", "float-right");
  });

  it('deve navegar para "/cadastro-bem-produzido" ao clicar no botão', () => {
    render(<ListaBemProduzido />, { wrapper: RouterWrapper });

    const button = screen.getByRole("button", {
      name: /adicionar bem produzido/i,
    });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/cadastro-bem-produzido");
  });
});
