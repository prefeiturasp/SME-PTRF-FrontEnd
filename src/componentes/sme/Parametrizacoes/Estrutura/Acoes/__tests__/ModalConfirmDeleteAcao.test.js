import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ModalConfirmDeleteAcao } from "../components/ModalConfirmDeleteAcao";
import { useAcoesContext } from "../hooks/useAcoesContext";

// Mock do hook useAcoesContext
jest.mock("../hooks/useAcoesContext");

// Mock do componente genérico ModalConfirmarExclusao
jest.mock("../../../componentes/ModalConfirmarExclusao", () => ({
  ModalConfirmarExclusao: ({ open, onOk, onCancel, titulo, bodyText, okText, cancelText, cancelButtonProps }) => {
    if (!open) return null;
    return (
      <div data-testid="modal-confirmar-exclusao">
        <h1>{titulo}</h1>
        <div>{bodyText}</div>
        <button onClick={onCancel} className={cancelButtonProps?.className}>
          {cancelText}
        </button>
        <button onClick={onOk}>{okText}</button>
      </div>
    );
  },
}));

describe("Componente <ModalConfirmDeleteAcao />", () => {
  const mockHandleDelete = jest.fn();
  const mockSubmitForm = jest.fn();
  const mockHandleCloseModalConfirmDesabilitarAcao = jest.fn();
  const mockHandleCloseModalDeleteAcao = jest.fn();

  const defaultContextValues = {
    handleDelete: mockHandleDelete,
    submitForm: mockSubmitForm,
    showModalConfirmDesabilitarAcao: { open: false, form: null },
    handleCloseModalConfirmDesabilitarAcao: mockHandleCloseModalConfirmDesabilitarAcao,
    showModalDeleteAcao: false,
    handleCloseModalDeleteAcao: mockHandleCloseModalDeleteAcao,
    modalForm: { uuid: "acao-123-uuid" },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAcoesContext.mockReturnValue(defaultContextValues);
  });

  describe("Cenário: Modal de Desabilitação de Ação", () => {
    beforeEach(() => {
      useAcoesContext.mockReturnValue({
        ...defaultContextValues,
        showModalConfirmDesabilitarAcao: {
          open: true,
          form: { id: 1, nome: "Formulário Exemplo" },
        },
      });
    });

    test("deve renderizar o modal de desabilitar ação quando showModalConfirmDesabilitarAcao.open for true", () => {
      render(<ModalConfirmDeleteAcao />);

      expect(screen.getByText("Desabilitar ação PTRF")).toBeInTheDocument();
      expect(
        screen.getByText(
          /A ação PTRF que deseja desabilitar possui receitas previstas indicadas/i
        )
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Confirmar" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    });

    test("deve aplicar a classe de botão personalizada para desabilitar ação", () => {
      render(<ModalConfirmDeleteAcao />);

      const btnCancelar = screen.getByRole("button", { name: "Cancelar" });
      expect(btnCancelar).toHaveClass("btn-base-verde-outline-desabilita-acao");
    });

    test("deve chamar submitForm com o form correto ao clicar em Confirmar", () => {
      render(<ModalConfirmDeleteAcao />);

      const btnConfirmar = screen.getByRole("button", { name: "Confirmar" });
      fireEvent.click(btnConfirmar);

      expect(mockSubmitForm).toHaveBeenCalledTimes(1);
      expect(mockSubmitForm).toHaveBeenCalledWith({
        id: 1,
        nome: "Formulário Exemplo",
      });
    });

    test("deve chamar handleCloseModalConfirmDesabilitarAcao ao clicar em Cancelar", () => {
      render(<ModalConfirmDeleteAcao />);

      const btnCancelar = screen.getByRole("button", { name: "Cancelar" });
      fireEvent.click(btnCancelar);

      expect(mockHandleCloseModalConfirmDesabilitarAcao).toHaveBeenCalledTimes(1);
    });
  });

  describe("Cenário: Modal de Exclusão de Ação", () => {
    test("deve renderizar o modal de exclusão quando showModalDeleteAcao for true e desabilitação for false", () => {
      useAcoesContext.mockReturnValue({
        ...defaultContextValues,
        showModalDeleteAcao: true,
      });

      render(<ModalConfirmDeleteAcao />);

      expect(screen.getByText("Excluir Ação")).toBeInTheDocument();
      expect(
        screen.getByText("Tem certeza que deseja excluir esta ação?")
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Excluir" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    });

    test("deve aplicar a classe de botão personalizada para exclusão de ação", () => {
      useAcoesContext.mockReturnValue({
        ...defaultContextValues,
        showModalDeleteAcao: true,
      });

      render(<ModalConfirmDeleteAcao />);

      const btnCancelar = screen.getByRole("button", { name: "Cancelar" });
      expect(btnCancelar).toHaveClass("btn-base-verde-outline");
    });

    test("deve chamar handleDelete passando modalForm.uuid ao clicar em Excluir", () => {
      useAcoesContext.mockReturnValue({
        ...defaultContextValues,
        showModalDeleteAcao: true,
        modalForm: { uuid: "acao-uuid-999" },
      });

      render(<ModalConfirmDeleteAcao />);

      const btnExcluir = screen.getByRole("button", { name: "Excluir" });
      fireEvent.click(btnExcluir);

      expect(mockHandleDelete).toHaveBeenCalledTimes(1);
      expect(mockHandleDelete).toHaveBeenCalledWith("acao-uuid-999");
    });

    test("deve chamar handleCloseModalDeleteAcao ao clicar em Cancelar", () => {
      useAcoesContext.mockReturnValue({
        ...defaultContextValues,
        showModalDeleteAcao: true,
      });

      render(<ModalConfirmDeleteAcao />);

      const btnCancelar = screen.getByRole("button", { name: "Cancelar" });
      fireEvent.click(btnCancelar);

      expect(mockHandleCloseModalDeleteAcao).toHaveBeenCalledTimes(1);
    });

    test("não deve exibir o modal se showModalDeleteAcao for false", () => {
      render(<ModalConfirmDeleteAcao />);

      expect(screen.queryByTestId("modal-confirmar-exclusao")).not.toBeInTheDocument();
    });
  });
});