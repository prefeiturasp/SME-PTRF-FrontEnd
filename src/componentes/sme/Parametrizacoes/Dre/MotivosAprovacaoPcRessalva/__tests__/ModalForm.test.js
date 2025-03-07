import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ModalForm } from "../components/ModalForm";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { MotivosAprovacaoPcRessalvaContext } from "../context/MotivosAprovacaoPcRessalva";
import { useGetMotivosAprovacaoPcRessalva } from "../hooks/useGetMotivosAprovacaoPcRessalva";

jest.mock("../hooks/useGetMotivosAprovacaoPcRessalva");

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const contexto = {
  showModalForm: true,
  setShowModalForm: jest.fn(),
  setStateFormModal: jest.fn(),
  setBloquearBtnSalvarForm: jest.fn(),
  handleEditFormModal: jest.fn(),
  setShowModalConfirmacaoExclusao: jest.fn(),
}

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
    useGetMotivosAprovacaoPcRessalva.mockReturnValue({ isLoading: false, data: [], count: 0 });
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão True", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(
      <MotivosAprovacaoPcRessalvaContext.Provider value={{
        ...contexto, stateFormModal: mockCreate
      }}>
        <ModalForm handleSubmitFormModal={contexto.handleEditFormModal} />
      </MotivosAprovacaoPcRessalvaContext.Provider>
    )
    const campoMotivo = screen.getByLabelText("Motivo *");
    expect(screen.getByText("Adicionar motivo")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(campoMotivo).toHaveValue("");
    expect(campoMotivo).toBeEnabled();
    expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adicionar" })).toBeEnabled();
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    render(
      <MotivosAprovacaoPcRessalvaContext.Provider value={{
        showModalForm: true,
        stateFormModal: mockCreate
      }}>
        <ModalForm />
      </MotivosAprovacaoPcRessalvaContext.Provider>
    )

    const campoMotivo = screen.getByLabelText("Motivo *");
    expect(campoMotivo).toHaveValue("");
    expect(campoMotivo).toBeDisabled();

    expect(screen.getByText("Adicionar motivo")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adicionar" })).toBeDisabled();
  });

  it("Renderiza a Modal quando a operação é Edição e permissão é True", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    render(
      <MotivosAprovacaoPcRessalvaContext.Provider value={{
        ...contexto, stateFormModal: mockEdit
      }}>
        <ModalForm handleSubmitFormModal={contexto.handleEditFormModal} />
      </MotivosAprovacaoPcRessalvaContext.Provider>
    )

    const botaoExcluir = screen.queryByRole("button", { name: "Excluir" });
    expect(screen.getByText("Editar motivo")).toBeInTheDocument();
    expect(screen.getByLabelText("Motivo *")).toHaveValue("Nome do motivo");
    expect(botaoExcluir).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
    fireEvent.click(botaoExcluir);

  });

  it("Renderiza a Modal quando a operação é Edição e permissão é False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    render(
      <MotivosAprovacaoPcRessalvaContext.Provider value={{
        ...contexto, stateFormModal: mockEdit
      }}>
        <ModalForm handleSubmitFormModal={contexto.handleEditFormModal} />
      </MotivosAprovacaoPcRessalvaContext.Provider>
    )

    expect(screen.getByText("Editar motivo")).toBeInTheDocument();
    expect(screen.getByLabelText("Motivo *")).toHaveValue("Nome do motivo");
    expect(screen.queryByRole("button", { name: "Excluir" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("deve chamar handleSubmitModalForm quando o formulario for submetido", async () => {
    render(
      <MotivosAprovacaoPcRessalvaContext.Provider value={{
        ...contexto, stateFormModal: mockEdit
      }}>
        <ModalForm handleSubmitFormModal={contexto.handleEditFormModal} />
      </MotivosAprovacaoPcRessalvaContext.Provider>
    )
    const saveButton = screen.getByRole("button", { name: "Salvar" });
    fireEvent.submit(saveButton);

    await waitFor(() => {
      expect(contexto.handleEditFormModal).toHaveBeenCalledTimes(1);
    });
  
  });

  it("deve chamar a ação de fechar modal quando o botão Cancelar for clicado", () => {
    render(
      <MotivosAprovacaoPcRessalvaContext.Provider value={{
        ...contexto, stateFormModal: mockEdit
      }}>
        <ModalForm handleSubmitFormModal={contexto.handleEditFormModal} />
      </MotivosAprovacaoPcRessalvaContext.Provider>
    )

    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelButton);

    expect(contexto.setShowModalForm).toHaveBeenCalledWith(false);
  });

  test('deve chamar setShowModalConfirmDelete quando o botão for clicado', () => {
    render(
      <MotivosAprovacaoPcRessalvaContext.Provider value={{
        ...contexto, stateFormModal: mockEdit
      }}>
        <ModalForm handleSubmitFormModal={contexto.handleEditFormModal} />
      </MotivosAprovacaoPcRessalvaContext.Provider>
    )

    const button = screen.getByRole('button', { name: /Excluir/i });
    fireEvent.click(button);

    expect(contexto.setShowModalConfirmacaoExclusao).toHaveBeenCalledWith(true);
  });

  it("Lancar erro ao tentar salvar motivo vazio", async () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(
      <MotivosAprovacaoPcRessalvaContext.Provider value={{
        ...contexto, stateFormModal: {nome: "", uuid: "", id: null}
      }}>
        <ModalForm handleSubmitFormModal={contexto.handleEditFormModal} />
      </MotivosAprovacaoPcRessalvaContext.Provider>
    )

    const botaoSalvar = screen.getByRole("button", { name: "Adicionar" })
    fireEvent.click(botaoSalvar);
    await waitFor(() => {
      expect(screen.getByText("Motivo é obrigatório.")).toBeInTheDocument();
    })

    
  });

});
