import React from "react";
import { render, screen } from "@testing-library/react";
import { TituloTabela } from "../TituloTabela";

describe("TituloTabela", () => {
  it("renderiza o título", () => {
    render(<TituloTabela titulo="Meu título" />);
    expect(screen.getByText("Meu título")).toHaveClass("titulo-tabelas");
  });
});
