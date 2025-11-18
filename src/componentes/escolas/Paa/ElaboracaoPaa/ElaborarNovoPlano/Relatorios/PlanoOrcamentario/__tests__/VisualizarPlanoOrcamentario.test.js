import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { VisualizarPlanoOrcamentario } from "../VisualizarPlanoOrcamentario";
import { useNavigate } from "react-router-dom";
import { useGetReceitasPrevistas } from "../../../ReceitasPrevistas/hooks/useGetReceitasPrevistas";
import { useGetPrioridadesRelatorio } from "../../PlanoAplicacao/hooks/useGetPrioridadesRelatorio";
import { useGetProgramasPddeTotais } from "../../../ReceitasPrevistas/hooks/useGetProgramasPddeTotais";
import { useGetTotalizadorRecursoProprio } from "../../../DetalhamentoRecursosProprios/hooks/useGetTotalizarRecursoProprio";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../../../ReceitasPrevistas/hooks/useGetReceitasPrevistas", () => ({
  useGetReceitasPrevistas: jest.fn(),
}));

jest.mock("../../PlanoAplicacao/hooks/useGetPrioridadesRelatorio", () => ({
  useGetPrioridadesRelatorio: jest.fn(),
}));

jest.mock("../../../ReceitasPrevistas/hooks/useGetProgramasPddeTotais", () => ({
  useGetProgramasPddeTotais: jest.fn(),
}));

jest.mock(
  "../../../DetalhamentoRecursosProprios/hooks/useGetTotalizarRecursoProprio",
  () => ({
    useGetTotalizadorRecursoProprio: jest.fn(),
  })
);

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

    useGetReceitasPrevistas.mockReturnValue({
      data: [
        {
          uuid: "receita-1",
          acao: { nome: "Ação PTRF" },
          saldos: {
            saldo_atual_custeio: 0,
            saldo_atual_capital: 0,
            saldo_atual_livre: 0,
          },
          receitas_previstas_paa: [
            {
              previsao_valor_custeio: 1000,
              previsao_valor_capital: 0,
              previsao_valor_livre: 0,
            },
          ],
        },
        {
          uuid: "receita-2",
          acao: { nome: "Recursos próprios", e_recursos_proprios: true },
          saldos: {
            saldo_atual_custeio: 0,
            saldo_atual_capital: 0,
            saldo_atual_livre: 0,
          },
          receitas_previstas_paa: [],
        },
      ],
      isLoading: false,
      isFetching: false,
      isError: false,
    });

    useGetPrioridadesRelatorio.mockReturnValue({
      prioridades: [],
      isFetching: false,
      isError: false,
    });

    useGetProgramasPddeTotais.mockReturnValue({
      programas: [
        {
          uuid: "programa-1",
          nome: "Programa PDDE",
          total_valor_custeio: 0,
          total_valor_capital: 0,
          total_valor_livre_aplicacao: 0,
        },
      ],
      isLoading: false,
      isError: false,
    });

    useGetTotalizadorRecursoProprio.mockReturnValue({
      data: { total: 0 },
      isLoading: false,
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

