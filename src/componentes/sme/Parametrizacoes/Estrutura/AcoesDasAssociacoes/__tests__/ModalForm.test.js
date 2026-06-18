import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {ModalFormAcoesDaAssociacao as ModalForm} from "../ModalFormAcoesDasAssociacoes";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { mockSelectAcoes, mockSelectAssociacoes  } from "../__fixtures__/mockData";

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock("../../../../../../context/RecursoSelecionado", () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));

jest.mock("../hooks/useAcoesDasAssociacoesContext", () => ({
  useAcoesDasAssociacoesContext: jest.fn(),
}));

// Mock Modal wrapper to simplify DOM assertions
jest.mock("../../../../../Globais/ModalBootstrap", () => ({
  ModalFormParametrizacoesAcoesDaAssociacao: ({ titulo, bodyText, primeiroBotaoOnclick }) => (
    <div>
      <h1>{titulo}</h1>
      <div>{bodyText}</div>
      <button onClick={primeiroBotaoOnclick}>Primeiro</button>
    </div>
  ),
}));

// Mock AutoCompleteAssociacoes to render options we can click
jest.mock("../AutoCompleteAssociacoes", () => ({
  __esModule: true,
  default: ({ todasAsAcoesAutoComplete, recebeAcaoAutoComplete }) => (
    <div>
      {todasAsAcoesAutoComplete && todasAsAcoesAutoComplete.map(item => (
        <div key={item.uuid} onClick={() => recebeAcaoAutoComplete(item)}>{item.unidade?.nome_com_tipo || item.nome}</div>
      ))}
    </div>
  ),
}));

const mockUseRecurso = require('../../../../../../context/RecursoSelecionado').useRecursoSelecionadoContext;
const mockUseAcoes = require('../hooks/useAcoesDasAssociacoesContext').useAcoesDasAssociacoesContext;
const mockRetornaPermissao = require('../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes').RetornaSeTemPermissaoEdicaoPainelParametrizacoes;

describe("Componente ModalForm", () => {
  const handleClose = jest.fn();
  const handleSubmit = jest.fn();
  const handleChange = jest.fn();
  const handleOpenConfirmDelete = jest.fn();
  const recebeAcao = jest.fn();

  const mockEdit = {
    associacao: "1",
    acao: "1",
    status: "ATIVA",
    codigo_eol: "123",
    nome_unidade: "unidade",
    id: 1,
    uuid: "12345",
    operacao: "edit",
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

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRecurso.mockReturnValue({ recursos: [{ uuid: 'r1', nome: 'Recurso 1' }] });
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão True", () => {
    mockRetornaPermissao.mockReturnValue(true);

    mockUseAcoes.mockReturnValue({
      stateFormModal: mockCreate,
      isLoadingAssociacoes: false,
      todasAsAcoesAutoComplete: mockSelectAssociacoes,
      isOpenModalForm: true,
      listaTiposDeAcao: mockSelectAcoes,
      formReadOnly: false,
      handleCloseModalForm: handleClose,
      handleChangeFormModal: handleChange,
      handleSubmitModalFormAcoesDasAssociacoes: handleSubmit,
      handleOpenConfirmDelete: handleOpenConfirmDelete,
      recebeAcaoAutoComplete: recebeAcao,
    });

    render(<ModalForm />);

    expect(screen.getByText("Adicionar ação de associação")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.getByLabelText("Código EOL *")).toBeInTheDocument();
    expect(screen.getByLabelText("Ação *")).toBeInTheDocument();
    expect(screen.getByLabelText("Status *")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Excluir/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Salvar/i })).toBeDisabled();
  });

  it("Renderiza a Modal quando a operação é Edição e Permissão False", () => {
    mockRetornaPermissao.mockReturnValue(false);

    mockUseAcoes.mockReturnValue({
      stateFormModal: mockEdit,
      isLoadingAssociacoes: false,
      todasAsAcoesAutoComplete: mockSelectAssociacoes,
      isOpenModalForm: true,
      listaTiposDeAcao: mockSelectAcoes,
      formReadOnly: false,
      handleCloseModalForm: handleClose,
      handleChangeFormModal: handleChange,
      handleSubmitModalFormAcoesDasAssociacoes: handleSubmit,
      handleOpenConfirmDelete: handleOpenConfirmDelete,
      recebeAcaoAutoComplete: recebeAcao,
    });

    render(<ModalForm />);

    expect(screen.getByLabelText("Unidade Educacional *")).toHaveAttribute('readOnly');
    const excluir = screen.getByRole("button", { name: /Excluir/i });
    expect(excluir).toBeDisabled();
    expect(screen.getByRole("button", { name: /Cancelar/i })).not.toBeDisabled();
    expect(screen.getByLabelText("Código EOL *")).toHaveAttribute('readOnly');
    expect(screen.getByLabelText("Ação *")).toBeDisabled();
    expect(screen.getByLabelText("Status *")).toBeDisabled();
    expect(screen.getByRole("button", { name: /Salvar/i })).toBeDisabled();
  });

  it("Chama a ação de fechar modal quando o botão Cancelar for clicado", () => {
    mockRetornaPermissao.mockReturnValue(true);

    mockUseAcoes.mockReturnValue({
      stateFormModal: mockCreate,
      isLoadingAssociacoes: false,
      todasAsAcoesAutoComplete: mockSelectAssociacoes,
      isOpenModalForm: true,
      listaTiposDeAcao: mockSelectAcoes,
      formReadOnly: false,
      handleCloseModalForm: handleClose,
      handleChangeFormModal: handleChange,
      handleSubmitModalFormAcoesDasAssociacoes: handleSubmit,
      handleOpenConfirmDelete: handleOpenConfirmDelete,
      recebeAcaoAutoComplete: recebeAcao,
    });

    render(<ModalForm />);
    const cancelButton = screen.getByRole("button", { name: /Cancelar/i });
    fireEvent.click(cancelButton);
    expect(handleClose).toHaveBeenCalled();
  });

  it("chama handleSubmitModalFormAcoes quando o formulario for submetido", async () => {
    mockRetornaPermissao.mockReturnValue(true);

    // enable save by providing acao and status
    mockUseAcoes.mockReturnValue({
      stateFormModal: { ...mockCreate, acao: mockSelectAcoes[0].uuid, status: 'ATIVA', codigo_eol: '000281' },
      isLoadingAssociacoes: false,
      todasAsAcoesAutoComplete: mockSelectAssociacoes,
      isOpenModalForm: true,
      listaTiposDeAcao: mockSelectAcoes,
      formReadOnly: false,
      handleCloseModalForm: handleClose,
      handleChangeFormModal: handleChange,
      handleSubmitModalFormAcoesDasAssociacoes: handleSubmit,
      handleOpenConfirmDelete: handleOpenConfirmDelete,
      recebeAcaoAutoComplete: recebeAcao,
    });

    render(<ModalForm />);

    const botaoSalvar = screen.getByRole("button", { name: /Salvar/i });
    expect(botaoSalvar).not.toBeDisabled();
    const form = document.getElementById('form-modal-acao-associacao');
    fireEvent.submit(form);
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  test('deve chamar handleOpenConfirmDelete quando o botão for clicado', () => {
    mockRetornaPermissao.mockReturnValue(true);

    mockUseAcoes.mockReturnValue({
      stateFormModal: mockEdit,
      isLoadingAssociacoes: false,
      todasAsAcoesAutoComplete: mockSelectAssociacoes,
      isOpenModalForm: true,
      listaTiposDeAcao: mockSelectAcoes,
      formReadOnly: false,
      handleCloseModalForm: handleClose,
      handleChangeFormModal: handleChange,
      handleSubmitModalFormAcoesDasAssociacoes: handleSubmit,
      handleOpenConfirmDelete: handleOpenConfirmDelete,
      recebeAcaoAutoComplete: recebeAcao,
    });

    render(<ModalForm />);

    const button = screen.getByRole('button', { name: /Excluir/i });
    fireEvent.click(button);
    expect(handleOpenConfirmDelete).toHaveBeenCalledTimes(1);
  });

});
