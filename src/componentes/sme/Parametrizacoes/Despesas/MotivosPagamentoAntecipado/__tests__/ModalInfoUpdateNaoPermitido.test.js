import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalInfoUpdateNaoPermitido } from "../ModalInfoUpdateNaoPermitido";
import { ModalBootstrap } from "../../../../../Globais/ModalBootstrap";

jest.mock("../../../../../Globais/ModalBootstrap", () => ({
    ModalBootstrap: ({ show, titulo, bodyText, primeiroBotaoOnclick, primeiroBotaoTexto, segundoBotaoOnclick, segundoBotaoTexto }) => (
        <div data-testid="modal-bootstrap" style={{ display: show ? "block" : "none" }}>
            <h1>{titulo}</h1>
            <p>{bodyText}</p>
            <button onClick={primeiroBotaoOnclick}>{primeiroBotaoTexto}</button>
        </div>
    ),
}));

describe("ModalInfoUpdateNaoPermitido", () => {
  it("renderiza a Modal passando as props", () => {
    const handleClose = jest.fn();

    render(
      <ModalInfoUpdateNaoPermitido
        show={true}
        handleClose={handleClose}
        titulo="Teste Modal"
        texto="corpo Modal"
        primeiroBotaoTexto="Fechar"
        primeiroBotaoCss="btn-primary"
      />
    );

    expect(screen.getByTestId("modal-bootstrap")).toBeInTheDocument();
    expect(screen.getByText("Teste Modal")).toBeInTheDocument();
    expect(screen.getByText("corpo Modal")).toBeInTheDocument();
    expect(screen.getByText("Fechar")).toBeInTheDocument();
  });
});