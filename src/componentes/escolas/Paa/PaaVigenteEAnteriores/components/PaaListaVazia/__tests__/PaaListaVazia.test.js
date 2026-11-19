import React from "react";
import { render, screen } from "@testing-library/react";
import { PaaListaVazia } from "../PaaListaVazia";

describe("PaaListaVazia", () => {
  it("renderiza a mensagem recebida como filha dentro de um título", () => {
    render(<PaaListaVazia>Nenhum PAA encontrado</PaaListaVazia>);

    const mensagem = screen.getByRole("heading", { level: 4, name: "Nenhum PAA encontrado" });
    expect(mensagem).toBeInTheDocument();
    expect(mensagem).toHaveClass("paa-lista-vazia__mensagem");
  });

  it("renderiza conteúdo JSX como mensagem", () => {
    render(
      <PaaListaVazia>
        <strong>Sem PAA</strong> no período
      </PaaListaVazia>
    );

    expect(screen.getByText("Sem PAA")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent("Sem PAA no período");
  });

  it("renderiza a imagem de lista vazia", () => {
    render(<PaaListaVazia>Mensagem</PaaListaVazia>);

    const imagem = screen.getByAltText("Lista vazia");
    expect(imagem).toBeInTheDocument();
    expect(imagem).toHaveClass("img-fluid");
  });

  it("renderiza o título vazio quando não recebe filhas", () => {
    render(<PaaListaVazia />);

    expect(screen.getByRole("heading", { level: 4 })).toBeEmptyDOMElement();
    expect(screen.getByAltText("Lista vazia")).toBeInTheDocument();
  });
});
