import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalFormLancamentos } from "../ModalFormLancamento";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

jest.mock("../../../../../Globais/ModalBootstrap", () => ({
  ModalFormParametrizacoesAcertos: ({ bodyText, titulo }) => (
    <div>
      <h1>{titulo}</h1>
      {bodyText}
    </div>
  ),
}));

jest.mock("../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

describe("ModalFormLancamentos", () => {
  const defaultProps = {
    show: true,
    readOnly: false,
    categoriaTabela: [
      { id: 1, nome: "Receita" },
      { id: 2, nome: "Despesa" },
    ],
    stateFormModal: {
      id: 15,
      nome: "Lançamento teste",
      categoria: 1,
      ativo: true,
      pode_alterar_saldo_conciliacao: true,
      operacao: "create",
    },
    handleSubmitModalFormLancamentos: jest.fn(),
    handleChangeFormModal: jest.fn(),
    handleClose: jest.fn(),
    serviceCrudLancamentos: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  it("renderiza o título de criação", () => {
    render(<ModalFormLancamentos {...defaultProps} />);

    expect(
      screen.getByText("Adicionar tipo de acerto em lançamento"),
    ).toBeInTheDocument();
  });

  it("renderiza o título de edição", () => {
    render(
      <ModalFormLancamentos
        {...defaultProps}
        stateFormModal={{
          ...defaultProps.stateFormModal,
          operacao: "edit",
        }}
      />,
    );

    expect(
      screen.getByText("Editar tipo de acerto em lançamento"),
    ).toBeInTheDocument();
  });

  it("chama handleChangeFormModal ao alterar o nome", () => {
    render(<ModalFormLancamentos {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/Nome do tipo/i), {
      target: {
        name: "nome",
        value: "Novo Nome",
      },
    });

    expect(defaultProps.handleChangeFormModal).toHaveBeenCalledWith(
      "nome",
      "Novo Nome",
    );
  });

  it("chama handleChangeFormModal ao alterar categoria", () => {
    render(<ModalFormLancamentos {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/Categoria/i), {
      target: {
        name: "categoria",
        value: "2",
      },
    });

    expect(defaultProps.handleChangeFormModal).toHaveBeenCalledWith(
      "categoria",
      "2",
    );
  });

  it("permite marcar ativo", () => {
    render(<ModalFormLancamentos {...defaultProps} />);

    fireEvent.click(document.getElementById("ativo-nao"));

    expect(defaultProps.handleChangeFormModal).toHaveBeenCalledWith(
      "ativo",
      false,
    );
  });

  it("permite alterar pode_alterar_saldo_conciliacao", () => {
    render(<ModalFormLancamentos {...defaultProps} />);

    fireEvent.click(
      document.getElementById("pode_alterar_saldo_conciliacao_nao"),
    );

    expect(defaultProps.handleChangeFormModal).toHaveBeenCalledWith(
      "pode_alterar_saldo_conciliacao",
      false,
    );
  });

  it("chama submit ao clicar em Salvar", () => {
    render(<ModalFormLancamentos {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));

    expect(defaultProps.handleSubmitModalFormLancamentos).toHaveBeenCalledWith(
      defaultProps.stateFormModal,
    );
  });

  it("chama handleClose ao clicar em Cancelar", () => {
    render(<ModalFormLancamentos {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));

    expect(defaultProps.handleClose).toHaveBeenCalled();
  });

  it("exibe botão excluir somente em edição", () => {
    render(
      <ModalFormLancamentos
        {...defaultProps}
        stateFormModal={{
          ...defaultProps.stateFormModal,
          operacao: "edit",
        }}
      />,
    );

    expect(
      screen.getByRole("button", { name: /Excluir/i }),
    ).toBeInTheDocument();
  });

  it("não exibe botão excluir em criação", () => {
    render(<ModalFormLancamentos {...defaultProps} />);

    expect(
      screen.queryByRole("button", { name: /Excluir/i }),
    ).not.toBeInTheDocument();
  });

  it("chama serviceCrudLancamentos ao excluir", () => {
    render(
      <ModalFormLancamentos
        {...defaultProps}
        stateFormModal={{
          ...defaultProps.stateFormModal,
          operacao: "edit",
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Excluir/i }));

    expect(defaultProps.serviceCrudLancamentos).toHaveBeenCalled();
  });

  it("desabilita os campos quando não possui permissão", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    render(<ModalFormLancamentos {...defaultProps} />);

    expect(screen.getByLabelText(/Nome do tipo/i)).toBeDisabled();
    expect(screen.getByLabelText(/Categoria/i)).toBeDisabled();
  });

  it("desabilita o botão salvar quando nome está vazio", () => {
    render(
      <ModalFormLancamentos
        {...defaultProps}
        stateFormModal={{
          ...defaultProps.stateFormModal,
          nome: "",
        }}
      />,
    );

    expect(screen.getByRole("button", { name: /Salvar/i })).toBeDisabled();
  });

  it("renderiza o ID quando operação é edit", () => {
    render(
      <ModalFormLancamentos
        {...defaultProps}
        stateFormModal={{
          ...defaultProps.stateFormModal,
          operacao: "edit",
        }}
      />,
    );

    expect(screen.getByText("15")).toBeInTheDocument();
  });
});
