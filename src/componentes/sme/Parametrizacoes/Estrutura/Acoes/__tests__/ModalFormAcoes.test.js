import React from "react";
import { configure, render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ModalFormAcoes } from "../components/ModalFormAcoes";
import { useAcoesContext } from "../hooks/useAcoesContext";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";

// Mocks dos Hooks de Contexto
jest.mock("../hooks/useAcoesContext");
jest.mock("../../../../../../context/RecursoSelecionado", () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));

// Mock do esquema do Yup
jest.mock("../YupSignupSchemaTags", () => ({
  YupSignupSchemaTags: null,
}));

// Mock do componente Modal Bootstrap
jest.mock("../../../../../Globais/ModalBootstrap", () => ({
  ModalFormParametrizacoesAcoes: ({ show, titulo, onHide, bodyText }) => {
    if (!show) return null;
    return (
      <div data-testid="modal-container">
        <h2>{titulo}</h2>
        <button data-testid="modal-close-btn" onClick={onHide}>
          Fechar Modal
        </button>
        {bodyText}
      </div>
    );
  },
}));

// Mock do react-tooltip
jest.mock("react-tooltip", () => ({
  Tooltip: ({ content }) => <div data-testid="tooltip-content">{content}</div>,
}));

// Configura o Testing Library para reconhecer 'data-qa' além de 'data-testid'
configure({ testIdAttribute: "data-qa" });

describe("Componente <ModalFormAcoes />", () => {
  const mockHandleClose = jest.fn();
  const mockHandleSubmitFormModal = jest.fn();
  const mockHandleOpenModalDeleteAcao = jest.fn();

  const mockRecursos = [
    { uuid: "rec-1", nome: "Recurso Financeiro 1" },
    { uuid: "rec-2", nome: "Recurso Financeiro 2" },
  ];

  const defaultModalFormState = {
    open: true,
    operacao: "add",
    id: "",
    nome: "Ação Inicial",
    ordem_exibicao: "1",
    recurso: { uuid: "rec-1" },
    aceita_capital: true,
    aceita_custeio: false,
    aceita_livre: true,
    e_recursos_proprios: false,
    exibir_paa: true,
  };

  const defaultAcoesContext = {
    modalForm: defaultModalFormState,
    handleClose: mockHandleClose,
    handleSubmitFormModal: mockHandleSubmitFormModal,
    TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES: true,
    handleOpenModalDeleteAcao: mockHandleOpenModalDeleteAcao,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useAcoesContext.mockReturnValue(defaultAcoesContext);
    useRecursoSelecionadoContext.mockReturnValue({
      recursos: mockRecursos,
    });
  });

  test("não deve renderizar nada quando modalForm.open for false", () => {
    useAcoesContext.mockReturnValue({
      ...defaultAcoesContext,
      modalForm: { ...defaultModalFormState, open: false },
    });

    render(<ModalFormAcoes />);

    expect(screen.queryByTestId("modal-container")).not.toBeInTheDocument();
  });

  test("deve renderizar o título 'Adicionar ação' no modo de adição", () => {
    render(<ModalFormAcoes />);

    expect(screen.getByText("Adicionar ação")).toBeInTheDocument();
  });

  test("deve renderizar o título 'Editar ação' e o botão Excluir no modo de edição", () => {
    useAcoesContext.mockReturnValue({
      ...defaultAcoesContext,
      modalForm: {
        ...defaultModalFormState,
        operacao: "edit",
        id: 123,
        nome: "Ação Existente",
      },
    });

    render(<ModalFormAcoes />);

    expect(screen.getByText("Editar ação")).toBeInTheDocument();
    expect(screen.getByText("ID: 123")).toBeInTheDocument();

    const btnExcluir = screen.getByTestId("botao-confirmar-excluir-acao");
    expect(btnExcluir).toBeInTheDocument();
  });

  test("deve renderizar opções do recurso e manter o campo select desabilitado", () => {
    render(<ModalFormAcoes />);

    const selectRecurso = screen.getByTestId("input-recurso");
    expect(selectRecurso).toBeDisabled();
    expect(selectRecurso).toHaveValue("rec-1");

    expect(screen.getByTestId("option-recurso-rec-1")).toBeInTheDocument();
    expect(screen.getByTestId("option-recurso-rec-2")).toBeInTheDocument();
  });

  test("deve enviar o UUID do recurso no payload da submissão do formulário", async () => {
    render(<ModalFormAcoes />);

    // Altera alguns valores do formulário
    const inputNome = screen.getByTestId("campo-nome-acao");
    fireEvent.change(inputNome, { target: { name: "nome", value: "Nova Ação com UUID do Recurso" } });

    const radioCapitalFalse = screen.getByTestId("campo-aceita-capital-false");
    fireEvent.click(radioCapitalFalse);

    // Dispara a submissão do formulário
    const btnSalvar = screen.getByTestId("botao-submit-modal-acoes");
    fireEvent.click(btnSalvar);

    await waitFor(() => {
      expect(mockHandleSubmitFormModal).toHaveBeenCalledTimes(1);
      
      // Valida que no envio do formulário, o objeto recurso contém o uuid (ou se for string, valida 'rec-1')
      expect(mockHandleSubmitFormModal).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: "Nova Ação com UUID do Recurso",
          aceita_capital: false,
          recurso: expect.objectContaining({
            uuid: "rec-1",
          }),
        }),
        expect.anything()
      );
    });
  });

  test("deve desabilitar campos e botões quando a permissão de edição for falsa (readOnly)", () => {
    useAcoesContext.mockReturnValue({
      ...defaultAcoesContext,
      TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES: false,
      modalForm: { ...defaultModalFormState, operacao: "edit" },
    });

    render(<ModalFormAcoes />);

    expect(screen.getByTestId("campo-nome-acao")).toBeDisabled();
    expect(screen.getByTestId("campo-aceita-capital-true")).toBeDisabled();
    expect(screen.getByTestId("campo-aceita-capital-false")).toBeDisabled();
    expect(screen.getByTestId("botao-submit-modal-acoes")).toBeDisabled();
    expect(screen.getByTestId("botao-confirmar-excluir-acao")).toBeDisabled();
  });

  test("deve acionar handleOpenModalDeleteAcao ao clicar no botão 'Excluir'", () => {
    useAcoesContext.mockReturnValue({
      ...defaultAcoesContext,
      modalForm: { ...defaultModalFormState, operacao: "edit" },
    });

    render(<ModalFormAcoes />);

    const btnExcluir = screen.getByTestId("botao-confirmar-excluir-acao");
    fireEvent.click(btnExcluir);

    expect(mockHandleOpenModalDeleteAcao).toHaveBeenCalledTimes(1);
  });

  test("deve chamar handleClose ao clicar nos botões 'Cancelar' ou 'Fechar Modal'", () => {
    render(<ModalFormAcoes />);

    const btnCancelar = screen.getByText("Cancelar");
    fireEvent.click(btnCancelar);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });
});