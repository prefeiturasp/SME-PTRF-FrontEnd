import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalConfirmUpdateObservacao } from "../ModalConfirmUpdateObservacao";
import { ModalBootstrap } from "../../../../../Globais/ModalBootstrap";

jest.mock("../../../../../Globais/ModalBootstrap", () => ({
    ModalBootstrap: ({ show, onHide, titulo, bodyText, primeiroBotaoOnclick, primeiroBotaoTexto, primeiroBotaoCss, segundoBotaoOnclick, segundoBotaoCss, segundoBotaoTexto }) => (
        <div data-testid="modal-bootstrap" style={{ display: show ? "block" : "none" }}>
            <h1>{titulo}</h1>
            <p>{bodyText}</p>
            <button onClick={primeiroBotaoOnclick}>{primeiroBotaoTexto}</button>
        </div>
    ),
}));

describe("Modal confirma Update Observacao", () => {
  it("renderiza a Modal passando as props", () => {
    const handleClose = jest.fn();
    const onUpdateObservacao = jest.fn();
    render(
      <ModalConfirmUpdateObservacao
        show={true}
        handleClose={handleClose}
        onUpdateObservacaoTrue={onUpdateObservacao}
        titulo="Test Modal"
        texto="Texto body"
        primeiroBotaoTexto="Confirmar"
        primeiroBotaoCss="success"
        segundoBotaoCss="outline-success"
        segundoBotaoTexto="Cancelar"
      />
    );

    expect(screen.getByTestId("modal-bootstrap")).toBeInTheDocument();
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Texto body")).toBeInTheDocument();
    expect(screen.getByText("Confirmar")).toBeInTheDocument();
  });
});