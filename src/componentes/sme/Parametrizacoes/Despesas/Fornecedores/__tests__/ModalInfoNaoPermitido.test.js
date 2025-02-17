import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalInfoNaoPermitido } from "../ModalInfoNaoPermitido";

const handleClose = jest.fn();

describe("ModalInfoNaoPermitido", () => {
  it("renderiza a Modal passando as props", () => {
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
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("This is a test modal body")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close"));
    expect(handleClose).toHaveBeenCalled();
  });
});