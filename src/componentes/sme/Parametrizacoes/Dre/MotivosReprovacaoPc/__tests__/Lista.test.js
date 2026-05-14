import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Lista } from "../components/Lista";
import { MotivosReprovacaoPcContext } from "../context/MotivosReprovacaoPc";
import { useGetMotivosReprovacaoPc } from "../hooks/useGetMotivosReprovacaoPc";
import { usePostMotivoReprovacaoPc } from "../hooks/usePostMotivoReprovacaoPc";
import { usePatchMotivoReprovacaoPc } from "../hooks/usePatchMotivoReprovacaoPc";
import { useDeleteMotivoReprovacaoPc } from "../hooks/useDeleteMotivoReprovacaoPc";
import { ModalForm } from "../components/ModalForm";

// Mock das hooks
jest.mock("../hooks/useGetMotivosReprovacaoPc");
jest.mock("../hooks/usePostMotivoReprovacaoPc");
jest.mock("../hooks/usePatchMotivoReprovacaoPc");
jest.mock("../hooks/useDeleteMotivoReprovacaoPc");

// Mock Form Modal para create e update
jest.mock("../components/ModalForm", () => ({
  ModalForm: ({ handleSubmitFormModal }) => (
    <>
      <div data-testid="modal-form-create"
      onClick={() => handleSubmitFormModal && handleSubmitFormModal({ motivo: "Teste", uuid: "", id: null, recurso_uuid: "r1" })}>
        ModalForm
      </div>
      <div data-testid="modal-form-update"
      onClick={() => handleSubmitFormModal && handleSubmitFormModal({ motivo: "Teste1", uuid: "123", id: 1, recurso_uuid: "r1" })}>
        ModalForm
      </div>
    </>
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
  showModalConfirmacaoExclusao: { is_open: false, motivo_uuid: '' }
}
const itemMock = { id: 1, motivo: "Motivo 1", uuid: "123", recurso_uuid: "r1", recurso: "r1" };

describe("Lista", () => {
  beforeEach(() => {
    useGetMotivosReprovacaoPc.mockReturnValue({
      isLoading: false,
      data: { results: [itemMock] },
    });

    usePostMotivoReprovacaoPc.mockReturnValue({
      mutationPost: { mutate: mockMutationPostMutate },
    });

    usePatchMotivoReprovacaoPc.mockReturnValue({
      mutationPatch: { mutate: mockMutationPatchMutate },
    });

    useDeleteMotivoReprovacaoPc.mockReturnValue({
      mutationDelete: { mutate: mockMutationDeleteMutate },
    });
  });

  

  it("deve renderizar a tabela com dados", () => {
    
    useGetMotivosReprovacaoPc.mockReturnValue({
      isLoading: false,
      data: { results: [itemMock] },
    })
    render(
      <MotivosReprovacaoPcContext.Provider
        value={{...contexto, stateFormModal: itemMock}}>
        <Lista />
        <ModalForm handleSubmitFormModal={jest.fn()} />
      </MotivosReprovacaoPcContext.Provider>
    );
    expect(screen.getByText("Motivo 1")).toBeInTheDocument();
  });

  it("deve exibir mensagem quando não houver dados", () => {
    useGetMotivosReprovacaoPc.mockReturnValue({
      isLoading: false,
      data: { results: [] },
    });

    render(
      <MotivosReprovacaoPcContext.Provider
        value={{...contexto, stateFormModal: {motivo: "", uuid: "", id: null, recurso_uuid: "r1"}}}>
        <Lista />
      </MotivosReprovacaoPcContext.Provider>
    );

    expect(screen.getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
  });

  it("deve abrir o modal de edição quando clicar no botão editar", async () => {
    
    render(
      <MotivosReprovacaoPcContext.Provider
        value={{...contexto, stateFormModal: itemMock}}>
        <Lista />
      </MotivosReprovacaoPcContext.Provider>
    );

    const editButton = screen.getAllByRole("button", { selector: "btn-editar-membro" });
    fireEvent.click(editButton[1]);

    expect(contexto.setStateFormModal).toHaveBeenCalledWith({ ...itemMock, isOpen: true });
  });

  test("Deve chamar mutationPost.mutate quando handleSubmitFormModal for chamado com um novo motivo", async () => {
    render(
      <MotivosReprovacaoPcContext.Provider
        value={contexto}>
        <Lista />
      </MotivosReprovacaoPcContext.Provider>
    )

    const modalForm = screen.getByTestId("modal-form-create");
    fireEvent.click(modalForm);

    expect(contexto.setBloquearBtnSalvarForm).toHaveBeenCalledTimes(1);
    expect(contexto.setBloquearBtnSalvarForm).toHaveBeenCalledWith(true);
    expect(mockMutationPostMutate).toHaveBeenCalledTimes(1);
    expect(mockMutationPostMutate).toHaveBeenCalledWith({ payload: { motivo: "Teste", recurso: "r1" } });
    expect(mockMutationPatchMutate).not.toHaveBeenCalled();
  });

  test("Deve chamar mutationPatch.mutate quando handleSubmitFormModal for chamado com um motivo existente", async () => {
    useGetMotivosReprovacaoPc.mockReturnValue({
      isLoading: false,
      data: { results: [itemMock] },
    });

    render(
      <MotivosReprovacaoPcContext.Provider
        value={{ ...contexto, stateFormModal: itemMock }}>
        <Lista />
      </MotivosReprovacaoPcContext.Provider>
    );

    const modalForm = screen.getByTestId("modal-form-update");
    fireEvent.click(modalForm);

    expect(contexto.setBloquearBtnSalvarForm).toHaveBeenCalledTimes(1);
    expect(contexto.setBloquearBtnSalvarForm).toHaveBeenCalledWith(true);
    expect(mockMutationPatchMutate).toHaveBeenCalledTimes(1);
    expect(mockMutationPatchMutate).toHaveBeenCalledWith({ uuidMotivoReprovacaoPc: "123", payload: { motivo: "Teste1", recurso: "r1" } });
    expect(mockMutationPostMutate).not.toHaveBeenCalled();
  });

});
