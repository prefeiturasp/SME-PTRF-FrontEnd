import React from "react";
import { render, screen, fireEvent, configure } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TopoComBotoes } from "../components/TopoComBotoes";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { useAcoesContext } from "../hooks/useAcoesContext";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

// Configura o Testing Library para identificar o atributo 'data-qa'
configure({ testIdAttribute: "data-qa" });

// Mock dos Hooks de Contexto e Funções de Permissão
jest.mock("../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext", () => ({
  useAbasPorRecursoContext: jest.fn(),
}));

jest.mock("../hooks/useAcoesContext", () => ({
  useAcoesContext: jest.fn(),
}));

jest.mock("../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

// Mock do FontAwesomeIcon para simplificar o teste de UI do ícone
jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ "data-qa": dataQa }) => (
    <span data-qa={dataQa}>fa-plus-icon</span>
  ),
}));

describe("Componente <TopoComBotoes />", () => {
  const mockHandleOpenCreateModal = jest.fn();

  const mockSelectedRecurso = {
    uuid: "recurso-123-uuid",
    nome: "Recurso Teste",
    nome_exibicao: "recurso de teste",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useAcoesContext.mockReturnValue({
      handleOpenCreateModal: mockHandleOpenCreateModal,
    });

    useAbasPorRecursoContext.mockReturnValue({
      selectedRecurso: mockSelectedRecurso,
    });

    // Padrão: usuário com permissão de edição
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  test("deve renderizar o nome e o nome de exibição do recurso selecionado", () => {
    render(<TopoComBotoes />);

    // Verifica o título principal h5
    expect(
      screen.getByRole("heading", { level: 5, name: "Recurso Teste" })
    ).toBeInTheDocument();

    // Verifica a descrição
    expect(
      screen.getByText("Confira abaixo as ações do recurso de teste.")
    ).toBeInTheDocument();
  });

  test("deve lidar adequadamente quando selectedRecurso for undefined/null", () => {
    useAbasPorRecursoContext.mockReturnValue({
      selectedRecurso: null,
    });

    render(<TopoComBotoes />);

    expect(
      screen.getByText("Confira abaixo as ações do .")
    ).toBeInTheDocument();
  });

  test("deve habilitar o botão de 'Adicionar ação' quando o usuário possuir permissão de edição", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(<TopoComBotoes />);

    const btnAdicionar = screen.getByRole("button", { name: /Adicionar ação/i });
    expect(btnAdicionar).toBeInTheDocument();
    expect(btnAdicionar).not.toBeDisabled();

    // Verifica a renderização do ícone no botão
    expect(
      screen.getByTestId("botao-adicionar-acoes-icone")
    ).toBeInTheDocument();
  });

  test("deve desabilitar o botão de 'Adicionar ação' quando o usuário NÃO possuir permissão de edição", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    render(<TopoComBotoes />);

    const btnAdicionar = screen.getByRole("button", { name: /Adicionar ação/i });
    expect(btnAdicionar).toBeDisabled();
  });

  test("deve disparar handleOpenCreateModal ao clicar no botão 'Adicionar ação'", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(<TopoComBotoes />);

    const btnAdicionar = screen.getByRole("button", { name: /Adicionar ação/i });
    fireEvent.click(btnAdicionar);

    expect(mockHandleOpenCreateModal).toHaveBeenCalledTimes(1);
  });
});