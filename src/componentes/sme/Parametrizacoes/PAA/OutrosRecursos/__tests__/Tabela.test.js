import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Tabela } from "../Tabela";
import { OutrosRecursosPaaContext } from "../context/index";
import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";
import { usePatch } from "../hooks/usePatch";
import { useDelete } from "../hooks/useDelete";
import { ModalForm } from "../ModalForm";
import { ModalConfirmarExclusao } from "../../../componentes/ModalConfirmarExclusao";


const mockMutationPostMutate = jest.fn();
const mockMutationPatchMutate = jest.fn();
const mockMutationDeleteMutate = jest.fn();

// Mock das hooks
jest.mock("../hooks/useGet");
jest.mock("../hooks/usePost");
jest.mock("../hooks/usePatch");
jest.mock("../hooks/useDelete");

// Mock Form Modal para excluir
jest.mock("../ModalForm", () => ({
  ModalForm: ({ handleSubmitFormModal }) => (
    <>
      <div data-testid="modal-form-create"
        onClick={() => handleSubmitFormModal && handleSubmitFormModal({
          nome: "Novo",
          aceita_custeio: true,
          aceita_capital: true,
          aceita_livre_aplicacao: true,
          uuid: null,
          id: null
        })}>
        ModalForm
      </div>
      <div data-testid="modal-form-update"
        onClick={() => handleSubmitFormModal && handleSubmitFormModal({
          nome: "Teste",
          aceita_custeio: true,
          aceita_capital: true,
          aceita_livre_aplicacao: true,
          uuid: "123",
          id: 1
        })}>
        ModalForm
      </div>
      
    </>
  ),
}));
jest.mock("../../../componentes/ModalConfirmarExclusao", () => ({
  ModalConfirmarExclusao: ({ onOk, onCancel }) => (
    <>
      <div data-testid="modal-form-delete"
        onClick={() => onOk && onOk("123")}>
        ModalConfirmarExclusao
      </div>
      <div data-testid="modal-form-delete-cancela"
        onClick={() => onCancel && onCancel("123")}>
        ModalConfirmarExclusao Cancela
      </div>
    </>
  ),
}));



const mockEdit = {
  id: 1,
  nome: "Teste 1",
  aceita_custeio: true,
  aceita_capital: true,
  aceita_livre_aplicacao: true,
  uuid: "123",
  operacao: "edit",
}

const mockCreate = {
  id: '',
  nome: "",
  aceita_custeio: true,
  aceita_capital: true,
  aceita_livre_aplicacao: true,
  uuid: "",
  operacao: "create",
}

const contexto = {
  setShowModalForm: jest.fn(),
  setShowModalConfirmacaoExclusao: jest.fn(),
  setStateFormModal: jest.fn(),
  setBloquearBtnSalvarForm: jest.fn(),
  handleEditFormModal: jest.fn(),
  handleExcluir: jest.fn(),
}

describe("Tabela", () => {
  beforeEach(() => {

    useGet.mockReturnValue({
      isLoading: false,
      data: { results: [mockEdit] },
    });

    usePost.mockReturnValue({
      mutationPost: { mutate: mockMutationPostMutate },
    });

    usePatch.mockReturnValue({
      mutationPatch: { mutate: mockMutationPatchMutate },
    });

    useDelete.mockReturnValue({
      mutationDelete: { mutate: mockMutationDeleteMutate },
    });
  });

  it("deve renderizar o loading", () => {

    useGet.mockReturnValue({
      isLoading: true,
      data: { results: [mockEdit] },
    })
    render(
      <OutrosRecursosPaaContext.Provider value={contexto}>
        <Tabela />
      </OutrosRecursosPaaContext.Provider>
    );
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("deve renderizar a tabela com dados", () => {
    
    useGet.mockReturnValue({
      isLoading: false,
      data: { results: [mockEdit] },
      total: 1,
    })
    render(
      <OutrosRecursosPaaContext.Provider
        value={{...contexto, stateFormModal: mockEdit}}>
        <Tabela />
        <ModalForm handleSubmitFormModal={jest.fn()} />
      </OutrosRecursosPaaContext.Provider>
    );
    expect(screen.getByText(mockEdit.nome)).toBeInTheDocument();
  });

  it("deve exibir mensagem quando não houver dados", () => {
    useGet.mockReturnValue({
      isLoading: false,
      data: { results: [] },
    });

    render(
      <OutrosRecursosPaaContext.Provider
        value={{...contexto, stateFormModal: mockCreate}}>
        <Tabela />
      </OutrosRecursosPaaContext.Provider>
    );

    expect(screen.getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
  });

  it("deve abrir o modal de edição quando clicar no botão editar", async () => {
    
    render(
      <OutrosRecursosPaaContext.Provider
        value={{...contexto, stateFormModal: mockEdit}}>
        <Tabela />
      </OutrosRecursosPaaContext.Provider>
    );

    const editButton = screen.getByRole("button", { selector: "btn-editar-membro" });
    fireEvent.click(editButton);

    expect(screen.getAllByRole("button", { selector: ".btn-editar-membro" })).toHaveLength(1);
    expect(contexto.setStateFormModal).toHaveBeenCalledWith(mockEdit);
    expect(contexto.setShowModalForm).toHaveBeenCalledWith(true);

  });

  it("deve abrir o modal de visualização quando clicar no botão visualizar", async () => {
    
    render(
      <OutrosRecursosPaaContext.Provider
        value={{...contexto, stateFormModal: {...mockEdit}}}>
        <Tabela />
      </OutrosRecursosPaaContext.Provider>
    );

    const editButton = screen.getByRole("button", { selector: ".btn-visualizar-periodo" });
    fireEvent.click(editButton);

    expect(contexto.setStateFormModal).toHaveBeenCalledWith(mockEdit);
    expect(contexto.setShowModalForm).toHaveBeenCalledWith(true);

  });

  it("deve abrir o modal de edição quando clicar no botão editar", async () => {
    useGet.mockReturnValue({
      isLoading: false,
      data: { results: [{...mockEdit}] },
    });
    render(
      <OutrosRecursosPaaContext.Provider
        value={{...contexto}}>
        <Tabela />
      </OutrosRecursosPaaContext.Provider>
    );
    expect(screen.getAllByRole("button", { selector: ".btn-visualizar-membro" })).toHaveLength(1);
    
  });

  it("Deve chamar mutationPost.mutate quando handleSubmitFormModal for chamado", async () => {
    render(
      <OutrosRecursosPaaContext.Provider value={contexto}>
        <Tabela />
      </OutrosRecursosPaaContext.Provider>
    )

    const modalForm = screen.getByTestId("modal-form-create");
    fireEvent.click(modalForm);

    expect(contexto.setBloquearBtnSalvarForm).toHaveBeenCalledTimes(1);
    expect(contexto.setBloquearBtnSalvarForm).toHaveBeenCalledWith(true);
    expect(mockMutationPostMutate).toHaveBeenCalledTimes(1);
    expect(mockMutationPostMutate).toHaveBeenCalledWith({
      payload: {
        nome: "Novo",
        aceita_capital: true,
        aceita_custeio: true,
        aceita_livre_aplicacao: true
      }
    });
    expect(mockMutationPatchMutate).not.toHaveBeenCalled();
  });

  it("Deve chamar mutationPatch.mutate quando handleSubmitFormModal for chamado", async () => {
    useGet.mockReturnValue({
      isLoading: false,
      data: { results: [mockEdit] },
    });

    render(
      <OutrosRecursosPaaContext.Provider
        value={{ ...contexto, stateFormModal: mockEdit }}>
        <Tabela />
      </OutrosRecursosPaaContext.Provider>
    );

    const modalForm = screen.getByTestId("modal-form-update");
    fireEvent.click(modalForm);
    const payload = {
      nome: "Teste",
      aceita_capital: true,
      aceita_custeio: true,
      aceita_livre_aplicacao: true
    }
    expect(contexto.setBloquearBtnSalvarForm).toHaveBeenCalledTimes(1);
    expect(contexto.setBloquearBtnSalvarForm).toHaveBeenCalledWith(true);
    expect(mockMutationPatchMutate).toHaveBeenCalledTimes(1);
    expect(mockMutationPatchMutate).toHaveBeenCalledWith({ uuid: "123", payload: payload });
  });

  it("Deve chamar mutationDelete.mutate quando Excluir for chamado", async () => {
    useGet.mockReturnValue({
      isLoading: false,
      data: { results: [mockEdit] },
    });

    render(
      <OutrosRecursosPaaContext.Provider
        value={{ ...contexto, stateFormModal: mockEdit }}>
        <Tabela />
      </OutrosRecursosPaaContext.Provider>
    );

    const modalForm = screen.getByTestId("modal-form-delete");
    fireEvent.click(modalForm);

    expect(mockMutationDeleteMutate).toHaveBeenCalledTimes(1);
    expect(mockMutationDeleteMutate).toHaveBeenCalledWith("123");
  });

  it("Não Deve chamar mutationDelete.mutate quando Objeto não tem UUID", async () => {
    useGet.mockReturnValue({
      isLoading: false,
      data: { results: [mockEdit] },
    });

    render(
      <OutrosRecursosPaaContext.Provider
        value={{ ...contexto, stateFormModal: {...mockEdit, uuid: null} }}>
        <Tabela />
      </OutrosRecursosPaaContext.Provider>
    );

    const modalForm = screen.getByTestId("modal-form-delete");
    fireEvent.click(modalForm);

    expect(mockMutationDeleteMutate).toHaveBeenCalledTimes(0);
    expect(mockMutationDeleteMutate).not.toHaveBeenCalled();
  });

  it("Deve Fechar Modal quando a exclusão for cancelada", async () => {
    useGet.mockReturnValue({
      isLoading: false,
      data: { results: [mockEdit] },
    });

    render(
      <OutrosRecursosPaaContext.Provider
        value={{ ...contexto, stateFormModal: {...mockEdit, uuid: null} }}>
        <Tabela />
      </OutrosRecursosPaaContext.Provider>
    );

    const modalForm = screen.getByTestId("modal-form-delete-cancela");
    fireEvent.click(modalForm);

    expect(contexto.setShowModalConfirmacaoExclusao).toHaveBeenCalledTimes(1);
    expect(contexto.setShowModalConfirmacaoExclusao).toHaveBeenCalledWith(false);
  });

});
