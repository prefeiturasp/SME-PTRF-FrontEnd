import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalInfoNaoPodeExcluir } from "../ModalInfoNaoPodeExcluir";

jest.mock("../../../../../Globais/ModalBootstrap", () => ({
    ModalBootstrap: ({ show, titulo, bodyText, primeiroBotaoOnclick, primeiroBotaoTexto, segundoBotaoOnclick, segundoBotaoTexto }) => (
        <div data-testid="modal-bootstrap" style={{ display: show ? "block" : "none" }}>
            <h1>{titulo}</h1>
            <p>{bodyText}</p>
            <button onClick={primeiroBotaoOnclick}>{primeiroBotaoTexto}</button>
        </div>
    ),
}));

describe("ModalInfoNaoPodeExcluir", () => {
  it("renderiza a Modal passando as props", () => {
    const handleClose = jest.fn();

    render(
      <ModalInfoNaoPodeExcluir
        show={true}
        handleClose={handleClose}
        titulo="Test Modal"
        texto="This is a test modal body"
        primeiroBotaoTexto="Close"
        primeiroBotaoCss="btn-primary"
      />
    );

    expect(screen.getByTestId("modal-bootstrap")).toBeInTheDocument();
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("This is a test modal body")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();
  });
});