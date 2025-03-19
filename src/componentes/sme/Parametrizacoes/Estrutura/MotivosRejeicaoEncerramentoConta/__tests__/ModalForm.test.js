import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ModalForm } from "../components/ModalForm";
import { MotivosRejeicaoContext } from "../context/MotivosRejeicao";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes");
const mockHandleSubmit = jest.fn();
const mockContextValue = {
  showModalForm: true,
  setShowModalForm: jest.fn(),
  stateFormModal: { id: 1, nome: "", uuid: "" },
  bloquearBtnSalvarForm: false,
  setShowModalConfirmacaoExclusao: jest.fn(),
};

describe("ModalForm", () => {
  beforeEach(() => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  test("Deve renderizar o modal de form corretamente", () => {
    render(
      <MotivosRejeicaoContext.Provider value={mockContextValue}>
        <ModalForm handleSubmitFormModal={mockHandleSubmit} />
      </MotivosRejeicaoContext.Provider>
    );

    expect(screen.getByText("Adicionar motivo")).toBeInTheDocument();
    expect(screen.getByLabelText("Motivo *")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Adicionar")).toBeInTheDocument();
  });

  test("Deve chamar handleSubmitFormModal quando o formulário for submetido", async () => {
    render(
      <MotivosRejeicaoContext.Provider value={mockContextValue}>
        <ModalForm handleSubmitFormModal={mockHandleSubmit} />
      </MotivosRejeicaoContext.Provider>
    );

    const inputNome = screen.getByLabelText("Motivo *");
    fireEvent.change(inputNome, { target: { value: "Motivo de teste" } });

    const submitButton = screen.getByText("Adicionar");
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockHandleSubmit).toHaveBeenCalled());
  });

  test("Deve desabilitar o botão de salvar se a permissão for falsa", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    render(
      <MotivosRejeicaoContext.Provider value={mockContextValue}>
        <ModalForm handleSubmitFormModal={mockHandleSubmit} />
      </MotivosRejeicaoContext.Provider>
    );

    const submitButton = screen.getByText("Adicionar");
    expect(submitButton).toBeDisabled();
  });

  test("Deve habilitar o botão de salvar se a permissão for verdadeira", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(
      <MotivosRejeicaoContext.Provider value={mockContextValue}>
        <ModalForm handleSubmitFormModal={mockHandleSubmit} />
      </MotivosRejeicaoContext.Provider>
    );

    const submitButton = screen.getByText("Adicionar");
    expect(submitButton).not.toBeDisabled();
  });

  test("Deve chamar setShowModalForm com false quando o botão Cancelar for clicado", () => {
    render(
      <MotivosRejeicaoContext.Provider value={mockContextValue}>
        <ModalForm handleSubmitFormModal={mockHandleSubmit} />
      </MotivosRejeicaoContext.Provider>
    );

    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    expect(mockContextValue.setShowModalForm).toHaveBeenCalledWith(false);
  });

  test("Deve renderizar o botão Apagar se houver uuid", () => {
    const updatedMockContextValue = {
      ...mockContextValue,
      stateFormModal: { id: 1, nome: "Motivo", uuid: "1234" }
    };

    render(
      <MotivosRejeicaoContext.Provider value={updatedMockContextValue}>
        <ModalForm handleSubmitFormModal={mockHandleSubmit} />
      </MotivosRejeicaoContext.Provider>
    );

    const deleteButton = screen.getByText("Apagar");
    expect(deleteButton).toBeInTheDocument();
  });

  test("Deve não renderizar o botão Apagar se não houver uuid", () => {
    const updatedMockContextValue = {
      ...mockContextValue,
      stateFormModal: { id: 1, nome: "Motivo", uuid: "" }
    };

    render(
      <MotivosRejeicaoContext.Provider value={updatedMockContextValue}>
        <ModalForm handleSubmitFormModal={mockHandleSubmit} />
      </MotivosRejeicaoContext.Provider>
    );

    const deleteButton = screen.queryByText("Apagar");
    expect(deleteButton).not.toBeInTheDocument();
  });
});
