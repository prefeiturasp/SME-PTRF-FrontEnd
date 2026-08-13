import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate, useLocation } from "react-router-dom";
import { AbasPorRecurso } from "../index";

// Importação direta dos hooks
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";
import { useAbasPorRecursoContext } from "../hooks/useAbasPorRecursoContext";

// Mocks do React Router
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

// Mocks dos Contextos e Utilitários
jest.mock("../hooks/useAbasPorRecursoContext", () => ({
  useAbasPorRecursoContext: jest.fn(),
}));

jest.mock("../../../../../../context/RecursoSelecionado", () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));

jest.mock("../../../../../../utils/Loading", () => () => (
  <div data-testid="loading-spinner">Carregando...</div>
));

describe("Componente <AbasPorRecurso />", () => {
  const mockNavigate = jest.fn();
  const mockSetSelectedRecurso = jest.fn();
  const mockSetClickBtnEscolheOpcao = jest.fn();

  // Função geradora de recursos isolados para evitar mutação in-place entre testes
  const getFreshRecursos = () => [
    { uuid: "rec-1", nome: "Recurso 1", nome_exibicao: "Aba Recurso 1", legado: false },
    { uuid: "rec-2", nome: "Recurso 2", nome_exibicao: "Aba Recurso 2", legado: true },
    { uuid: "rec-3", nome: "Recurso 3", nome_exibicao: "Aba Recurso 3", legado: false },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue({ pathname: "/home" });

    // Instâncias limpas para o estado inicial
    const recursos = getFreshRecursos();

    useAbasPorRecursoContext.mockReturnValue({
      selectedRecurso: null,
      setSelectedRecurso: mockSetSelectedRecurso,
      clickBtnEscolheOpcao: {},
      setClickBtnEscolheOpcao: mockSetClickBtnEscolheOpcao,
    });

    useRecursoSelecionadoContext.mockReturnValue({
      isLoading: false,
      recursos,
    });
  });

  describe("1. Estados de Carregamento e Vazio", () => {
    test("deve exibir o componente de Loading quando isLoading for true", () => {
      useRecursoSelecionadoContext.mockReturnValue({
        isLoading: true,
        recursos: [],
      });

      render(<AbasPorRecurso />);

      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });

    test("deve exibir mensagem de nenhum recurso disponível se a lista estiver vazia", () => {
      useRecursoSelecionadoContext.mockReturnValue({
        isLoading: false,
        recursos: [],
      });

      render(<AbasPorRecurso />);

      expect(screen.getByText("Nenhum recurso disponível")).toBeInTheDocument();
    });
  });

  describe("2. Renderização e Ordenação das Abas", () => {
    test("deve renderizar todas as abas de recurso e ordenar legados primeiro", () => {
      render(<AbasPorRecurso />);

      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(3);

      // Recurso 2 possui legado: true, portanto é renderizado em primeiro
      expect(tabs[0]).toHaveTextContent("Aba Recurso 2");
      expect(tabs[1]).toHaveTextContent("Aba Recurso 1");
      expect(tabs[2]).toHaveTextContent("Aba Recurso 3");
    });

    test("deve renderizar abas extras e o divisor visual quando informadas", () => {
      const extraAbas = [
        { id: "extra-1", label: "Relatórios", url: "relatorios" },
      ];

      const { container } = render(<AbasPorRecurso extra_abas={extraAbas} />);

      expect(screen.getByText("Relatórios")).toBeInTheDocument();
      const divider = container.querySelector('div[style*="background-color: rgb(204, 204, 204)"]');
      expect(divider).toBeInTheDocument();
    });
  });

  describe("3. Definição da Aba Ativa (`activeTabId`)", () => {
    test("deve marcar como ativa a aba definida em `tab_initial_active` quando não houver seleção prévia", () => {
      render(<AbasPorRecurso tab_initial_active="rec-1" />);

      const tab1 = screen.getByText("Aba Recurso 1");
      expect(tab1).toHaveClass("btn-escolhe-aba-active");
      expect(tab1).toHaveAttribute("aria-selected", "true");
    });

    test("deve priorizar a aba selecionada no contexto (`selectedRecurso`)", () => {
      const recursos = getFreshRecursos();
      const selectedResource = recursos[0]; // rec-1 ("Aba Recurso 1")

      useAbasPorRecursoContext.mockReturnValue({
        selectedRecurso: selectedResource,
        setSelectedRecurso: mockSetSelectedRecurso,
        clickBtnEscolheOpcao: { "rec-1": true },
        setClickBtnEscolheOpcao: mockSetClickBtnEscolheOpcao,
      });

      useRecursoSelecionadoContext.mockReturnValue({
        isLoading: false,
        recursos,
      });

      render(<AbasPorRecurso tab_initial_active="rec-3" />);

      const tab1 = screen.getByText("Aba Recurso 1");
      expect(tab1).toHaveClass("btn-escolhe-aba-active");
    });

    test("deve priorizar a aba extra se a URL atual corresponder à rota da aba extra", () => {
      useLocation.mockReturnValue({ pathname: "/dashboard/relatorios" });

      const extraAbas = [
        { id: "extra-1", label: "Relatórios", url: "dashboard/relatorios" },
      ];

      render(<AbasPorRecurso extra_abas={extraAbas} />);

      const extraTab = screen.getByText("Relatórios");
      expect(extraTab).toHaveClass("btn-escolhe-aba-active");
    });
  });

  describe("4. Interações do Usuário (Eventos de Clique)", () => {
    test("deve atualizar estado do contexto e executar callback ao clicar em uma aba de recurso", () => {
      const mockExtraHandleClick = jest.fn();
      const recursos = getFreshRecursos();

      useRecursoSelecionadoContext.mockReturnValue({
        isLoading: false,
        recursos,
      });

      render(<AbasPorRecurso extra_handle_click_tab_recurso={mockExtraHandleClick} />);

      const tab1 = screen.getByText("Aba Recurso 1");
      fireEvent.click(tab1);

      expect(mockSetClickBtnEscolheOpcao).toHaveBeenCalledWith({ "rec-1": true });
      expect(mockSetSelectedRecurso).toHaveBeenCalledWith(expect.objectContaining({ uuid: "rec-1" }));
      expect(mockExtraHandleClick).toHaveBeenCalledTimes(1);
    });

    test("deve limpar recurso selecionado, atualizar opção e navegar ao clicar em uma aba extra", () => {
      const extraAbas = [
        { id: "extra-config", label: "Configurações", url: "config" },
      ];

      render(<AbasPorRecurso extra_abas={extraAbas} />);

      const extraTab = screen.getByText("Configurações");
      fireEvent.click(extraTab);

      expect(mockSetSelectedRecurso).toHaveBeenCalledWith(null);
      expect(mockSetClickBtnEscolheOpcao).toHaveBeenCalledWith({ "extra-config": true });
      expect(mockNavigate).toHaveBeenCalledWith("/config/");
    });
  });

  describe("5. Efeitos de Sincronização e Limpeza (`useEffect`)", () => {
    test("deve selecionar automaticamente a primeira aba de recurso na carga inicial", () => {
      render(<AbasPorRecurso />);

      // Por conta da ordenação (legado: true), o recurso 2 vem em primeiro
      expect(mockSetSelectedRecurso).toHaveBeenCalledWith(expect.objectContaining({ uuid: "rec-2" }));
      expect(mockSetClickBtnEscolheOpcao).toHaveBeenCalledWith({ "rec-2": true });
    });

    test("deve resetar o contexto quando o componente for desmontado para navegar para outra tela", () => {
      const { unmount } = render(<AbasPorRecurso />);

      // Simula navegação para outra página na desmontagem
      Object.defineProperty(window, "location", {
        value: { pathname: "/outra-tela-qualquer" },
        writable: true,
      });

      unmount();

      expect(mockSetSelectedRecurso).toHaveBeenCalledWith(null);
      expect(mockSetClickBtnEscolheOpcao).toHaveBeenCalledWith({});
    });
  });
});