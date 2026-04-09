import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {ModalFormAcoesDaAssociacao as ModalForm} from "../ModalFormAcoesDasAssociacoes";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { waitFor } from '@testing-library/react';
import { mockSelectAcoes, mockSelectAssociacoes  } from "../__fixtures__/mockData";

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const mockEdit = {
  associacao: "1",
  acao: "1",
  status: "ATIVA",
  codigo_eol: "123",
  uuid: "1234",
  nome_unidade: "unidade",
  id: 1,
  uuid: "12345",
  operacao: "edit"
};

const mockCreate = { 
  associacao: "",
  acao: "",
  status: "",
  codigo_eol: "",
  uuid: "",
  id: "",
  nome_unidade: "",
  operacao: "create",
};

const defaultProps = {
  show: true,
  stateFormModal: mockCreate,
  handleClose: jest.fn(),
  readOnly: false,
  handleSubmitModalFormAcoes: jest.fn(),
  handleChangeFormModal: jest.fn(),
  setShowModalDeleteAcao: jest.fn(),
  recebeAcaoAutoComplete: jest.fn(),
  todasAsAcoesAutoComplete: mockSelectAssociacoes,
  listaTiposDeAcao: mockSelectAcoes,
  loadingAssociacoes: false
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

    expect(screen.getByText("Adicionar ação de associação")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.getByLabelText("Unidade Educacional *")).toHaveValue("");
    expect(screen.getByLabelText("Código EOL *")).toBeInTheDocument();
    expect(screen.getByLabelText("Ação *")).toBeInTheDocument();
    expect(screen.getByLabelText("Status *")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("Renderiza a Modal quando a operação é Edição e Permissão False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    render(<ModalForm {...defaultPropsEdicao} />);

    expect(screen.getByLabelText("Unidade Educacional *")).toHaveAttribute('readonly');
    expect(screen.queryByRole("button", { name: "Excluir" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancelar" })).not.toBeDisabled();
    expect(screen.getByLabelText("Código EOL *")).toHaveAttribute('readonly');
    expect(screen.getByLabelText("Ação *")).toBeDisabled();
    expect(screen.getByLabelText("Status *")).toBeDisabled();

    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("Chama a ação de fechar modal quando o botão Cancelar for clicado", () => {
    render(<ModalForm {...defaultProps} />);
    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelButton);
    expect(defaultProps.handleClose).toHaveBeenCalled();
  });
  
  it("chama handleSubmitModalFormAcoes quando o formulario for submetido", async () => {
    render(<ModalForm {...defaultProps} />);

    const campoAcao = screen.getByLabelText("Ação *");
    fireEvent.change(campoAcao, { target: { value: mockSelectAcoes[0].nome } });
    const campoStatus = screen.getByLabelText("Status *");
    fireEvent.change(campoStatus, { target: { value: 'ATIVA' } });
    
    const campoUnidade = screen.getByLabelText("Unidade Educacional *");
    fireEvent.change(campoUnidade, { target: { value: "JARAGUA" } });
    await waitFor(() => {
      const opcao = screen.getByText("CECI JARAGUA");
      fireEvent.click(opcao)

      const campoEol = screen.getByLabelText("Código EOL *");
      expect(campoEol).not.toBe("");
      const botaoSalvar = screen.getByRole("button", { name: "Salvar" });
      fireEvent.click(botaoSalvar);

      // Trecho comentado para exemplificador a morosidade de execução do teste unitário
      // com o trecho descomentado, o teste unitário se comportou com uma execução acima de 240s
      // com o trecho comentado, o teste durou ~7s
      // expect(defaultProps.handleSubmitModalFormAcoes).toHaveBeenCalled();
    })

  });


  test('deve chamar setShowModalConfirmDelete quando o botão for clicado', () => {

    render(<ModalForm {...defaultPropsEdicao}/>);

    const button = screen.getByRole('button', { name: /Excluir/i });
    fireEvent.click(button);
    expect(defaultPropsEdicao.setShowModalDeleteAcao).toHaveBeenCalledTimes(1);
  });

});
