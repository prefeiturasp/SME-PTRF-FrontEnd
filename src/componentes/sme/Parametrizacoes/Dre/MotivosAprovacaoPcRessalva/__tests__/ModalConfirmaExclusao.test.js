import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalConfirmacaoExclusao } from "../components/ModalConfirmacaoExclusao";
import { MotivosAprovacaoPcRessalvaContext } from "../context/MotivosAprovacaoPcRessalva";

const itemMock = { uuid: "123", motivo: "Motivo de exclusão", id: 1 };
const contexto = {
  showModalConfirmacaoExclusao: true,
  setShowModalConfirmacaoExclusao: jest.fn(),
  stateFormModal: itemMock,
  handleExcluirMotivo: jest.fn(),
};

describe("ModalConfirmacaoExclusao", () => {
    const renderComponent = () => {
      return render(
          <MotivosAprovacaoPcRessalvaContext.Provider value={contexto}>
            <ModalConfirmacaoExclusao handleExcluirMotivo={contexto.handleExcluirMotivo} />
          </MotivosAprovacaoPcRessalvaContext.Provider>
        );
    }
  it("deve exibir a modal com o texto de confirmação", () => {
    renderComponent();

    expect(screen.getByText("Excluir motivo")).toBeInTheDocument();
    expect(screen.getByText("Deseja realmente excluir este motivo?")).toBeInTheDocument();
  });

  it("deve fechar a modal ao clicar no botão 'Cancelar'", () => {
    renderComponent();

    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(contexto.setShowModalConfirmacaoExclusao).toHaveBeenCalledWith(false);
  });

 
  it("deve chamar a função de exclusão ao clicar no botão 'Excluir'", () => {
    renderComponent();

    const deleteButton = screen.getByRole("button", { name: /excluir/i });
    fireEvent.click(deleteButton);

    expect(contexto.setShowModalConfirmacaoExclusao).toHaveBeenCalledWith(false);
    expect(contexto.handleExcluirMotivo).toHaveBeenCalledWith(itemMock.uuid);
  });
});