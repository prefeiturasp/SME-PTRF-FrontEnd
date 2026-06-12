import React from "react";
import { render, screen } from "@testing-library/react";
import { ModalConfirmarExclusao } from "../../../../../Globais/ModalAntDesign/ModalConfirmarExclusao";


describe("ModalConfirmDeleteAcaoAssociacao", () => {
  it("renderiza a Modal passando as props", () => {
    const handleClose = jest.fn();

    render(
      <ModalConfirmarExclusao
        open={true}
        onCancel={handleClose}
        titulo="Modal Teste"
        bodyText="Corpo da Modal de Teste"
        cancelText="Fechar"
        okText="Confirma"
        segundoBotaoTexto="Confirma"
        segundoBotaoCss="btn-warning"
      />
    );

    expect(screen.getByTestId("modal-confirmar-exclusao-ant-design")).toBeInTheDocument();
    expect(screen.getByText("Modal Teste")).toBeInTheDocument();
    expect(screen.getByText("Corpo da Modal de Teste")).toBeInTheDocument();
    expect(screen.getByText("Fechar")).toBeInTheDocument();
    expect(screen.getByText("Confirma")).toBeInTheDocument();
  });
});