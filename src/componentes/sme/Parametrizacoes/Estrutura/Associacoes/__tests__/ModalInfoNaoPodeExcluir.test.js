import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalInfoExclusaoNaoPermitida } from "../ModalInfoExclusaoNaoPermitida";
import { ModalBootstrap } from "../../../../../Globais/ModalBootstrap";

jest.mock("../../../../../Globais/ModalBootstrap", () => ({
    ModalBootstrap: ({ show, onHide, titulo, bodyText, primeiroBotaoOnclick, primeiroBotaoTexto, primeiroBotaoCss }) => (
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
      <ModalInfoExclusaoNaoPermitida
        show={true}
        handleClose={handleClose}
        titulo="Test Modal"
        texto="Texto body"
        primeiroBotaoTexto="Close"
        primeiroBotaoCss="btn-primary"
      />
    );

    expect(screen.getByTestId("modal-bootstrap")).toBeInTheDocument();
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Texto body")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();
  });
});