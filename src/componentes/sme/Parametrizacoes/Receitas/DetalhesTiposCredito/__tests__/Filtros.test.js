import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("../hooks/useDetalhesTiposCreditoContext", () => ({
  useDetalhesTiposCreditoContext: jest.fn()
}));
jest.mock("../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext", () => ({
  useAbasPorRecursoContext: jest.fn()
}));

describe("Filtros", () => {
  let mockSetFilter;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSetFilter = jest.fn();

    require("../hooks/useDetalhesTiposCreditoContext").useDetalhesTiposCreditoContext.mockReturnValue({
      setFilter: mockSetFilter,
      initialFilter: { nome: "", page: 1, recurso_uuid: "" }
    });

    require("../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext").useAbasPorRecursoContext.mockReturnValue({
      selectedRecurso: { uuid: "rec-1", nome: "Recurso" }
    });
  });

  describe("Renderização", () => {
    it("deve renderizar formulário de filtros", () => {
      const { Filtros } = require("../components/Filtros");
      const { container } = render(<Filtros />);
      expect(container.querySelector("form")).toBeInTheDocument();
    });

    it("deve renderizar label do filtro", () => {
      const { Filtros } = require("../components/Filtros");
      render(<Filtros />);
      expect(screen.getByText("Filtrar por detalhe de tipo de crédito")).toBeInTheDocument();
    });

    it("deve renderizar input de filtro", () => {
      const { Filtros } = require("../components/Filtros");
      render(<Filtros />);
      expect(screen.getByPlaceholderText("Busque por detalhe de tipo de crédito")).toBeInTheDocument();
    });

    it("deve renderizar botões de ação", () => {
      const { Filtros } = require("../components/Filtros");
      render(<Filtros />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe("Funcionalidade de Filtro", () => {
    it("deve inicializar com valores vazios", () => {
      const { Filtros } = require("../components/Filtros");
      render(<Filtros />);
      const input = screen.getByPlaceholderText("Busque por detalhe de tipo de crédito");
      expect(input.value).toBe("");
    });

    it("deve atualizar input ao digitar", async () => {
      const { Filtros } = require("../components/Filtros");
      render(<Filtros />);
      const input = screen.getByPlaceholderText("Busque por detalhe de tipo de crédito");
      
      await userEvent.type(input, "Teste de Filtro");
      expect(input.value).toBe("Teste de Filtro");
    });

    it("deve enviar formulário com Enter", async () => {
      const { Filtros } = require("../components/Filtros");
      render(<Filtros />);
      const input = screen.getByPlaceholderText("Busque por detalhe de tipo de crédito");
      
      await userEvent.type(input, "Teste");
      await userEvent.keyboard("{Enter}");
      
      expect(mockSetFilter).toHaveBeenCalled();
    });
  });

  describe("Limpeza de Filtros", () => {
    it("deve ter botão limpar filtros", () => {
      const { Filtros } = require("../components/Filtros");
      render(<Filtros />);
      const buttons = screen.getAllByRole("button");
      const clearButton = buttons.find(btn => btn.textContent.toLowerCase().includes("limpar"));
      expect(clearButton).toBeInTheDocument();
    });

    it("deve limpar filtro ao clicar em limpar", async () => {
      const { Filtros } = require("../components/Filtros");
      render(<Filtros />);
      const input = screen.getByPlaceholderText("Busque por detalhe de tipo de crédito");
      
      await userEvent.type(input, "Teste");
      expect(input.value).toBe("Teste");
      
      const buttons = screen.getAllByRole("button");
      const clearButton = buttons.find(btn => btn.textContent.toLowerCase().includes("limpar"));
      await userEvent.click(clearButton);
      
      expect(mockSetFilter).toHaveBeenCalled();
    });
  });
});
