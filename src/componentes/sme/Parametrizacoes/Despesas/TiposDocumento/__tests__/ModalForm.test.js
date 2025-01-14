import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalForm from "../ModalForm"; // Ajuste o caminho, se necessário.
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { waitFor } from '@testing-library/react';

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const mockEdit = {
  nome: "Nome do tipo",
  numero_documento_digitado: false,
  apenas_digitos: false,
  documento_comprobatorio_de_despesa: false,
  pode_reter_imposto: false,
  eh_documento_de_retencao_de_imposto: false,
  id: 1,
  uuid: "12345",
  operacao: "edit"
};

const mockCreate = { 
  nome: "",
  operacao: "create",
  id: null
};

describe("Componente ModalForm", () => {
  const defaultProps = {
    show: true,
    stateFormModal: mockCreate,
    handleClose: jest.fn(),
    handleSubmitModalForm: jest.fn(),
    setShowModalConfirmDelete: jest.fn(),
  };
  const defaultPropsEdicao = {
    ...defaultProps,
    stateFormModal: mockEdit
  };

  beforeEach(() => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão True", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    render(<ModalForm {...defaultProps} />);

    expect(screen.getByText("Adicionar tipo de documento")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome *")).toHaveValue("");
    expect(screen.queryByRole("button", { name: "Apagar" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getAllByLabelText("Sim").length).toEqual(5);
    expect(screen.getAllByLabelText("Não").length).toEqual(5);
    
    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
    const campos = screen.getAllByRole(/textbox|radio/);
    campos.forEach((campo) => {
        expect(campo).toBeEnabled();
    });
  });
  
  it("Renderiza a Modal quando a operação é Cadastro e Permissão False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    render(<ModalForm {...defaultProps} />);

    expect(screen.getByText("Adicionar tipo de documento")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome *")).toHaveValue("");
    expect(screen.queryByRole("button", { name: "Apagar" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getAllByLabelText("Sim").length).toEqual(5);
    expect(screen.getAllByLabelText("Não").length).toEqual(5);
    
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
    const campos = screen.getAllByRole(/textbox|radio/);
    campos.forEach((campo) => {
        expect(campo).toBeDisabled();
    });
});

it("Renderiza a Modal quando a operação é Edição e permissão é True", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    render(<ModalForm {...defaultPropsEdicao} />);
    
    expect(screen.getByText("Editar tipo de documento")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome *")).toHaveValue("Nome do tipo");
    expect(screen.queryByRole("button", { name: "Apagar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getAllByLabelText("Sim").length).toEqual(5);
    expect(screen.getAllByLabelText("Não").length).toEqual(5);

    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
    const campos = screen.getAllByRole(/textbox|radio/);
    campos.forEach((campo) => {
        expect(campo).toBeEnabled();
    });
  });

  it("Renderiza a Modal quando a operação é Edição e permissão é False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    render(<ModalForm {...defaultPropsEdicao} />);
    
    expect(screen.getByText("Editar tipo de documento")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome *")).toHaveValue("Nome do tipo");
    expect(screen.queryByRole("button", { name: "Apagar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getAllByLabelText("Sim").length).toEqual(5);
    expect(screen.getAllByLabelText("Não").length).toEqual(5);

    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
    const campos = screen.getAllByRole(/textbox|radio/);
    campos.forEach((campo) => {
        expect(campo).toBeDisabled();
    });
  });

  it("chama handleSubmitModalForm quando o formulario for submetido", async () => {
    render(<ModalForm {...defaultProps} />);

    const input = screen.getByLabelText("Nome *");
    const saveButton = screen.getByRole("button", { name: "Salvar" });

    fireEvent.change(input, { target: { value: "Documento Teste" } });
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


});