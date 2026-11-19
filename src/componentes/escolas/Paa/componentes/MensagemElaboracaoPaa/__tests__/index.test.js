import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { MensagemElaboracaoPaa } from "..";

const renderiza = (botao) => render(<MemoryRouter><MensagemElaboracaoPaa botao={botao} /></MemoryRouter>);

describe("MensagemElaboracaoPaa", () => {
  it("não renderiza sem botão", () => {
    expect(renderiza(null).container).toBeEmptyDOMElement();
  });

  it("não renderiza com o botão habilitado", () => {
    expect(renderiza({ habilitado: true, mensagem: "Qualquer" }).container).toBeEmptyDOMElement();
  });

  it("não renderiza sem mensagem", () => {
    expect(renderiza({ habilitado: false, mensagem: "" }).container).toBeEmptyDOMElement();
  });

  it("mostra a mensagem do bloqueio", () => {
    renderiza({ habilitado: false, mensagem: "Motivo do bloqueio" });

    expect(screen.getByTestId("mensagem-bloqueio-elaboracao")).toHaveTextContent("Motivo do bloqueio");
  });
});
