import React from "react";
import { render, screen } from "@testing-library/react";
import { TrilhaDeStatus } from "../TrilhaDeStatus";

describe("TrilhaDeStatus", () => {
  it("renderiza círculos simples e duplos", () => {
    const itens = [
      { status: "A", estilo_css: "simples", titulo: "<b>Título A</b>" },
      { status: "B", estilo_css: "duplo", titulo: "Título B" },
    ];
    const { container } = render(
      <TrilhaDeStatus
        trilhaStatus={{ total_associacoes_dre: 12 }}
        filtraStatus={() => itens}
        retornaClasseCirculoTrilhaStatus={(s) => `cls-${s}`}
        formataNumero={(s) => `n-${s}`}
        retornaCorCirculoTrilhaStatus={(c) => `cor-${c}`}
        eh_circulo_duplo={(c) => c === "duplo"}
      />
    );
    expect(screen.getByText("Prestações de contas das 12 Associações")).toBeInTheDocument();
    expect(screen.getByText("n-A")).toHaveClass("circulo", "cls-A", "cor-simples");
    expect(screen.getByText("n-B")).toHaveClass("circulo", "cls-B", "cor-duplo");
    expect(container.querySelector(".circulo-duplo")).toBeInTheDocument();
    expect(screen.getByText("Título A")).toBeInTheDocument();
    expect(screen.getByText("Título B")).toBeInTheDocument();
  });
});
