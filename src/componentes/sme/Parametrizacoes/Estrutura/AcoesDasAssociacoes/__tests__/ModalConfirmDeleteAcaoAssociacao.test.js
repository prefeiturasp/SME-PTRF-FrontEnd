import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalConfirmDeleteAcaoAssociacao } from "../ModalConfirmDeleteAcaoAssociacao";
import { ModalBootstrap } from "../../../../../Globais/ModalBootstrap";

jest.mock("../../../../../Globais/ModalBootstrap", () => ({
    ModalBootstrap: ({show, titulo, bodyText,
      primeiroBotaoOnclick, primeiroBotaoTexto, primeiroBotaoCss,
      segundoBotaoOnclick, segundoBotaoTexto, segundoBotaoCss }) => (
        <div data-testid="modal-bootstrap" style={{ display: show ? "block" : "none" }}>
            <h1>{titulo}</h1>
            <p>{bodyText}</p>
            <button className={primeiroBotaoCss} onClick={primeiroBotaoOnclick}>{primeiroBotaoTexto}</button>
            <button className={segundoBotaoCss} onClick={segundoBotaoOnclick}>{segundoBotaoTexto}</button>
        </div>
    ),
}));

describe("ModalConfirmDeleteAcaoAssociacao", () => {
  it("renderiza a Modal passando as props", () => {
    const handleClose = jest.fn();

    render(
      <ModalConfirmDeleteAcaoAssociacao
        show={true}
        handleClose={handleClose}
        titulo="Modal Teste"
        texto="Corpo da Modal de Teste"
        primeiroBotaoTexto="Fechar"
        primeiroBotaoCss="btn-primary"
        segundoBotaoTexto="Confirma"
        segundoBotaoCss="btn-warning"
      />
    );

    expect(screen.getByTestId("modal-bootstrap")).toBeInTheDocument();
    expect(screen.getByText("Modal Teste")).toBeInTheDocument();
    expect(screen.getByText("Corpo da Modal de Teste")).toBeInTheDocument();
    expect(screen.getByText("Fechar")).toBeInTheDocument();
    expect(screen.getByText("Confirma")).toBeInTheDocument();
  });
});