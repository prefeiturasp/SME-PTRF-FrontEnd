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
  associacao: "ba8b96ef-f05c-41f3-af10-73753490c545",
  associacao_nome: "Associaçao 123",
  tipo_conta: "ba8b96ef-f05c-41f3-af10-73753490c544",
  status: "ATIVA",
  banco_nome: "Santander",
  agencia: "0001",
  numero_conta: "12345-2",
  numero_cartao: "1234432112344321",
  id: 1,
  uuid: "ba8b96ef-f05c-41f3-af10-73753490c543",
  operacao: "edit"
};

const mockCreate = { 
  associacao: null,
  associacao_nome: "",
  tipo_conta: null,
  status: null,
  banco_nome: "",
  agencia: "",
  numero_conta: "",
  numero_cartao: "",
  id: null,
  uuid: null,
  operacao: "create",
};

const listaTiposDeContaData = [{
    uuid: 'ba8b96ef-f05c-41f3-af10-73753490c511',
    nome: 'Tipo 1',
},
{
    uuid: 'ba8b96ef-f05c-41f3-af10-73753490c522',
    nome: 'Tipo 2',
}];

const defaultProps = {
  show: true,
  stateFormModal: mockCreate,
  handleClose: jest.fn(),
  handleSubmitModalForm: jest.fn(),
  setShowModalDelete: mockSetShowModalConfirmDelete,
  setFieldValue: mockSetFieldValue,
  listaTiposDeConta: listaTiposDeContaData
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

    expect(screen.getByText("Adicionar conta de associação")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.getByLabelText("Associação *")).toHaveValue("");
    expect(screen.getByLabelText("Banco")).toHaveValue("");
    expect(screen.getByLabelText("Agência")).toHaveValue("");
    expect(screen.getByLabelText("Conta")).toHaveValue("");
    expect(screen.getByLabelText("Cartão")).toHaveValue("");
    expect(screen.queryByRole("button", { name: "Apagar" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
    const campos = screen.getAllByRole(/textbox|radio/);
    campos.forEach((campo) => {
      expect(campo).toBeEnabled();
    });
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    render(<ModalForm {...defaultProps} />);

    expect(screen.getByText("Adicionar conta de associação")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.getByLabelText("Associação *")).toHaveValue("");
    expect(screen.getByLabelText("Banco")).toHaveValue("");
    expect(screen.getByLabelText("Agência")).toHaveValue("");
    expect(screen.getByLabelText("Conta")).toHaveValue("");
    expect(screen.getByLabelText("Cartão")).toHaveValue("");
    expect(screen.queryByRole("button", { name: "Apagar" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("Renderiza a Modal quando a operação é Edição e permissão é True", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    render(<ModalForm {...defaultPropsEdicao} />);
    
    expect(screen.getByText("Editar conta de associação")).toBeInTheDocument();
    expect(screen.getByLabelText("Associação *")).toHaveValue("ba8b96ef-f05c-41f3-af10-73753490c545");
    expect(screen.getByLabelText("Banco")).toHaveValue("Santander");
    expect(screen.getByLabelText("Agência")).toHaveValue("0001");
    expect(screen.getByLabelText("Conta")).toHaveValue("12345-2");
    expect(screen.getByLabelText("Cartão")).toHaveValue("1234432112344321");
    expect(screen.queryByRole("button", { name: "Apagar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
  });

  it("Renderiza a Modal quando a operação é Edição e permissão é False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    render(<ModalForm {...defaultPropsEdicao} />);

    expect(screen.getByText("Editar conta de associação")).toBeInTheDocument();
    expect(screen.getByLabelText("Associação *")).toHaveValue("ba8b96ef-f05c-41f3-af10-73753490c545");
    expect(screen.getByLabelText("Banco")).toHaveValue("Santander");
    expect(screen.getByLabelText("Agência")).toHaveValue("0001");
    expect(screen.getByLabelText("Conta")).toHaveValue("12345-2");
    expect(screen.getByLabelText("Cartão")).toHaveValue("1234432112344321");
    expect(screen.queryByRole("button", { name: "Apagar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("chama handleSubmitModalForm quando o formulario for submetido", async () => {
    render(<ModalForm {...defaultProps} />);

    const input_associacao = screen.getByLabelText("Associação *");
    const input_tipo_conta = screen.getByLabelText("Tipos de conta *");
    const input_status = screen.getByLabelText("Status *");
    const input_banco = screen.getByLabelText("Banco");
    const saveButton = screen.getByRole("button", { name: "Salvar" });

    fireEvent.change(input_associacao, { target: { value: "ba8b96ef-f05c-41f3-af10-73753490c545" } });
    fireEvent.change(input_tipo_conta, { target: { value: "ba8b96ef-f05c-41f3-af10-73753490c522" } });
    fireEvent.change(input_status, { target: { value: "ATIVA" } });
    fireEvent.change(input_banco, { target: { value: "Santander" } });
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

    // Renderize o componente, passando as props necessárias
    render(<ModalForm {...defaultPropsEdicao}/>);

    // Localize o botão
    const button = screen.getByRole('button', { name: /Apagar/i });

    // Simule o clique no botão
    fireEvent.click(button);

    // Verifique se a função setShowModalConfirmDelete foi chamada
    expect(mockSetShowModalConfirmDelete).toHaveBeenCalledTimes(1);
  });

});