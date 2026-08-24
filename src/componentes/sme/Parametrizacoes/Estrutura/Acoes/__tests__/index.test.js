import React from "react";
import { render, screen, configure } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Acoes } from "../index";

// Configura o Testing Library para identificar o atributo 'data-qa'
configure({ testIdAttribute: "data-qa" });

// Mock do PaginasContainer
jest.mock("../../../../../../paginas/PaginasContainer", () => ({
  PaginasContainer: ({ children }) => (
    <div data-qa="paginas-container">{children}</div>
  ),
}));

// Mock do AcoesContextProvider
jest.mock("../context/AcoesContext", () => ({
  AcoesContextProvider: ({ children }) => (
    <div data-qa="acoes-context-provider">{children}</div>
  ),
}));

// Mock dos subcomponentes de layout e conteúdo
jest.mock("../../../componentes/AbasPorRecurso", () => ({
  AbasPorRecurso: () => <div data-qa="abas-por-recurso">AbasPorRecurso</div>,
}));

jest.mock("../components/TopoComBotoes", () => ({
  TopoComBotoes: () => <div data-qa="topo-com-botoes">TopoComBotoes</div>,
}));

jest.mock("../components/Filtros", () => ({
  Filtros: () => <div data-qa="filtros-component">Filtros</div>,
}));

jest.mock("../components/TabelaAcoes", () => ({
  TabelaAcoes: () => <div data-qa="tabela-acoes">TabelaAcoes</div>,
}));

jest.mock("../components/ModalFormAcoes", () => ({
  ModalFormAcoes: () => <div data-qa="modal-form-acoes">ModalFormAcoes</div>,
}));

jest.mock("../components/ModalConfirmDeleteAcao", () => ({
  ModalConfirmDeleteAcao: () => (
    <div data-qa="modal-confirm-delete-acao">ModalConfirmDeleteAcao</div>
  ),
}));

describe("Componente Refatorado <Acoes />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve renderizar os wrappers principais (PaginasContainer e AcoesContextProvider)", () => {
    render(<Acoes />);

    expect(screen.getByTestId("paginas-container")).toBeInTheDocument();
    expect(screen.getByTestId("acoes-context-provider")).toBeInTheDocument();
  });

  test("deve renderizar o título principal da página h1 com a classe CSS e texto corretos", () => {
    render(<Acoes />);

    const titulo = screen.getByRole("heading", { level: 1, name: "Ações" });
    expect(titulo).toBeInTheDocument();
    expect(titulo).toHaveClass("titulo-itens-painel", "mt-5");
  });

  test("deve renderizar todos os subcomponentes na árvore DOM na estrutura esperada", () => {
    render(<Acoes />);

    // Seções principais
    expect(screen.getByTestId("abas-por-recurso")).toBeInTheDocument();
    expect(screen.getByTestId("topo-com-botoes")).toBeInTheDocument();
    expect(screen.getByTestId("filtros-component")).toBeInTheDocument();
    expect(screen.getByTestId("tabela-acoes")).toBeInTheDocument();

    // Modais
    expect(screen.getByTestId("modal-form-acoes")).toBeInTheDocument();
    expect(screen.getByTestId("modal-confirm-delete-acao")).toBeInTheDocument();
  });

  test("deve garantir que os elementos são descendentes do AcoesContextProvider", () => {
    render(<Acoes />);

    const provider = screen.getByTestId("acoes-context-provider");

    expect(provider).toContainElement(
      screen.getByRole("heading", { level: 1, name: "Ações" })
    );
    expect(provider).toContainElement(screen.getByTestId("abas-por-recurso"));
    expect(provider).toContainElement(screen.getByTestId("topo-com-botoes"));
    expect(provider).toContainElement(screen.getByTestId("filtros-component"));
    expect(provider).toContainElement(screen.getByTestId("tabela-acoes"));
    expect(provider).toContainElement(screen.getByTestId("modal-form-acoes"));
    expect(provider).toContainElement(
      screen.getByTestId("modal-confirm-delete-acao")
    );
  });
});