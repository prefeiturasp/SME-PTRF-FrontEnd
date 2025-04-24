import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Tabela } from "../Tabela";
import { PeriodosPaaContext } from "../context/index";
import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";
import { usePatch } from "../hooks/usePatch";
import { useDelete } from "../hooks/useDelete";
import * as useDeleteHook from '../hooks/useDelete';
import { ModalForm } from "../ModalForm";

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
          referencia: "",
          data_inicial: "",
          data_final: "",
          uuid: "",
          id: null
        })}>
        ModalForm
      </div>
      <div data-testid="modal-form-update"
      onClick={() => handleSubmitFormModal && handleSubmitFormModal({
          referencia: "Teste1",
          data_inicial: "2020-01-01",
          data_final: "2020-12-31",
          uuid: "123",
          id: 1
        })}>
        ModalForm
      </div>
    </>
  ),
}));

const mockMutationPostMutate = jest.fn();
const mockMutationPatchMutate = jest.fn();
const mockMutationDeleteMutate = jest.fn();

const mockEdit = {
  id: 1,
  referencia: "Referencia 1",
  uuid: "123",
  data_inicial: '2020-01-01',
  data_final: '2020-12-31',
  editavel: true,
  operacao: "edit",
}

const mockCreate = {
  id: '',
  referencia: "",
  uuid: "",
  data_inicial: '',
  data_final: '',
  editavel: true,
  operacao: "create",
}

const contexto = {
  setShowModalForm: jest.fn(),
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
      <PeriodosPaaContext.Provider value={contexto}>
        <Tabela />
      </PeriodosPaaContext.Provider>
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
      <PeriodosPaaContext.Provider
        value={{...contexto, stateFormModal: mockEdit}}>
        <Tabela />
        <ModalForm handleSubmitFormModal={jest.fn()} />
      </PeriodosPaaContext.Provider>
    );
    expect(screen.getByText(mockEdit.referencia)).toBeInTheDocument();
  });

  it("deve exibir mensagem quando não houver dados", () => {
    useGet.mockReturnValue({
      isLoading: false,
      data: { results: [] },
    });

    render(
      <PeriodosPaaContext.Provider
        value={{...contexto, stateFormModal: mockCreate}}>
        <Tabela />
      </PeriodosPaaContext.Provider>
    );

    expect(screen.getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
  });

  it("deve abrir o modal de edição quando clicar no botão editar", async () => {
    
    render(
      <PeriodosPaaContext.Provider
        value={{...contexto, stateFormModal: mockEdit}}>
        <Tabela />
      </PeriodosPaaContext.Provider>
    );

    const editButton = screen.getByRole("button", { selector: "btn-editar-membro" });
    fireEvent.click(editButton);

    expect(screen.getAllByRole("button", { selector: ".btn-editar-membro" })).toHaveLength(1);
    expect(contexto.setStateFormModal).toHaveBeenCalledWith(mockEdit);
    expect(contexto.setShowModalForm).toHaveBeenCalledWith(true);

  });

  it("deve abrir o modal de visualização quando clicar no botão visualizar", async () => {
    
    render(
      <PeriodosPaaContext.Provider
        value={{...contexto, stateFormModal: {...mockEdit, editavel: false}}}>
        <Tabela />
      </PeriodosPaaContext.Provider>
    );

    const editButton = screen.getByRole("button", { selector: ".btn-visualizar-periodo" });
    fireEvent.click(editButton);

    expect(contexto.setStateFormModal).toHaveBeenCalledWith(mockEdit);
    expect(contexto.setShowModalForm).toHaveBeenCalledWith(true);

  });

  it("deve abrir o modal de edição quando clicar no botão editar e editável for false", async () => {
    useGet.mockReturnValue({
      isLoading: false,
      data: { results: [{...mockEdit, editavel: false}] },
    });
    render(
      <PeriodosPaaContext.Provider
        value={{...contexto}}>
        <Tabela />
      </PeriodosPaaContext.Provider>
    );
    expect(screen.getAllByRole("button", { selector: ".btn-visualizar-membro" })).toHaveLength(1);
    
  });

  test("Deve chamar mutationPost.mutate quando handleSubmitFormModal for chamado com um novo periodo", async () => {
    render(
      <PeriodosPaaContext.Provider value={contexto}>
        <Tabela />
      </PeriodosPaaContext.Provider>
    )

    const modalForm = screen.getByTestId("modal-form-create");
    fireEvent.click(modalForm);

    expect(contexto.setBloquearBtnSalvarForm).toHaveBeenCalledTimes(1);
    expect(contexto.setBloquearBtnSalvarForm).toHaveBeenCalledWith(true);
    expect(mockMutationPostMutate).toHaveBeenCalledTimes(1);
    expect(mockMutationPostMutate).toHaveBeenCalledWith({ payload: { referencia: "", data_inicial: "", data_final: "" } });
    expect(mockMutationPatchMutate).not.toHaveBeenCalled();
  });

  test("Deve chamar mutationPatch.mutate quando handleSubmitFormModal for chamado com um motivo existente", async () => {
    useGet.mockReturnValue({
      isLoading: false,
      data: { results: [mockEdit] },
    });

    render(
      <PeriodosPaaContext.Provider
        value={{ ...contexto, stateFormModal: mockEdit }}>
        <Tabela />
      </PeriodosPaaContext.Provider>
    );

    const modalForm = screen.getByTestId("modal-form-update");
    fireEvent.click(modalForm);
    const payload = {
      referencia: "Teste1",
      data_inicial: "2020-01-01",
      data_final: "2020-12-31",
    }
    expect(contexto.setBloquearBtnSalvarForm).toHaveBeenCalledTimes(1);
    expect(contexto.setBloquearBtnSalvarForm).toHaveBeenCalledWith(true);
    expect(mockMutationPatchMutate).toHaveBeenCalledTimes(1);
    expect(mockMutationPatchMutate).toHaveBeenCalledWith({ uuid: "123", payload: payload });
    expect(mockMutationPostMutate).not.toHaveBeenCalled();
  });

});
