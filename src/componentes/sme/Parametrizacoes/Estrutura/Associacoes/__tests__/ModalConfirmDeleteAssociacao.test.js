import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalConfirmDeleteAssociacao } from "../ModalConfirmDeleteAssociacao";
import { ModalBootstrap } from "../../../../../Globais/ModalBootstrap";

jest.mock("../../../../../Globais/ModalBootstrap", () => ({
    ModalBootstrap: ({ show, onHide, titulo, bodyText, primeiroBotaoOnclick, primeiroBotaoTexto, primeiroBotaoCss, segundoBotaoOnclick, segundoBotaoCss, segundoBotaoTexto }) => (
        <div data-testid="modal-bootstrap" style={{ display: show ? "block" : "none" }}>
            <h1>{titulo}</h1>
            <p>{bodyText}</p>
            <button onClick={primeiroBotaoOnclick}>{primeiroBotaoTexto}</button>
            <button onClick={segundoBotaoOnclick}>{segundoBotaoTexto}</button>
        </div>
    ),
}));

describe("ModalInfoNaoPodeExcluir", () => {
  it("renderiza a Modal passando as props", () => {
    const handleClose = jest.fn();

    render(
      <ModalConfirmDeleteAssociacao
        show={true}
        handleClose={handleClose}
        onDeleteAssociacaoTrue={handleClose}
        titulo="Test Modal"
        texto="Texto body"
        primeiroBotaoTexto="Close"
        primeiroBotaoCss="btn-primary"
        segundoBotaoCss="danger"
        segundoBotaoTexto="Excluir"
      />
    );

    expect(screen.getByTestId("modal-bootstrap")).toBeInTheDocument();
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Texto body")).toBeInTheDocument();
    expect(screen.getByText("Excluir")).toBeInTheDocument();
  });
});