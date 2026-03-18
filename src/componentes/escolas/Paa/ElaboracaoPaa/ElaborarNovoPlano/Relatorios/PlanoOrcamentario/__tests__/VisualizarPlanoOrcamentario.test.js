import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { VisualizarPlanoOrcamentario } from "../VisualizarPlanoOrcamentario";
import { useNavigate } from "react-router-dom";
import { useGetPlanoOrcamentario } from "../hooks/useGetPlanoOrcamentario";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../hooks/useGetPlanoOrcamentario", () => ({
  useGetPlanoOrcamentario: jest.fn(),
}));

jest.mock("../../components/RelatorioTabelaGrupo", () => ({
  __esModule: true,
  RelatorioTabelaGrupo: ({ headerExtra }) => (
    <div data-testid="relatorio-tabela-grupo">{headerExtra}</div>
  ),
}));

jest.mock(
  "../../components/RelatorioVisualizacao",
  () => ({
    __esModule: true,
    RelatorioVisualizacao({
      children,
      headerActions,
      onBack = () => {},
    }) {
      return (
        <div>
          <div>{headerActions}</div>
          <button type="button" onClick={onBack}>
            Voltar
          </button>
          <div>{children}</div>
        </div>
      );
    },
  })
);

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => {
      const listeners = new Set();
      const mql = {
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn((callback) => {
          listeners.add(callback);
          callback({ matches: false });
        }),
        removeListener: jest.fn((callback) => {
          listeners.delete(callback);
        }),
        addEventListener: jest.fn((_, callback) => {
          listeners.add(callback);
          callback({ matches: false });
        }),
        removeEventListener: jest.fn((_, callback) => {
          listeners.delete(callback);
        }),
        dispatchEvent: jest.fn(),
      };
      return mql;
    }),
  });
});

describe("VisualizarPlanoOrcamentario", () => {
  const navigateMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(navigateMock);

    useGetPlanoOrcamentario.mockReturnValue({
      data: {
        secoes: [
          { key: "ptrf", titulo: "PTRF", linhas: [] },
          { key: "pdde", titulo: "PDDE", linhas: [] },
          { key: "outros_recursos", titulo: "Outros Recursos", linhas: [] },
        ],
      },
      isLoading: false,
      isFetching: false,
      isError: false,
    });
  });

  it("redireciona corretamente ao clicar nos botões de editar receitas e prioridades", () => {
    render(<VisualizarPlanoOrcamentario />);

    const botoesEditarReceitas = screen.getAllByRole("button", {
      name: /editar receitas/i,
    });
    const botoesEditarPrioridades = screen.getAllByRole("button", {
      name: /editar prioridades/i,
    });

    expect(botoesEditarReceitas.length).toBeGreaterThanOrEqual(3);
    expect(botoesEditarPrioridades.length).toBeGreaterThan(0);

    fireEvent.click(botoesEditarReceitas[0]);
    expect(navigateMock).toHaveBeenNthCalledWith(1, "/elaborar-novo-paa", {
      state: {
        activeTab: "receitas",
        receitasDestino: "ptrf",
        fromPlanoOrcamentario: true,
      },
    });

    fireEvent.click(botoesEditarReceitas[1]);
    expect(navigateMock).toHaveBeenNthCalledWith(2, "/elaborar-novo-paa", {
      state: {
        activeTab: "receitas",
        receitasDestino: "pdde",
        fromPlanoOrcamentario: true,
      },
    });

    fireEvent.click(botoesEditarReceitas[2]);
    expect(navigateMock).toHaveBeenNthCalledWith(3, "/elaborar-novo-paa", {
      state: {
        activeTab: "receitas",
        receitasDestino: "recursos-proprios",
        fromPlanoOrcamentario: true,
      },
    });

    fireEvent.click(botoesEditarPrioridades[0]);
    expect(navigateMock).toHaveBeenNthCalledWith(4, "/elaborar-novo-paa", {
      state: {
        activeTab: "prioridades-list",
        fromPlanoOrcamentario: true,
      },
    });
  });
});

