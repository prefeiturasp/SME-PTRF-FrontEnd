import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { VisualizarPlanoOrcamentario } from "../VisualizarPlanoOrcamentario";
import { useNavigate } from "react-router-dom";
import { useGetPlanoOrcamentario } from "../hooks/useGetPlanoOrcamentario";
import { useGetPaa } from "../../../../../componentes/hooks/useGetPaa";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../hooks/useGetPlanoOrcamentario", () => ({
  useGetPlanoOrcamentario: jest.fn(),
}));

jest.mock("../../../../../componentes/hooks/useGetPaa", () => ({
  useGetPaa: jest.fn(),
}));

let mockCapturedTabelaProps = [];

jest.mock("../../components/RelatorioTabelaGrupo", () => ({
  __esModule: true,
  RelatorioTabelaGrupo: (props) => {
    mockCapturedTabelaProps.push(props);
    return <div data-testid="relatorio-tabela-grupo">{props.headerExtra}</div>;
  },
}));

jest.mock(
  "../../components/RelatorioVisualizacao",
  () => ({
    __esModule: true,
    RelatorioVisualizacao({ children, headerActions, onBack = () => {} }) {
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

jest.mock("../../../../../componentes/TagRetificacao", () => ({
  TagRetificacao: () => <span data-testid="tag-retificacao" />,
}));

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => {
      const listeners = new Set();
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn((cb) => {
          listeners.add(cb);
          cb({ matches: false });
        }),
        removeListener: jest.fn((cb) => listeners.delete(cb)),
        addEventListener: jest.fn((_, cb) => {
          listeners.add(cb);
          cb({ matches: false });
        }),
        removeEventListener: jest.fn((_, cb) => listeners.delete(cb)),
        dispatchEvent: jest.fn(),
      };
    }),
  });
});

describe("VisualizarPlanoOrcamentario", () => {
  const navigateMock = jest.fn();

  const defaultPaa = { uuid: "paa-123", status: "EM_ELABORACAO" };

  const defaultSecoes = [
    { key: "ptrf", titulo: "PTRF", linhas: [] },
    { key: "pdde", titulo: "PDDE", linhas: [] },
    { key: "outros_recursos", titulo: "Outros Recursos", linhas: [] },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockCapturedTabelaProps = [];
    useNavigate.mockReturnValue(navigateMock);
    useGetPaa.mockReturnValue({
      data: defaultPaa,
      refetch: jest.fn(),
      isFetching: false,
    });
    useGetPlanoOrcamentario.mockReturnValue({
      data: { secoes: defaultSecoes },
      isLoading: false,
      isFetching: false,
      isError: false,
    });
  });

  it("não renderiza nada quando paa não está disponível", () => {
    useGetPaa.mockReturnValue({ data: undefined, refetch: jest.fn(), isFetching: false });
    const { container } = render(<VisualizarPlanoOrcamentario />);
    expect(container.innerHTML).toBe("");
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
        receitasDestino: "outros-recursos",
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

  it("redireciona para aba de relatórios ao clicar em Voltar", () => {
    render(<VisualizarPlanoOrcamentario />);
    fireEvent.click(screen.getByRole("button", { name: /voltar/i }));
    expect(navigateMock).toHaveBeenCalledWith("/elaborar-novo-paa", {
      state: {
        activeTab: "relatorios",
        expandedSections: {
          planoAnual: true,
          componentes: true,
        },
      },
    });
  });

  describe("navegação em modo EM_RETIFICACAO", () => {
    const paaRetificacao = { uuid: "paa-retif-456", status: "EM_RETIFICACAO" };

    beforeEach(() => {
      useGetPaa.mockReturnValue({
        data: paaRetificacao,
        refetch: jest.fn(),
        isFetching: false,
      });
    });

    it("Voltar navega para rota de retificação", () => {
      render(<VisualizarPlanoOrcamentario />);
      fireEvent.click(screen.getByRole("button", { name: /voltar/i }));
      expect(navigateMock).toHaveBeenCalledWith(
        `/retificacao-paa/${paaRetificacao.uuid}`,
        {
          state: {
            activeTab: "relatorios",
            expandedSections: { planoAnual: true, componentes: true },
          },
        }
      );
    });

    it("Editar receitas navega para rota de retificação", () => {
      render(<VisualizarPlanoOrcamentario />);
      const botoesReceitas = screen.getAllByRole("button", { name: /editar receitas/i });
      fireEvent.click(botoesReceitas[0]);
      expect(navigateMock).toHaveBeenCalledWith(
        `/retificacao-paa/${paaRetificacao.uuid}`,
        {
          state: {
            activeTab: "receitas",
            receitasDestino: "ptrf",
            fromPlanoOrcamentario: true,
          },
        }
      );
    });

    it("Editar prioridades navega para rota de retificação", () => {
      render(<VisualizarPlanoOrcamentario />);
      const botoesPrioridades = screen.getAllByRole("button", { name: /editar prioridades/i });
      fireEvent.click(botoesPrioridades[0]);
      expect(navigateMock).toHaveBeenCalledWith(
        `/retificacao-paa/${paaRetificacao.uuid}`,
        {
          state: {
            activeTab: "prioridades-list",
            fromPlanoOrcamentario: true,
          },
        }
      );
    });
  });

  it("não renderiza tabelas quando secoes está vazio", () => {
    useGetPlanoOrcamentario.mockReturnValue({
      data: { secoes: [] },
      isLoading: false,
      isFetching: false,
      isError: false,
    });
    render(<VisualizarPlanoOrcamentario />);
    expect(screen.queryByTestId("relatorio-tabela-grupo")).not.toBeInTheDocument();
  });

  it("não renderiza tabelas quando data é undefined (isLoading=true)", () => {
    useGetPlanoOrcamentario.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: false,
      isError: false,
    });
    render(<VisualizarPlanoOrcamentario />);
    expect(screen.queryByTestId("relatorio-tabela-grupo")).not.toBeInTheDocument();
  });

  it("isFetching=true cobre ramo carregando=true", () => {
    useGetPlanoOrcamentario.mockReturnValue({
      data: { secoes: defaultSecoes },
      isLoading: false,
      isFetching: true,
      isError: false,
    });
    render(<VisualizarPlanoOrcamentario />);
    expect(screen.getAllByTestId("relatorio-tabela-grupo").length).toBeGreaterThan(0);
  });

  it("renderiza seção sem ações (headerExtra null) para chave desconhecida", () => {
    useGetPlanoOrcamentario.mockReturnValue({
      data: { secoes: [{ key: "desconhecido", titulo: "Desconhecido", linhas: [] }] },
      isLoading: false,
      isFetching: false,
      isError: false,
    });
    render(<VisualizarPlanoOrcamentario />);
    expect(mockCapturedTabelaProps[0].headerExtra).toBeNull();
  });

  describe("rowKey e rowClassName passados ao RelatorioTabelaGrupo", () => {
    beforeEach(() => {
      render(<VisualizarPlanoOrcamentario />);
    });

    it("rowKey retorna linha.key", () => {
      const { rowKey } = mockCapturedTabelaProps[0];
      expect(rowKey({ key: "abc-123" })).toBe("abc-123");
      expect(rowKey({})).toBeUndefined();
      expect(rowKey(null)).toBeUndefined();
    });

    it("rowClassName retorna classe de total para linha isTotal=true", () => {
      const { rowClassName } = mockCapturedTabelaProps[0].tableProps;
      expect(rowClassName({ isTotal: true })).toBe(
        "relatorio-plano-orcamentario__table-total-row"
      );
    });

    it("rowClassName retorna string vazia para linha normal", () => {
      const { rowClassName } = mockCapturedTabelaProps[0].tableProps;
      expect(rowClassName({ isTotal: false })).toBe("");
      expect(rowClassName({})).toBe("");
    });
  });

  describe("coluna Recursos (nome) — render", () => {
    let col;

    beforeEach(() => {
      render(<VisualizarPlanoOrcamentario />);
      col = mockCapturedTabelaProps[0].columns[0];
    });

    it("renderiza span sem classe total e sem TagRetificacao para linha normal", () => {
      const { container } = render(
        col.render("Nome Recurso", { isTotal: false, historicos: null })
      );
      const span = container.querySelector("span");
      expect(span).toHaveClass("relatorio-plano-orcamentario__recurso");
      expect(span).not.toHaveClass("relatorio-plano-orcamentario__recurso--total");
      expect(container.querySelector("[data-testid='tag-retificacao']")).not.toBeInTheDocument();
    });

    it("renderiza span com classe total para linha isTotal=true", () => {
      const { container } = render(col.render("Total", { isTotal: true }));
      expect(container.querySelector("span")).toHaveClass(
        "relatorio-plano-orcamentario__recurso--total"
      );
    });

    it("renderiza TagRetificacao quando historicos é truthy", () => {
      const { queryByTestId } = render(
        col.render("Nome", { isTotal: false, historicos: [{ uuid: "1" }] })
      );
      expect(queryByTestId("tag-retificacao")).toBeInTheDocument();
    });
  });

  describe("coluna receitas-despesas-legendas — render", () => {
    let col;

    beforeEach(() => {
      render(<VisualizarPlanoOrcamentario />);
      col = mockCapturedTabelaProps[0].columns[1];
    });

    it("retorna null para linha isTotal=true", () => {
      expect(col.render(null, { isTotal: true })).toBeNull();
    });

    it("exibe todos os labels quando flags são undefined (padrão = exibir)", () => {
      const { getByText } = render(col.render(null, {}));
      expect(getByText("Custeio (R$)")).toBeInTheDocument();
      expect(getByText("Capital (R$)")).toBeInTheDocument();
      expect(getByText("Livre Aplicação (R$)")).toBeInTheDocument();
    });

    it("omite Custeio quando exibirCusteio=false", () => {
      const { queryByText } = render(col.render(null, { exibirCusteio: false }));
      expect(queryByText("Custeio (R$)")).not.toBeInTheDocument();
      expect(queryByText("Capital (R$)")).toBeInTheDocument();
    });

    it("omite Capital quando exibirCapital=false", () => {
      const { queryByText } = render(col.render(null, { exibirCapital: false }));
      expect(queryByText("Capital (R$)")).not.toBeInTheDocument();
      expect(queryByText("Custeio (R$)")).toBeInTheDocument();
    });

    it("omite Livre Aplicação quando exibirLivre=false", () => {
      const { queryByText } = render(col.render(null, { exibirLivre: false }));
      expect(queryByText("Livre Aplicação (R$)")).not.toBeInTheDocument();
    });

    it("retorna null quando todos os flags são false (sem labels)", () => {
      const result = col.render(null, {
        exibirCusteio: false,
        exibirCapital: false,
        exibirLivre: false,
      });
      expect(result).toBeNull();
    });

    it("trata linha null com segurança (exibe todos os labels)", () => {
      const { getByText } = render(col.render(null, null));
      expect(getByText("Custeio (R$)")).toBeInTheDocument();
    });
  });

  describe("colunas Receitas / Despesas / Saldo — formatResumo e formatResumoTotal", () => {
    let columns;
    const valores = { custeio: 100, capital: 200, livre: 300, total: 600 };

    beforeEach(() => {
      render(<VisualizarPlanoOrcamentario />);
      columns = mockCapturedTabelaProps[0].columns;
    });

    describe("coluna Receitas", () => {
      it("usa formatResumoTotal para linha isTotal=true", () => {
        const { container } = render(
          columns[2].render({ total: 1000 }, { isTotal: true })
        );
        expect(
          container.querySelector(".relatorio-plano-orcamentario__receitas--total")
        ).toBeInTheDocument();
      });

      it("retorna null quando valores são null e isTotal=true", () => {
        expect(columns[2].render(null, { isTotal: true })).toBeNull();
      });

      it("usa formatResumo com spans para linha normal", () => {
        const { container } = render(
          columns[2].render(valores, { isTotal: false, ocultarCusteioCapital: false })
        );
        expect(
          container.querySelector(".relatorio-plano-orcamentario__receitas")
        ).toBeInTheDocument();
        expect(container.querySelectorAll("span").length).toBeGreaterThan(0);
      });

      it("retorna null quando receitas são null para linha normal", () => {
        expect(
          columns[2].render(null, { isTotal: false, ocultarCusteioCapital: false })
        ).toBeNull();
      });

      it("exibe hífen para custeio e capital quando ocultarCusteioCapital=true", () => {
        const { getAllByText } = render(
          columns[2].render(valores, { isTotal: false, ocultarCusteioCapital: true })
        );
        expect(getAllByText("-").length).toBe(2);
      });

      it("omite custeio quando exibirCusteio=false", () => {
        const jsx = columns[2].render(valores, {
          isTotal: false,
          ocultarCusteioCapital: false,
          exibirCusteio: false,
        });
        const { container } = render(jsx);
        expect(container.querySelectorAll("span").length).toBe(2);
      });

      it("retorna null quando todas as categorias são omitidas", () => {
        const result = columns[2].render(valores, {
          isTotal: false,
          ocultarCusteioCapital: false,
          exibirCusteio: false,
          exibirCapital: false,
          exibirLivre: false,
        });
        expect(result).toBeNull();
      });
    });

    describe("coluna Despesas", () => {
      it("usa formatResumoTotal para linha isTotal=true", () => {
        const { container } = render(
          columns[3].render({ total: 500 }, { isTotal: true })
        );
        expect(
          container.querySelector(".relatorio-plano-orcamentario__despesas--total")
        ).toBeInTheDocument();
      });

      it("retorna null quando valores são null e isTotal=true", () => {
        expect(columns[3].render(null, { isTotal: true })).toBeNull();
      });

      it("usa formatResumo com isDespesa=true para linha normal", () => {
        const { container } = render(
          columns[3].render(valores, { isTotal: false, ocultarCusteioCapital: false })
        );
        expect(
          container.querySelector(".relatorio-plano-orcamentario__despesas")
        ).toBeInTheDocument();
      });

      it("retorna null quando despesas são null para linha normal", () => {
        expect(
          columns[3].render(null, { isTotal: false, ocultarCusteioCapital: false })
        ).toBeNull();
      });

      it("exibe hífen para livre quando isDespesa=true", () => {
        const { getAllByText } = render(
          columns[3].render(valores, { isTotal: false, ocultarCusteioCapital: false })
        );
        expect(getAllByText("-").length).toBeGreaterThanOrEqual(1);
      });

      it("omite capital quando exibirCapital=false", () => {
        const jsx = columns[3].render(valores, {
          isTotal: false,
          ocultarCusteioCapital: false,
          exibirCapital: false,
        });
        const { container } = render(jsx);
        expect(container.querySelectorAll("span").length).toBe(2);
      });
    });

    describe("coluna Saldo", () => {
      it("usa formatResumoTotal para linha isTotal=true", () => {
        const { container } = render(
          columns[4].render({ total: 800 }, { isTotal: true })
        );
        expect(
          container.querySelector(".relatorio-plano-orcamentario__saldos--total")
        ).toBeInTheDocument();
      });

      it("retorna null quando valores são null e isTotal=true", () => {
        expect(columns[4].render(null, { isTotal: true })).toBeNull();
      });

      it("usa formatResumo com wrapper strong para linha normal", () => {
        const { container } = render(
          columns[4].render(valores, { isTotal: false, ocultarCusteioCapital: false })
        );
        expect(container.querySelector("strong")).toBeInTheDocument();
      });

      it("retorna null quando saldos são null para linha normal", () => {
        expect(
          columns[4].render(null, { isTotal: false, ocultarCusteioCapital: false })
        ).toBeNull();
      });

      it("omite custeio quando exibirCusteio=false (2 strong restantes)", () => {
        const { container } = render(
          columns[4].render(valores, {
            isTotal: false,
            exibirCusteio: false,
            exibirLivre: true,
          })
        );
        expect(container.querySelectorAll("strong").length).toBe(2);
      });

      it("omite capital quando exibirCapital=false (2 strong restantes)", () => {
        const { container } = render(
          columns[4].render(valores, {
            isTotal: false,
            exibirCapital: false,
            exibirLivre: true,
          })
        );
        expect(container.querySelectorAll("strong").length).toBe(2);
      });

      it("omite livre quando exibirLivre=false (2 strong restantes)", () => {
        const { container } = render(
          columns[4].render(valores, {
            isTotal: false,
            exibirLivre: false,
          })
        );
        expect(container.querySelectorAll("strong").length).toBe(2);
      });

      it("retorna null quando todas as categorias são omitidas", () => {
        const result = columns[4].render(valores, {
          isTotal: false,
          exibirCusteio: false,
          exibirCapital: false,
          exibirLivre: false,
        });
        expect(result).toBeNull();
      });

      it("exibe hífen para custeio e capital quando ocultarCusteioCapital=true", () => {
        const { getAllByText } = render(
          columns[4].render(valores, { isTotal: false, ocultarCusteioCapital: true })
        );
        expect(getAllByText("-").length).toBe(2);
      });
    });
  });
});
