import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ElaborarNovoPlano } from "../index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { useGetPaa } from "../../../componentes/hooks/useGetPaa";
import { getTextosPaaUe } from "../../../../../../services/escolas/Paa.service";
import { iniciarAtaPaa } from "../../../../../../services/escolas/AtasPaa.service";
jest.mock("../../../../../../services/visoes.service", () => ({
  visoesService: {
    featureFlagAtiva: jest.fn(),
    getItemUsuarioLogado: jest.fn(),
    getDadosDoUsuarioLogado: jest.fn(),
    getPermissoes: jest.fn(),
  },
}));
jest.mock("../../../componentes/hooks/useGetPaa", () => ({
  useGetPaa: jest.fn(),
}));

const mockUseLocation = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => mockUseLocation(),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../../../../../paginas/PaginasContainer", () => ({
  PaginasContainer: ({ children }) => (
    <div data-testid="paginas-container">{children}</div>
  ),
}));

jest.mock("../../../componentes/ReceitasPrevistas", () => ({
  __esModule: true,
  default: ({ receitasDestino }) => (
    <div
      data-testid="receitas-previstas"
      data-receitas-destino={receitasDestino}
    >
      ReceitasPrevistas
    </div>
  ),
}));
jest.mock("../../ElaborarNovoPlano/Relatorios", () => ({
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

jest.mock("../../../../../../services/escolas/AtasPaa.service", () => ({
  iniciarAtaPaa: jest.fn(),
}));

jest.mock("../../../../../../services/escolas/Paa.service", () => ({
  getTextosPaaUe: jest.fn(),
}));

jest.mock("../../../componentes/BarraTopoTitulo", () => ({
  __esModule: true,
  default: ({ origem }) => (
    <div data-testid="barra-topo" data-origem={origem || ""}>
      BarraTopo
    </div>
  ),
}));

const defaultLocation = { state: null, search: "" };

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

describe("ElaborarNovoPlano", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const associacao__uuid = "12345-assoc";
    localStorage.setItem("PAA", "123");
    localStorage.setItem("UUID", associacao__uuid);

    const PAA_RESPONSE = {
      status: "EM_ELABORACAO",
      uuid: "123",
      associacao: associacao__uuid,
      periodo_paa_objeto: { referencia: "TESTE" },
    };
    localStorage.setItem("PAA_DADOS", JSON.stringify(PAA_RESPONSE));
    useGetPaa.mockReturnValue({
      data: PAA_RESPONSE,
      isFetching: false,
      error: null,
    });

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    mockUseLocation.mockReturnValue(defaultLocation);
    iniciarAtaPaa.mockResolvedValue();
    getTextosPaaUe.mockResolvedValueOnce({});
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <ElaborarNovoPlano />
        </QueryClientProvider>
      </MemoryRouter>,
    );
  };

  describe("Renderização básica", () => {
    it("renderiza PaginasContainer, breadcrumb, título e barra de topo", async () => {
      renderComponent();

      expect(screen.getByTestId("paginas-container")).toBeInTheDocument();

      expect(
        screen.getByRole("navigation", { name: /breadcrumb/i }),
      ).toBeInTheDocument();

      expect(
        await screen.findByRole("heading", {
          name: /Plano Anual de Atividades/i,
        }),
      ).toBeInTheDocument();
    });

    it("renderiza as quatro abas", async () => {
      renderComponent();

      expect(
        screen.getByText(/Levantamento de Prioridades/i),
      ).toBeInTheDocument();

      expect(screen.getByText(/Receitas previstas/i)).toBeInTheDocument();
      await screen.findByText(/^Prioridades$/i);
      expect(screen.getByText(/Relatórios/i)).toBeInTheDocument();
    });
    it("aplica as classes corretas no título", async () => {
      renderComponent();
      const titulo = await screen.findByRole("heading", {
        name: /Plano Anual de Atividades/i,
      });
      expect(titulo).toBeInTheDocument();

      expect(titulo).toHaveClass("titulo-itens-painel");
      expect(titulo).toHaveClass("mt-5");
    });
  });

  describe("Navegação entre abas", () => {
    it('alterna para a aba "Receitas previstas" ao clicar', () => {
      renderComponent();

      fireEvent.click(screen.getByText(/Receitas previstas$/i));
      expect(screen.getByTestId("receitas-previstas")).toBeInTheDocument();
    });

    it('alterna para a aba "Prioridades" ao clicar', () => {
      renderComponent();

      fireEvent.click(screen.getByText("Prioridades"));
      expect(
        screen.getByRole("heading", { name: /Resumo de recursos/i }),
      ).toBeInTheDocument();
    });

    it('alterna para a aba "Relatórios" ao clicar', () => {
      renderComponent();

      fireEvent.click(screen.getByText("Relatórios"));

      expect(screen.getByTestId("relatorios")).toBeInTheDocument();
    });
  });

  describe("Aba inicial via location.state", () => {
    it('inicia na aba "receitas" quando location.state.activeTab é "receitas"', () => {
      mockUseLocation.mockReturnValue({
        state: { activeTab: "receitas" },
        search: "",
      });

      renderComponent();

      expect(screen.getByTestId("receitas-previstas")).toBeInTheDocument();
    });

    it('inicia na aba "prioridades-list" quando location.state.activeTab é "prioridades-list"', async () => {
      mockUseLocation.mockReturnValue({
        state: { activeTab: "prioridades-list" },
        search: "",
      });

      renderComponent();

      await screen.findByText(/^Prioridades$/i);
    });

    it('inicia na aba "relatorios" quando location.state.activeTab é "relatorios"', () => {
      mockUseLocation.mockReturnValue({
        state: { activeTab: "relatorios" },
        search: "",
      });

      renderComponent();

      expect(screen.getByTestId("relatorios")).toBeInTheDocument();
    });

    it("inicia na aba padrão quando location.state.activeTab é inválido", () => {
      mockUseLocation.mockReturnValue({
        state: { activeTab: "aba-inexistente" },
        search: "",
      });

      renderComponent();
      expect(
        screen.getByText(/Levantamento de Prioridades/i),
      ).toBeInTheDocument();
    });

    it("inicia na aba padrão quando location.state é null", () => {
      renderComponent();

      expect(
        screen.getByText(/Levantamento de Prioridades/i),
      ).toBeInTheDocument();
    });
  });

  describe("origemBarra passada ao BarraTopoTitulo", () => {
    it("passa origem vazia quando não há estado especial", () => {
      renderComponent();

      expect(screen.getByTestId("barra-topo")).toHaveAttribute(
        "data-origem",
        "",
      );
    });

    it('passa origem "plano-aplicacao" quando fromPlanoAplicacao é true', () => {
      mockUseLocation.mockReturnValue({
        state: { fromPlanoAplicacao: true },
        search: "",
      });

      renderComponent();

      expect(screen.getByTestId("barra-topo")).toHaveAttribute(
        "data-origem",
        "plano-aplicacao",
      );
    });

    it('passa origem "plano-orcamentario" quando fromPlanoOrcamentario é true', () => {
      mockUseLocation.mockReturnValue({
        state: { fromPlanoOrcamentario: true },
        search: "",
      });

      renderComponent();

      expect(screen.getByTestId("barra-topo")).toHaveAttribute(
        "data-origem",
        "plano-orcamentario",
      );
    });

    it('passa origem "atividades-previstas" quando fromAtividadesPrevistas é "1" na query', () => {
      mockUseLocation.mockReturnValue({
        state: null,
        search: "?fromAtividadesPrevistas=1",
      });

      renderComponent();

      expect(screen.getByTestId("barra-topo")).toHaveAttribute(
        "data-origem",
        "atividades-previstas",
      );
    });

    it('passa origem "atividades-previstas" quando fromAtividadesPrevistas é "true" na query', () => {
      mockUseLocation.mockReturnValue({
        state: null,
        search: "?fromAtividadesPrevistas=true",
      });

      renderComponent();

      expect(screen.getByTestId("barra-topo")).toHaveAttribute(
        "data-origem",
        "atividades-previstas",
      );
    });

    it('"atividades-previstas" tem prioridade sobre "plano-aplicacao"', () => {
      mockUseLocation.mockReturnValue({
        state: { fromPlanoAplicacao: true },
        search: "?fromAtividadesPrevistas=1",
      });

      renderComponent();

      expect(screen.getByTestId("barra-topo")).toHaveAttribute(
        "data-origem",
        "atividades-previstas",
      );
    });
  });

  describe("receitasDestino passado ao ReceitasPrevistas", () => {
    it("passa receitasDestino quando presente no location.state", () => {
      mockUseLocation.mockReturnValue({
        state: { activeTab: "receitas", receitasDestino: "algum-destino" },
        search: "",
      });

      renderComponent();

      expect(screen.getByTestId("receitas-previstas")).toHaveAttribute(
        "data-receitas-destino",
        "algum-destino",
      );
    });

    it("não possui receitasDestino quando ausente no location.state", () => {
      mockUseLocation.mockReturnValue({
        state: { activeTab: "receitas" },
        search: "",
      });

      renderComponent();

      expect(screen.getByTestId("receitas-previstas")).not.toHaveAttribute(
        "data-receitas-destino",
      );
    });
  });

  describe("initialExpandedSections passado ao Relatorios", () => {
    it("passa expandedSections quando presente no location.state", () => {
      const expandedSections = ["secao-1", "secao-2"];
      mockUseLocation.mockReturnValue({
        state: { activeTab: "relatorios", expandedSections },
        search: "",
      });

      renderComponent();

      expect(screen.getByTestId("relatorios")).toHaveAttribute(
        "data-expanded",
        JSON.stringify(expandedSections),
      );
    });
  });

  describe("iniciarAtaPaa", () => {
    it("chama iniciarAtaPaa com o UUID do localStorage ao montar quando PAA está presente", async () => {
      renderComponent();

      await waitFor(() => {
        expect(iniciarAtaPaa).toHaveBeenCalledWith("123");
      });
    });

    it("não chama iniciarAtaPaa quando PAA não está no localStorage", async () => {
      localStorage.removeItem("PAA");
      renderComponent();

      await waitFor(() => {
        expect(iniciarAtaPaa).not.toHaveBeenCalled();
      });
    });

    it("captura e loga o erro quando iniciarAtaPaa falha", async () => {
      localStorage.setItem("PAA", "123");
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      iniciarAtaPaa.mockRejectedValueOnce(new Error("Erro de ata"));

      renderComponent();

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "Erro ao iniciar ata do PAA:",
          expect.any(Error),
        );
      });

      consoleSpy.mockRestore();
    });
  });
});
