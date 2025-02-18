import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalFormFornecedores from "../ModalFormFornecedores";
import { waitFor } from '@testing-library/react';
import { mockListaFornecedores, mockCreate } from "../__fixtures__/mockData";

const mockSetFieldValue = jest.fn();
const mockSetShowModalConfirmDelete = jest.fn();

const defaultProps = {
    show: true,
    stateFormModal: mockCreate,
    handleClose: jest.fn(),
    handleSubmitModalFormFornecedores: jest.fn(),
    setShowModalConfirmDeleteFornecedor: mockSetShowModalConfirmDelete,
    setFieldValue: mockSetFieldValue,
    temPermissaoEditarFornecedores: ()=> true,
};

const defaultPropsEdicao = {
  ...defaultProps,
  stateFormModal: {...mockListaFornecedores[0], operacao: 'edit'}
};

describe("Componente ModalForm", () => {

  it("Renderiza a Modal quando a operação é Cadastro e Permissão True", () => {
    render(<ModalFormFornecedores {...defaultProps} />);
    expect(screen.getByText("fornecedor")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    const campoNome = screen.getByLabelText("Nome do Fornecedor *")
    const campoCNPJ = screen.getByLabelText("CPF / CNPJ *")
    expect(campoNome).toHaveValue("");
    expect(campoCNPJ).toHaveValue("");
    expect(campoNome).toBeEnabled();
    expect(campoCNPJ).toBeEnabled();
    expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão False", () => {
    const semPermissao = {
      ...defaultProps,
        temPermissaoEditarFornecedores: ()=> false,
    }
    render(<ModalFormFornecedores {...semPermissao} />);
    expect(screen.getByText("fornecedor")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    const campoNome = screen.getByLabelText("Nome do Fornecedor *")
    expect(campoNome).toHaveValue("");
    expect(campoNome).toBeDisabled();
    const campoCNPJ = screen.getByLabelText("CPF / CNPJ *")
    expect(campoCNPJ).toHaveValue("");
    expect(campoCNPJ).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("Renderiza a Modal quando a operação é Edição e permissão é True", () => {
    render(<ModalFormFornecedores {...defaultPropsEdicao} />);

    expect(screen.getByLabelText("Nome do Fornecedor *")).toHaveValue("Fornecedor abcd-10");
    expect(screen.getByRole("button", { name: "Apagar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
    const campoTexto = screen.getAllByRole(/textbox/);
    expect(campoTexto).toHaveLength(2);
    campoTexto.forEach((campo) => {
        expect(campo).toBeEnabled();
    })
  });

  it("Renderiza a Modal quando a operação é Edição e permissão é False", () => {
    const semPermissao = {
        ...defaultPropsEdicao,
        temPermissaoEditarFornecedores: ()=> false,
    }
    render(<ModalFormFornecedores {...semPermissao} />);
    expect(screen.getByText("Editar fornecedor")).toBeInTheDocument();
    const campoNome = screen.getByLabelText("Nome do Fornecedor *")
    expect(campoNome).toHaveValue("Fornecedor abcd-10");
    expect(campoNome).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Apagar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("chama handleSubmitModalFormFornecedores quando o formulario for submetido", async () => {
    render(<ModalFormFornecedores {...defaultProps} />);
    const campoNome = screen.getByLabelText("Nome do Fornecedor *");
    const campoCNPJ = screen.getByLabelText("CPF / CNPJ *");
    const botaoSalvar = screen.getByRole("button", { name: "Salvar" });
    fireEvent.click(botaoSalvar);
    await waitFor(() => {
      expect(screen.getByText("Nome é obrigatório")).toBeInTheDocument();
      expect(screen.getByText("CPF / CNPJ é obrigatório")).toBeInTheDocument();
    });
    fireEvent.change(campoNome, { target: { value: "Tipo Teste" } });
    expect(campoNome).toHaveValue("Tipo Teste");
    fireEvent.change(campoCNPJ, { target: { value: "01234567890" } });
    expect(campoCNPJ).toHaveValue("012.345.678-90");
    fireEvent.click(botaoSalvar);
    await waitFor(() => {
        expect(defaultProps.handleSubmitModalFormFornecedores).toHaveBeenCalled();
    });
  });

  it("Chama a ação de fechar modal quando o botão Cancelar for clicado", () => {
    render(<ModalFormFornecedores {...defaultProps} />);
    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelButton);
    expect(defaultProps.handleClose).toHaveBeenCalled();
  });

  test('deve chamar setShowModalConfirmDeleteFornecedor quando o botão for clicado', () => {
    // Renderize o componente, passando as props necessárias
    render(<ModalFormFornecedores {...defaultPropsEdicao}/>);
    // Localize o botão
    const button = screen.getByRole('button', { name: /Apagar/i });
    // Simule o clique no botão
    fireEvent.click(button);
    // Verifique se a função setShowModalConfirmDeleteFornecedor foi chamada
    expect(mockSetShowModalConfirmDelete).toHaveBeenCalled();
  });
});
