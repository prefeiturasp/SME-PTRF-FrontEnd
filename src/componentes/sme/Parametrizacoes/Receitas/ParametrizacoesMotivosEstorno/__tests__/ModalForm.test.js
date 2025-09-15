import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModalForm from "../ModalForm";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { MotivosEstornoContext } from "../context/MotivosEstorno";
import { useGetMotivosEstorno } from "../hooks/useGetMotivosEstorno";

jest.mock("../hooks/useGetMotivosEstorno");

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const handleSubmitFormModalMock = jest.fn(); 
const setShowModalFormMock = jest.fn();
const setShowModalConfirmacaoExclusaoMock = jest.fn();

const mockEdit = {
  motivo: "Nome do motivo",
  id: 1,
  uuid: "12345",
  operacao: "edit"
};

const mockCreate = { 
  motivo: "",
  id: null,
  uuid: null,
  operacao: "create",
};

describe("Componente ModalForm", () => {
  beforeEach(() => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    useGetMotivosEstorno.mockReturnValue({ isLoading: false, data: [], count: 0 });
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão True", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(
      <MotivosEstornoContext.Provider value={{
        showModalForm: true,
        stateFormModal: mockCreate
      }}>
        <ModalForm />
      </MotivosEstornoContext.Provider>
    )

    expect(screen.getByText("Adicionar motivo")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome *")).toHaveValue("");
    expect(screen.queryByRole("button", { name: "Apagar" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Adicionar" })).toBeEnabled();
    const campos = screen.getAllByRole("textbox");
    campos.forEach((campo) => {
      expect(campo).toBeEnabled();
    });
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    render(
      <MotivosEstornoContext.Provider value={{
        showModalForm: true,
        stateFormModal: mockCreate
      }}>
        <ModalForm />
      </MotivosEstornoContext.Provider>
    )

    expect(screen.getByText("Adicionar motivo")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome *")).toHaveValue("");
    expect(screen.queryByRole("button", { name: "Apagar" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Adicionar" })).toBeDisabled();
    const campos = screen.getAllByRole("textbox");
    campos.forEach((campo) => {
      expect(campo).toBeDisabled();
    });
  });

  it("Renderiza a Modal quando a operação é Edição e permissão é True", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    render(
      <MotivosEstornoContext.Provider value={{
        showModalForm: true,
        stateFormModal: mockEdit
      }}>
        <ModalForm />
      </MotivosEstornoContext.Provider>
    )

    expect(screen.getByText("Editar motivo")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome *")).toHaveValue("Nome do motivo");
    expect(screen.queryByRole("button", { name: "Apagar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
    const campos = screen.getAllByRole("textbox");
    campos.forEach((campo) => {
        expect(campo).toBeEnabled();
    });
  });

  it("Renderiza a Modal quando a operação é Edição e permissão é False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    render(
      <MotivosEstornoContext.Provider value={{
        showModalForm: true,
        stateFormModal: mockEdit
      }}>
        <ModalForm />
      </MotivosEstornoContext.Provider>
    )

    expect(screen.getByText("Editar motivo")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome *")).toHaveValue("Nome do motivo");
    expect(screen.queryByRole("button", { name: "Apagar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
    const campos = screen.getAllByRole("textbox");
    campos.forEach((campo) => {
      expect(campo).toBeDisabled();
    });
  });

  it("deve chamar handleSubmitModalForm quando o formulario for submetido", async () => {
    render(
      <MotivosEstornoContext.Provider value={{
        showModalForm: true,
        stateFormModal: mockEdit,
      }}>
        <ModalForm handleSubmitFormModal={handleSubmitFormModalMock}/>
      </MotivosEstornoContext.Provider>
    )
    const saveButton = screen.getByRole("button", { name: "Salvar" });
    fireEvent.submit(saveButton);

    await waitFor(() => {
      expect(handleSubmitFormModalMock).toHaveBeenCalledTimes(1);
  });
  
  });

  it("deve chamar a ação de fechar modal quando o botão Cancelar for clicado", () => {
    render(
      <MotivosEstornoContext.Provider value={{
        showModalForm: true,
        stateFormModal: mockEdit,
        setShowModalForm: setShowModalFormMock
      }}>
        <ModalForm />
      </MotivosEstornoContext.Provider>
    )

    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelButton);

    expect(setShowModalFormMock).toHaveBeenCalledWith(false);
  });

  test('deve chamar setShowModalConfirmDelete quando o botão for clicado', () => {
    render(
      <MotivosEstornoContext.Provider value={{
        showModalForm: true,
        stateFormModal: mockEdit,
        setShowModalConfirmacaoExclusao: setShowModalConfirmacaoExclusaoMock
      }}>
        <ModalForm />
      </MotivosEstornoContext.Provider>
    )

    const button = screen.getByRole('button', { name: /Apagar/i });
    fireEvent.click(button);

    expect(setShowModalConfirmacaoExclusaoMock).toHaveBeenCalledWith(true);
  });

});
