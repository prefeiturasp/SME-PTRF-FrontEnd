import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Sobre } from "../index";

const pjson = require("../../../../package.json");

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("<Sobre>", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("Deve renderizar o nome do sistema e a versão do package.json", () => {
    render(
      <MemoryRouter>
        <Sobre />
      </MemoryRouter>
    );
    const nome = `Sig Escola - ${pjson.name.toUpperCase()}`;
    expect(screen.getByText(nome)).toBeInTheDocument();
    expect(screen.getByText(pjson.version)).toBeInTheDocument();
    expect(screen.getByText("Versão")).toBeInTheDocument();
  });

  test("Deve navegar para a página inicial ao clicar no botão", () => {
    render(
      <MemoryRouter>
        <Sobre />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Página inicial"));

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
