import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ConteudoBase from "../ConteudoBase";
import { iniciarAtaPaa } from "../../../../../../services/escolas/AtasPaa.service";
import { visoesService } from "../../../../../../services/visoes.service";
import { PaaContext } from "../../PaaContext";

jest.mock("../../../../../../services/escolas/AtasPaa.service", () => ({
  iniciarAtaPaa: jest.fn(),
}));

jest.mock("../../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
const mockUseLocation = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => mockUseLocation(),
}));

jest.mock("../../../../../Globais/Breadcrumb", () => ({
  __esModule: true,
  default: ({ items }) => (
    <nav aria-label="breadcrumb" data-testid="breadcrumb">
      {items?.map((item, i) => <span key={i}>{item.label}</span>)}
    </nav>
  ),
}));

jest.mock("../../../../../Globais/TabSelector", () => ({
  __esModule: true,
  default: ({ tabs, activeTab, setActiveTab }) => (
    <div data-testid="tab-selector">
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => setActiveTab(tab.id)}>
          {tab.label}
        </button>
      ))}
    </div>
  ),
}));

jest.mock("../../../ElaboracaoPaa/ElaborarNovoPlano/LevantamentoDePrioridades", () => ({
  __esModule: true,
  default: () => <div data-testid="levantamento-prioridades">LevantamentoDePrioridades</div>,
}));

jest.mock("../../ReceitasPrevistas", () => ({
  __esModule: true,
  default: ({ receitasDestino }) => (
    <div data-testid="receitas-previstas" data-receitas-destino={receitasDestino}>
      ReceitasPrevistas
    </div>
  ),
}));

jest.mock("../../../ElaboracaoPaa/ElaborarNovoPlano/Prioridades", () => ({
  __esModule: true,
  default: () => <div data-testid="prioridades">Prioridades</div>,
}));

jest.mock("../../../ElaboracaoPaa/ElaborarNovoPlano/Relatorios", () => ({
  __esModule: true,
  default: ({ initialExpandedSections }) => (
    <div
      data-testid="relatorios"
      data-expanded={JSON.stringify(initialExpandedSections)}
    >
      Relatórios
    </div>
  ),
}));

jest.mock("../../BarraTopoTitulo", () => ({
  __esModule: true,
  default: ({ origem, paa }) => (
    <div data-testid="barra-topo" data-origem={origem || ""} data-paa-status={paa?.status || ""}>
      BarraTopo
    </div>
  ),
}));

const defaultLocation = { state: null, search: "" };

const defaultPaa = {
  uuid: "paa-uuid-123",
  status: "EM_ELABORACAO",
  associacao: "assoc-uuid-123",
};

const renderConteudoBase = (paaOverride = {}, locationOverride = {}, itemsBreadCrumb = []) => {
  const paa = { ...defaultPaa, ...paaOverride };
  mockUseLocation.mockReturnValue({ ...defaultLocation, ...locationOverride });

  return render(
    <MemoryRouter>
      <PaaContext.Provider value={{ paa, refetch: jest.fn() }}>
        <ConteudoBase itemsBreadCrumb={itemsBreadCrumb} />
      </PaaContext.Provider>
    </MemoryRouter>,
  );
};

describe("ConteudoBase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("PAA", "paa-uuid-123");
    mockUseLocation.mockReturnValue(defaultLocation);
    visoesService.getPermissoes.mockReturnValue(true);
    iniciarAtaPaa.mockResolvedValue();
  });

  describe("Renderização básica", () => {
    it("renderiza o título principal", () => {
      renderConteudoBase();

      expect(
        screen.getByRole("heading", { name: /Plano Anual de Atividades/i }),
      ).toBeInTheDocument();
    });

    it("renderiza o Breadcrumb com os itens passados", () => {
      renderConteudoBase({}, {}, [{ label: "Início" }, { label: "PAA" }]);

      expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
      expect(screen.getByText("Início")).toBeInTheDocument();
      expect(screen.getByText("PAA")).toBeInTheDocument();
    });

    it("renderiza o TabSelector", () => {
      renderConteudoBase();

      expect(screen.getByTestId("tab-selector")).toBeInTheDocument();
    });

    it("renderiza o BarraTopoTitulo", () => {
      renderConteudoBase();

      expect(screen.getByTestId("barra-topo")).toBeInTheDocument();
    });

    it("renderiza as abas: Levantamento de Prioridades, Receitas previstas, Prioridades, Relatórios quando status não é EM_RETIFICACAO", () => {
      renderConteudoBase();

      expect(screen.getByText("Levantamento de Prioridades")).toBeInTheDocument();
      expect(screen.getByText("Receitas previstas")).toBeInTheDocument();
      expect(screen.getByText("Prioridades")).toBeInTheDocument();
      expect(screen.getByText("Relatórios")).toBeInTheDocument();
    });

    it("não renderiza a aba Levantamento de Prioridades quando status é EM_RETIFICACAO", () => {
      renderConteudoBase({ status: "EM_RETIFICACAO" });

      expect(screen.queryByText("Levantamento de Prioridades")).not.toBeInTheDocument();
      expect(screen.getByText("Receitas previstas")).toBeInTheDocument();
      expect(screen.getByText("Prioridades")).toBeInTheDocument();
      expect(screen.getByText("Relatórios")).toBeInTheDocument();
    });
  });

  describe("Aba ativa inicial", () => {
    it("inicia na aba 'prioridades' (Levantamento de Prioridades) por padrão", () => {
      renderConteudoBase();

      expect(screen.getByTestId("levantamento-prioridades")).toBeInTheDocument();
    });

    it("inicia na aba 'receitas' quando location.state.activeTab é 'receitas'", () => {
      renderConteudoBase({}, { state: { activeTab: "receitas" } });

      expect(screen.getByTestId("receitas-previstas")).toBeInTheDocument();
    });

    it("inicia na aba 'prioridades-list' quando location.state.activeTab é 'prioridades-list'", () => {
      renderConteudoBase({}, { state: { activeTab: "prioridades-list" } });

      expect(screen.getByTestId("prioridades")).toBeInTheDocument();
    });

    it("inicia na aba 'relatorios' quando location.state.activeTab é 'relatorios'", () => {
      renderConteudoBase({}, { state: { activeTab: "relatorios" } });

      expect(screen.getByTestId("relatorios")).toBeInTheDocument();
    });

    it("inicia na primeira aba quando location.state.activeTab é inválido", () => {
      renderConteudoBase({}, { state: { activeTab: "aba-invalida" } });

      expect(screen.getByTestId("levantamento-prioridades")).toBeInTheDocument();
    });

    it("inicia na aba 'receitas' quando status é EM_RETIFICACAO (primeira aba disponível)", () => {
      renderConteudoBase({ status: "EM_RETIFICACAO" });

      expect(screen.getByTestId("receitas-previstas")).toBeInTheDocument();
    });
  });

  describe("Navegação entre abas", () => {
    it("exibe o componente ReceitasPrevistas ao clicar em 'Receitas previstas'", () => {
      renderConteudoBase();

      fireEvent.click(screen.getByText("Receitas previstas"));

      expect(screen.getByTestId("receitas-previstas")).toBeInTheDocument();
    });

    it("exibe o componente Prioridades ao clicar em 'Prioridades'", () => {
      renderConteudoBase();

      fireEvent.click(screen.getByText("Prioridades"));

      expect(screen.getByTestId("prioridades")).toBeInTheDocument();
    });

    it("exibe o componente Relatorios ao clicar em 'Relatórios'", () => {
      renderConteudoBase();

      fireEvent.click(screen.getByText("Relatórios"));

      expect(screen.getByTestId("relatorios")).toBeInTheDocument();
    });

    it("exibe LevantamentoDePrioridades ao clicar em 'Levantamento de Prioridades'", () => {
      renderConteudoBase();

      fireEvent.click(screen.getByText("Receitas previstas"));
      fireEvent.click(screen.getByText("Levantamento de Prioridades"));

      expect(screen.getByTestId("levantamento-prioridades")).toBeInTheDocument();
    });
  });

  describe("origemBarra passada ao BarraTopoTitulo", () => {
    it("passa origem vazia quando não há estado especial", () => {
      renderConteudoBase();

      expect(screen.getByTestId("barra-topo")).toHaveAttribute("data-origem", "");
    });

    it("passa origem 'plano-aplicacao' quando fromPlanoAplicacao é true", () => {
      renderConteudoBase({}, { state: { fromPlanoAplicacao: true } });

      expect(screen.getByTestId("barra-topo")).toHaveAttribute("data-origem", "plano-aplicacao");
    });

    it("passa origem 'plano-orcamentario' quando fromPlanoOrcamentario é true", () => {
      renderConteudoBase({}, { state: { fromPlanoOrcamentario: true } });

      expect(screen.getByTestId("barra-topo")).toHaveAttribute("data-origem", "plano-orcamentario");
    });

    it("passa origem 'atividades-previstas' quando fromAtividadesPrevistas=1 na query", () => {
      renderConteudoBase({}, { search: "?fromAtividadesPrevistas=1" });

      expect(screen.getByTestId("barra-topo")).toHaveAttribute("data-origem", "atividades-previstas");
    });

    it("passa origem 'atividades-previstas' quando fromAtividadesPrevistas=true na query", () => {
      renderConteudoBase({}, { search: "?fromAtividadesPrevistas=true" });

      expect(screen.getByTestId("barra-topo")).toHaveAttribute("data-origem", "atividades-previstas");
    });

    it("'atividades-previstas' tem prioridade sobre 'plano-aplicacao'", () => {
      renderConteudoBase({}, { state: { fromPlanoAplicacao: true }, search: "?fromAtividadesPrevistas=1" });

      expect(screen.getByTestId("barra-topo")).toHaveAttribute("data-origem", "atividades-previstas");
    });

    it("'atividades-previstas' tem prioridade sobre 'plano-orcamentario'", () => {
      renderConteudoBase({}, { state: { fromPlanoOrcamentario: true }, search: "?fromAtividadesPrevistas=1" });

      expect(screen.getByTestId("barra-topo")).toHaveAttribute("data-origem", "atividades-previstas");
    });
  });

  describe("receitasDestino passado ao ReceitasPrevistas", () => {
    it("passa receitasDestino quando presente no location.state", () => {
      renderConteudoBase(
        {},
        { state: { activeTab: "receitas", receitasDestino: "algum-destino" } },
      );

      expect(screen.getByTestId("receitas-previstas")).toHaveAttribute(
        "data-receitas-destino",
        "algum-destino",
      );
    });

    it("não possui receitasDestino quando ausente no location.state", () => {
      renderConteudoBase({}, { state: { activeTab: "receitas" } });

      expect(screen.getByTestId("receitas-previstas")).not.toHaveAttribute(
        "data-receitas-destino",
      );
    });
  });

  describe("initialExpandedSections passado ao Relatorios", () => {
    it("passa expandedSections quando presente no location.state", () => {
      const expandedSections = ["secao-1", "secao-2"];
      renderConteudoBase(
        {},
        { state: { activeTab: "relatorios", expandedSections } },
      );

      expect(screen.getByTestId("relatorios")).toHaveAttribute(
        "data-expanded",
        JSON.stringify(expandedSections),
      );
    });

  });

  describe("iniciarAtaPaa", () => {
    it("chama iniciarAtaPaa com o uuid do paa ao montar", async () => {
      renderConteudoBase();

      await waitFor(() => {
        expect(iniciarAtaPaa).toHaveBeenCalledWith("paa-uuid-123");
      });
    });

    it("não chama iniciarAtaPaa quando paa não possui uuid", async () => {
      renderConteudoBase({ uuid: undefined });

      await waitFor(() => {
        expect(iniciarAtaPaa).not.toHaveBeenCalled();
      });
    });

    it("loga o erro no console quando iniciarAtaPaa falha", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      iniciarAtaPaa.mockRejectedValueOnce(new Error("Erro de ata"));

      renderConteudoBase();

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "Erro ao iniciar ata do PAA:",
          expect.any(Error),
        );
      });

      consoleSpy.mockRestore();
    });
  });

  describe("Redirecionamento por permissão", () => {
    it("redireciona para /paa quando sem permissão e sem PAA no localStorage", () => {
      visoesService.getPermissoes.mockReturnValue(null);
      localStorage.removeItem("PAA");

      renderConteudoBase();

      expect(mockNavigate).toHaveBeenCalledWith("/paa", { replace: true });
    });

    it("não redireciona quando tem PAA no localStorage mesmo sem permissão", async () => {
      visoesService.getPermissoes.mockReturnValue(null);
      localStorage.setItem("PAA", "paa-uuid-123");

      renderConteudoBase();

      await waitFor(() => expect(iniciarAtaPaa).toHaveBeenCalled());

      expect(mockNavigate).not.toHaveBeenCalledWith("/paa", { replace: true });
    });
  });

  describe("Redirecionamento EM_RETIFICACAO", () => {
    it("redireciona para /retificacao-paa/:uuid quando status é EM_RETIFICACAO", () => {
      renderConteudoBase({ status: "EM_RETIFICACAO", uuid: "paa-uuid-123" });

      expect(mockNavigate).toHaveBeenCalledWith("/retificacao-paa/paa-uuid-123");
    });

    it("não redireciona para /retificacao-paa quando status não é EM_RETIFICACAO", () => {
      renderConteudoBase({ status: "EM_ELABORACAO" });

      expect(mockNavigate).not.toHaveBeenCalledWith(
        expect.stringContaining("/retificacao-paa"),
      );
    });
  });

  describe("Botão Cancelar Retificação", () => {
    it("renderiza o botão Cancelar Retificação quando status é EM_RETIFICACAO", () => {
      renderConteudoBase({ status: "EM_RETIFICACAO" });

      expect(
        screen.getByRole("button", { name: /Cancelar Retificação/i }),
      ).toBeInTheDocument();
    });

    it("não renderiza o botão Cancelar Retificação quando status não é EM_RETIFICACAO", () => {
      renderConteudoBase({ status: "EM_ELABORACAO" });

      expect(
        screen.queryByRole("button", { name: /Cancelar Retificação/i }),
      ).not.toBeInTheDocument();
    });

    it("ao clicar em Cancelar Retificação chama alert e navega para /paa-vigente-e-anteriores", () => {
      const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

      renderConteudoBase({ status: "EM_RETIFICACAO" });

      fireEvent.click(screen.getByRole("button", { name: /Cancelar Retificação/i }));

      expect(alertSpy).toHaveBeenCalledWith("Em desenvolvimento");
      expect(mockNavigate).toHaveBeenCalledWith("/paa-vigente-e-anteriores");

      alertSpy.mockRestore();
    });
  });
});
