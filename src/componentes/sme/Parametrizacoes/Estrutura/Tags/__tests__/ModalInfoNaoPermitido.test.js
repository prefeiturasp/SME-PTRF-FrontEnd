import React from "react";
import { render, screen } from "@testing-library/react";
import { ModalInfoNaoPermitido } from "../ModalInfoNaoPermitido";

jest.mock("../../../../../Globais/ModalBootstrap", () => ({
    ModalBootstrap: ({ show, titulo, bodyText, primeiroBotaoOnclick, primeiroBotaoTexto, segundoBotaoOnclick, segundoBotaoTexto }) => (
        <div data-testid="modal-bootstrap" style={{ display: show ? "block" : "none" }}>
            <h1>{titulo}</h1>
            <p>{bodyText}</p>
            <button onClick={primeiroBotaoOnclick}>{primeiroBotaoTexto}</button>
        </div>
    ),
}));

describe("ModalInfoNaoPermitido", () => {
  it("renderiza a Modal passando as props", () => {
    const handleClose = jest.fn();

    render(
      <ModalInfoNaoPermitido
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