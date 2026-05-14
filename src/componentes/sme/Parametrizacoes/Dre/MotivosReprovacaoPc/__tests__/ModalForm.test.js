import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ModalForm } from "../components/ModalForm";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { MotivosReprovacaoPcContext } from "../context/MotivosReprovacaoPc";
import { useGetMotivosReprovacaoPc } from "../hooks/useGetMotivosReprovacaoPc";

jest.mock("../hooks/useGetMotivosReprovacaoPc");

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
  handleOpenModalConfirmacaoExclusao: jest.fn(),
  handleCloseModalForm: jest.fn(),
}

const mockEdit = {
  motivo: "Nome do motivo",
  id: 1,
  uuid: "12345",
  operacao: "edit",
  isOpen: true,
  recurso_uuid: "r1"
};

const mockCreate = { 
  motivo: "",
  id: null,
  uuid: null,
  operacao: "create",
  isOpen: true,
  recurso_uuid: "r1"
};

describe("Componente ModalForm", () => {
  beforeEach(() => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    useGetMotivosReprovacaoPc.mockReturnValue({ isLoading: false, data: [], count: 0 });
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão True", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(
      <MotivosReprovacaoPcContext.Provider value={{
        ...contexto, stateFormModal: mockCreate
      }}>
        <ModalForm handleSubmitFormModal={contexto.handleEditFormModal} />
      </MotivosReprovacaoPcContext.Provider>
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
      <MotivosReprovacaoPcContext.Provider value={{
        showModalForm: true,
        stateFormModal: mockCreate
      }}>
        <ModalForm />
      </MotivosReprovacaoPcContext.Provider>
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
      <MotivosReprovacaoPcContext.Provider value={{
        ...contexto, stateFormModal: mockEdit
      }}>
        <ModalForm handleSubmitFormModal={contexto.handleEditFormModal} />
      </MotivosReprovacaoPcContext.Provider>
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
      <MotivosReprovacaoPcContext.Provider value={{
        ...contexto, stateFormModal: mockEdit
      }}>
        <ModalForm handleSubmitFormModal={contexto.handleEditFormModal} />
      </MotivosReprovacaoPcContext.Provider>
    )

    expect(screen.getByText("Editar motivo")).toBeInTheDocument();
    expect(screen.getByLabelText("Motivo *")).toHaveValue("Nome do motivo");
    expect(screen.queryByRole("button", { name: "Excluir" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("deve chamar handleSubmitModalForm quando o formulario for submetido", async () => {
    render(
      <MotivosReprovacaoPcContext.Provider value={{
        ...contexto, stateFormModal: mockEdit
      }}>
        <ModalForm handleSubmitFormModal={contexto.handleEditFormModal} />
      </MotivosReprovacaoPcContext.Provider>
    )
    const saveButton = screen.getByRole("button", { name: "Salvar" });
    fireEvent.submit(saveButton);

    await waitFor(() => {
      expect(contexto.handleEditFormModal).toHaveBeenCalledTimes(1);
    });
  
  });

  it("deve chamar a ação de fechar modal quando o botão Cancelar for clicado", () => {
    render(
      <MotivosReprovacaoPcContext.Provider value={{
        ...contexto, stateFormModal: mockEdit
      }}>
        <ModalForm handleSubmitFormModal={contexto.handleEditFormModal} />
      </MotivosReprovacaoPcContext.Provider>
    )

    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelButton);

    expect(contexto.handleCloseModalForm).toHaveBeenCalled();
  });

  test('deve chamar handleOpenModalConfirmacaoExclusao e handleCloseModalForm quando o botão for clicado', () => {
    render(
      <MotivosReprovacaoPcContext.Provider value={{
        ...contexto, stateFormModal: mockEdit
      }}>
        <ModalForm handleSubmitFormModal={contexto.handleEditFormModal} />
      </MotivosReprovacaoPcContext.Provider>
    )

    const button = screen.getByTestId('btn-excluir-motivo');
    fireEvent.click(button);

    expect(contexto.handleOpenModalConfirmacaoExclusao).toHaveBeenCalledWith(mockEdit.uuid);
    expect(contexto.handleCloseModalForm).toHaveBeenCalled();
  });

  it("Lancar erro ao tentar salvar motivo vazio", async () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(
      <MotivosReprovacaoPcContext.Provider value={{
        ...contexto, stateFormModal: {nome: "", uuid: "", id: null, isOpen: true, recurso_uuid: "r1"}
      }}>
        <ModalForm handleSubmitFormModal={contexto.handleEditFormModal} />
      </MotivosReprovacaoPcContext.Provider>
    )

    const botaoSalvar = screen.getByRole("button", { name: "Adicionar" })
    fireEvent.click(botaoSalvar);
    await waitFor(() => {
      expect(screen.getByText("Motivo é obrigatório.")).toBeInTheDocument();
    })

    
  });

});
