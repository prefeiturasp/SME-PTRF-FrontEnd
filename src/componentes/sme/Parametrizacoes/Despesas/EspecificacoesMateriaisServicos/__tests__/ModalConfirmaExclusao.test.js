import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalConfirmacaoExclusao } from "../components/ModalConfirmacaoExclusao";
import { MateriaisServicosContext } from "../context/MateriaisServicos";
import { mockData } from "../__fixtures__/mockData";

const mockHandleExcluir = jest.fn();
const setShowModalConfirmacaoExclusao = jest.fn();
const item_data = mockData.results[0];
const mockContextValue = {
  showModalConfirmacaoExclusao: true,
  setShowModalConfirmacaoExclusao,
  stateFormModal: item_data,
};

describe("ModalConfirmacaoExclusao", () => {
    const renderComponent = () => {
      return render(
          <MateriaisServicosContext.Provider value={mockContextValue}>
            <ModalConfirmacaoExclusao handleExcluir={mockHandleExcluir} />
          </MateriaisServicosContext.Provider>
        );
    }
  it("deve exibir a modal com o texto de confirmação", () => {
    renderComponent();

    expect(screen.getByText("Excluir especificação")).toBeInTheDocument();
    expect(screen.getByText("Deseja realmente excluir esta especificação de materiais e serviços?")).toBeInTheDocument();
  });

  it("deve fechar a modal ao clicar no botão 'Cancelar'", () => {
    renderComponent();

    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(setShowModalConfirmacaoExclusao).toHaveBeenCalledWith(false);
  });

  it("deve chamar a função de exclusão ao clicar no botão 'Excluir' quando não há uuid", () => {
    const contextFormSemId = {
      ...mockContextValue,
      stateFormModal: { ...item_data, uuid: undefined }
    };
    render(
      <MateriaisServicosContext.Provider value={contextFormSemId}>
        <ModalConfirmacaoExclusao handleExcluir={mockHandleExcluir} />
      </MateriaisServicosContext.Provider>
    );
    const deleteButton = screen.getByRole("button", { name: /excluir/i });
    fireEvent.click(deleteButton);

    expect(mockHandleExcluir).not.toHaveBeenCalledWith(item_data.uuid);
  });

  it("deve chamar a função de exclusão ao clicar no botão 'Excluir'", () => {
    renderComponent();

    const deleteButton = screen.getByRole("button", { name: /excluir/i });
    fireEvent.click(deleteButton);

    expect(setShowModalConfirmacaoExclusao).toHaveBeenCalledWith(false);
    expect(mockHandleExcluir).toHaveBeenCalledWith(item_data.uuid);
  });
});