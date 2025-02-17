import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalForm from "../ModalForm";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { waitFor } from '@testing-library/react';

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const mockSetFieldValue = jest.fn();
const mockSetShowModalConfirmDelete = jest.fn();

const mockEdit = {
  motivo: "Nome do motivo",
  id: 1,
  uuid: "12345",
  operacao: "edit"
};

const mockCreate = { 
  motivo: "",
  id: null,
  uuid: null,
  operacao: "create",
};

const defaultProps = {
  show: true,
  stateFormModal: mockCreate,
  handleClose: jest.fn(),
  handleSubmitModalForm: jest.fn(),
  setShowModalConfirmDelete: mockSetShowModalConfirmDelete,
  setFieldValue: mockSetFieldValue
};

const defaultPropsEdicao = {
  ...defaultProps,
  stateFormModal: mockEdit
};

describe("Componente ModalForm", () => {

  beforeEach(() => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão True", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    render(<ModalForm {...defaultProps} />);

    expect(screen.getByText("Adicionar motivo de estorno")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome *")).toHaveValue("");
    expect(screen.queryByRole("button", { name: "Apagar" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
    const campos = screen.getAllByRole(/textbox/);
    campos.forEach((campo) => {
      expect(campo).toBeEnabled();
    });
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    render(<ModalForm {...defaultProps} />);

    expect(screen.getByText("Adicionar motivo de estorno")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome *")).toHaveValue("");
    expect(screen.queryByRole("button", { name: "Apagar" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
    const campos = screen.getAllByRole(/textbox/);
    campos.forEach((campo) => {
      expect(campo).toBeDisabled();
    });
  });

  it("Renderiza a Modal quando a operação é Edição e permissão é True", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    render(<ModalForm {...defaultPropsEdicao} />);
    
    expect(screen.getByText("Editar motivo de estorno")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome *")).toHaveValue("Nome do motivo");
    expect(screen.queryByRole("button", { name: "Apagar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
    const campos = screen.getAllByRole(/textbox/);
    campos.forEach((campo) => {
        expect(campo).toBeEnabled();
    });
  });

  it("Renderiza a Modal quando a operação é Edição e permissão é False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    render(<ModalForm {...defaultPropsEdicao} />);

    expect(screen.getByText("Editar motivo de estorno")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome *")).toHaveValue("Nome do motivo");
    expect(screen.queryByRole("button", { name: "Apagar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
    const campos = screen.getAllByRole(/textbox/);
    campos.forEach((campo) => {
      expect(campo).toBeDisabled();
    });
  });

  it("chama handleSubmitModalForm quando o formulario for submetido", async () => {
    render(<ModalForm {...defaultProps} />);

    const input = screen.getByLabelText("Nome *");
    const saveButton = screen.getByRole("button", { name: "Salvar" });

    fireEvent.change(input, { target: { value: "Motivo Teste" } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(defaultProps.handleSubmitModalForm).toHaveBeenCalledTimes(1);
    });
  });

  it("Chama a ação de fechar modal quando o botão Cancelar for clicado", () => {
    render(<ModalForm {...defaultProps} />);

    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelButton);

    expect(defaultProps.handleClose).toHaveBeenCalled();
  });

  test('deve chamar setShowModalConfirmDelete quando o botão for clicado', () => {

    render(<ModalForm {...defaultPropsEdicao}/>);

    const button = screen.getByRole('button', { name: /Apagar/i });

    fireEvent.click(button);

    expect(mockSetShowModalConfirmDelete).toHaveBeenCalledTimes(1);
  });

});
