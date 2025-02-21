import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalConfirmacaoExclusao } from "../components/ModalConfirmacaoExclusao";
import { MotivosDevolucaoTesouroContext } from "../context/MotivosDevolucaoTesouro";

const mockHandleExcluirMotivo = jest.fn();

const mockContextValue = {
  showModalConfirmacaoExclusao: true,
  setShowModalConfirmacaoExclusao: jest.fn(),
  stateFormModal: { uuid: "123" },
};

describe("ModalConfirmacaoExclusao", () => {
  it("deve exibir a modal com o texto de confirmação", () => {
    render(
      <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
        <ModalConfirmacaoExclusao handleExcluirMotivo={mockHandleExcluirMotivo} />
      </MotivosDevolucaoTesouroContext.Provider>
    );

    expect(screen.getByText("Excluir motivo")).toBeInTheDocument();
    expect(screen.getByText("Deseja realmente excluir este motivo?")).toBeInTheDocument();
  });

  it("deve fechar a modal ao clicar no botão 'Cancelar'", () => {
    render(
      <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
        <ModalConfirmacaoExclusao handleExcluirMotivo={mockHandleExcluirMotivo} />
      </MotivosDevolucaoTesouroContext.Provider>
    );

    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(mockContextValue.setShowModalConfirmacaoExclusao).toHaveBeenCalledWith(false);
  });

  it("deve chamar a função de exclusão ao clicar no botão 'Excluir'", () => {
    render(
      <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
        <ModalConfirmacaoExclusao handleExcluirMotivo={mockHandleExcluirMotivo} />
      </MotivosDevolucaoTesouroContext.Provider>
    );

    const deleteButton = screen.getByRole("button", { name: /excluir/i });
    fireEvent.click(deleteButton);

    expect(mockContextValue.setShowModalConfirmacaoExclusao).toHaveBeenCalledWith(false);
    expect(mockHandleExcluirMotivo).toHaveBeenCalledWith("123");
  });
});
