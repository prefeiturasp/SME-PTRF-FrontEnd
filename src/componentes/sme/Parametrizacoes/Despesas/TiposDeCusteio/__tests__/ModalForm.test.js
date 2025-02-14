import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalForm from "../ModalForm";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { waitFor } from '@testing-library/react';
import { mockEdit, mockCreate } from "../__fixtures__/mockData";

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const mockSetFieldValue = jest.fn();
const mockSetShowModalConfirmDelete = jest.fn();

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

    expect(screen.getByText("Adicionar tipo de despesa de custeio")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    const campoNome = screen.getByLabelText("Nome *")
    expect(campoNome).toHaveValue("");
    expect(campoNome).toBeEnabled();
    expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    render(<ModalForm {...defaultProps} />);

    expect(screen.getByText("Adicionar tipo de despesa de custeio")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    const campoNome = screen.getByLabelText("Nome *")
    expect(campoNome).toHaveValue("");
    expect(campoNome).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("Renderiza a Modal quando a operação é Edição e permissão é True", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    render(<ModalForm {...defaultPropsEdicao} />);
    
    expect(screen.getByText("Editar tipo de despesa de custeio")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome *")).toHaveValue("Tipo Custeio c524");
    expect(screen.queryByRole("button", { name: "Apagar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
    const campoTexto = screen.getByRole(/textbox/);
    expect(campoTexto).toBeEnabled();


  });

  it("Renderiza a Modal quando a operação é Edição e permissão é False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    render(<ModalForm {...defaultPropsEdicao} />);

    expect(screen.getByText("Editar tipo de despesa de custeio")).toBeInTheDocument();
    const campoNome = screen.getByLabelText("Nome *")
    expect(campoNome).toHaveValue("Tipo Custeio c524");
    expect(campoNome).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Apagar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("chama handleSubmitModalForm quando o formulario for submetido", async () => {
    render(<ModalForm {...defaultProps} />);

    const campoNome = screen.getByLabelText("Nome *");
    const botaoSalvar = screen.getByRole("button", { name: "Salvar" });

    fireEvent.click(botaoSalvar);
    await waitFor(() => {
      expect(screen.getByText("Nome é obrigatório")).toBeInTheDocument();
    });

    fireEvent.change(campoNome, { target: { value: "Tipo Teste" } });
    fireEvent.click(botaoSalvar);

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

    // Renderize o componente, passando as props necessárias
    render(<ModalForm {...defaultPropsEdicao}/>);

    // Localize o botão
    const button = screen.getByRole('button', { name: /Apagar/i });

    // Simule o clique no botão
    fireEvent.click(button);

    // Verifique se a função setShowModalConfirmDelete foi chamada
    expect(mockSetShowModalConfirmDelete).toHaveBeenCalled();
  });

});
