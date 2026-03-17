import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { ModalConcluirAcertoPC } from "../ModalConcluirAcertoPC";

describe("ModalConcluirAcertoPC", () => {
  it("renderiza corretamente o título, texto e botão do ModalBootstrap", () => {
    const handleClose = jest.fn();

    render(
      <ModalConcluirAcertoPC
        show
        handleClose={handleClose}
        titulo="Título teste"
        texto="Texto do corpo"
        primeiroBotaoTexto="Fechar"
        primeiroBotaoCss="btn-primary"
      />
    );

    expect(screen.getByText("Título teste")).toBeInTheDocument();
    expect(screen.getByText("Texto do corpo")).toBeInTheDocument();
    expect(screen.getByText("Fechar")).toBeInTheDocument();
  });
});

