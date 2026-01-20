import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { useGetPrioridadesRelatorio } from "../hooks/useGetPrioridadesRelatorio";
import { VisualizarPlanoAplicacao } from "../VisualizarPlanoAplicacao";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../hooks/useGetPrioridadesRelatorio", () => ({
  useGetPrioridadesRelatorio: jest.fn(),
}));

describe("VisualizarPlanoAplicacao", () => {
  const navigateMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(navigateMock);
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it("redireciona corretamente ao clicar nos botões da tela", () => {
    useGetPrioridadesRelatorio.mockReturnValue({
      prioridades: [
        {
          uuid: "prioridade-1",
          prioridade: true,
          recurso: "PTRF",
          valor_total: 100,
        },
        {
          uuid: "prioridade-2",
          prioridade: false,
          recurso: "PTRF",
          valor_total: 50,
        },
      ],
      isFetching: false,
      isError: false,
    });

    render(<VisualizarPlanoAplicacao />);

    const botaoEditarInformacoes = screen.getByRole("button", {
      name: /editar informações/i,
    });

    fireEvent.click(botaoEditarInformacoes);
    expect(navigateMock).toHaveBeenNthCalledWith(1, "/elaborar-novo-paa", {
      state: {
        activeTab: "prioridades-list",
        fromPlanoAplicacao: true,
      },
    });

    const botaoVoltar = screen.getByRole("button", {
      name: /voltar/i,
    });

    fireEvent.click(botaoVoltar);
    expect(navigateMock).toHaveBeenNthCalledWith(2, "/elaborar-novo-paa", {
      state: {
        activeTab: "relatorios",
        expandedSections: {
          planoAnual: true,
          componentes: true,
        },
      },
    });
  });

  it("ordena outros recursos colocando recurso próprio primeiro", async () => {
    useGetPrioridadesRelatorio.mockReturnValue({
      isFetching: false,
      isError: false,
      prioridades: [
        {
          uuid: "rp",
          prioridade: true,
          recurso: "RECURSO_PROPRIO",
          valor_total: 50,
        },
        {
          uuid: "b",
          prioridade: true,
          recurso: "OUTRO_RECURSO",
          outro_recurso_objeto: { nome: "B Recurso" },
          valor_total: 30,
        },
        {
          uuid: "a",
          prioridade: true,
          recurso: "OUTRO_RECURSO",
          outro_recurso_objeto: { nome: "A Recurso" },
          valor_total: 20,
        },
      ],
    });

    render(<VisualizarPlanoAplicacao />);

    const tabela = await screen.findByRole("table");

    const rows = within(tabela).getAllByRole("row");

    // Ignora o header (row[0])
    expect(rows[1]).toHaveAttribute("data-row-key", "rp");
    expect(rows[2]).toHaveAttribute("data-row-key", "a");
    expect(rows[3]).toHaveAttribute("data-row-key", "b");
    expect(rows[4]).toHaveTextContent("TOTAL");
  });
});
