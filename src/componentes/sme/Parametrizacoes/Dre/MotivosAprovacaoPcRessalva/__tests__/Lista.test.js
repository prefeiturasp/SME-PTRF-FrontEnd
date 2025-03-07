import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Lista } from "../components/Lista";
import { MotivosAprovacaoPcRessalvaContext } from "../context/MotivosAprovacaoPcRessalva";
import { useGetMotivosAprovacaoPcRessalva } from "../hooks/useGetMotivosAprovacaoPcRessalva";
import { usePostMotivoAprovacaoPcRessalva } from "../hooks/usePostMotivoAprovacaoPcRessalva";
import { usePatchMotivoAprovacaoPcRessalva } from "../hooks/usePatchMotivoAprovacaoPcRessalva";
import { useDeleteMotivoAprovacaoPcRessalva } from "../hooks/useDeleteMotivoAprovacaoPcRessalva";
import { ModalForm } from "../components/ModalForm";

// Mock das hooks
jest.mock("../hooks/useGetMotivosAprovacaoPcRessalva");
jest.mock("../hooks/usePostMotivoAprovacaoPcRessalva");
jest.mock("../hooks/usePatchMotivoAprovacaoPcRessalva");
jest.mock("../hooks/useDeleteMotivoAprovacaoPcRessalva");

// Mock Form Modal para create e update
jest.mock("../components/ModalForm", () => ({
  ModalForm: ({ handleSubmitFormModal }) => (
    <>
      <div data-testid="modal-form-create"
      onClick={() => handleSubmitFormModal && handleSubmitFormModal({ motivo: "Teste", uuid: "", id: null })}>
        ModalForm
      </div>
      <div data-testid="modal-form-update"
      onClick={() => handleSubmitFormModal && handleSubmitFormModal({ motivo: "Teste1", uuid: "123", id: 1 })}>
        ModalForm
      </div>
    </>
  ),
}));

jest.mock("../components/ModalConfirmacaoExclusao", () => ({
  ModalConfirmacaoExclusao: ({ handleExcluirMotivo }) => (
    <div data-testid="modal-confirmacao-exclusao" onClick={() => handleExcluirMotivo && handleExcluirMotivo("uuid-teste")}>
      ModalConfirmacaoExclusao
    </div>
  ),
}));

const mockMutationPostMutate = jest.fn();
const mockMutationPatchMutate = jest.fn();
const mockMutationDeleteMutate = jest.fn();

const contexto = {
  setShowModalForm: jest.fn(),
  setStateFormModal: jest.fn(),
  setBloquearBtnSalvarForm: jest.fn(),
  handleEditFormModal: jest.fn(),
  handleExcluirMotivo: jest.fn(),
}
const itemMock = { id: 1, motivo: "Motivo 1", uuid: "123" }

describe("Lista", () => {
  beforeEach(() => {
    useGetMotivosAprovacaoPcRessalva.mockReturnValue({
      isLoading: false,
      data: { results: [itemMock] },
    });

    usePostMotivoAprovacaoPcRessalva.mockReturnValue({
      mutationPost: { mutate: mockMutationPostMutate },
    });

    usePatchMotivoAprovacaoPcRessalva.mockReturnValue({
      mutationPatch: { mutate: mockMutationPatchMutate },
    });

    useDeleteMotivoAprovacaoPcRessalva.mockReturnValue({
      mutationDelete: { mutate: mockMutationDeleteMutate },
    });
  });

  

  it("deve renderizar a tabela com dados", () => {
    
    useGetMotivosAprovacaoPcRessalva.mockReturnValue({
      isLoading: false,
      data: { results: [itemMock] },
    })
    render(
      <MotivosAprovacaoPcRessalvaContext.Provider
        value={{...contexto, stateFormModal: itemMock}}>
        <Lista />
        <ModalForm handleSubmitFormModal={jest.fn()} />
      </MotivosAprovacaoPcRessalvaContext.Provider>
    );
    expect(screen.getByText("Motivo 1")).toBeInTheDocument();
  });

  it("deve exibir mensagem quando não houver dados", () => {
    useGetMotivosAprovacaoPcRessalva.mockReturnValue({
      isLoading: false,
      data: { results: [] },
    });

    render(
      <MotivosAprovacaoPcRessalvaContext.Provider
        value={{...contexto, stateFormModal: {nome: "", uuid: "", id: null}}}>
        <Lista />
      </MotivosAprovacaoPcRessalvaContext.Provider>
    );

    expect(screen.getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
  });

  it("deve abrir o modal de edição quando clicar no botão editar", async () => {
    
    render(
      <MotivosAprovacaoPcRessalvaContext.Provider
        value={{...contexto, stateFormModal: itemMock}}>
        <Lista />
      </MotivosAprovacaoPcRessalvaContext.Provider>
    );

    const editButton = screen.getByRole("button", { selector: "btn-editar-membro" });
    fireEvent.click(editButton);

    expect(contexto.setStateFormModal).toHaveBeenCalledWith(itemMock);
    expect(contexto.setShowModalForm).toHaveBeenCalledWith(true);
    

  });

  test("Deve chamar mutationPost.mutate quando handleSubmitFormModal for chamado com um novo motivo", async () => {
    render(
      <MotivosAprovacaoPcRessalvaContext.Provider
        value={contexto}>
        <Lista />
      </MotivosAprovacaoPcRessalvaContext.Provider>
    )

    const modalForm = screen.getByTestId("modal-form-create");
    fireEvent.click(modalForm);

    expect(contexto.setBloquearBtnSalvarForm).toHaveBeenCalledTimes(1);
    expect(contexto.setBloquearBtnSalvarForm).toHaveBeenCalledWith(true);
    expect(mockMutationPostMutate).toHaveBeenCalledTimes(1);
    expect(mockMutationPostMutate).toHaveBeenCalledWith({ payload: { motivo: "Teste" } });
    expect(mockMutationPatchMutate).not.toHaveBeenCalled();
  });

  test("Deve chamar mutationPatch.mutate quando handleSubmitFormModal for chamado com um motivo existente", async () => {
    useGetMotivosAprovacaoPcRessalva.mockReturnValue({
      isLoading: false,
      data: { results: [itemMock] },
    });

    render(
      <MotivosAprovacaoPcRessalvaContext.Provider
        value={{ ...contexto, stateFormModal: itemMock }}>
        <Lista />
      </MotivosAprovacaoPcRessalvaContext.Provider>
    );

    const modalForm = screen.getByTestId("modal-form-update");
    fireEvent.click(modalForm);

    expect(contexto.setBloquearBtnSalvarForm).toHaveBeenCalledTimes(1);
    expect(contexto.setBloquearBtnSalvarForm).toHaveBeenCalledWith(true);
    expect(mockMutationPatchMutate).toHaveBeenCalledTimes(1);
    expect(mockMutationPatchMutate).toHaveBeenCalledWith({ uuidMotivoAprovacaoPcRessalva: "123", payload: { motivo: "Teste1" } });
    expect(mockMutationPostMutate).not.toHaveBeenCalled();
  });

});
