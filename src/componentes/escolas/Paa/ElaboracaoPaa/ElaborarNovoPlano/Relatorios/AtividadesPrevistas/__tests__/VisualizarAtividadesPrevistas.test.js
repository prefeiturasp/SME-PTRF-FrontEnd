import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { VisualizarAtividadesPrevistas } from "../VisualizarAtividadesPrevistas";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockUseGetPaa = jest.fn();
jest.mock("../../../../../componentes/hooks/useGetPaa", () => ({
  useGetPaa: (...args) => mockUseGetPaa(...args),
}));

const mockUsePaaContext = jest.fn();
jest.mock("../../../../../componentes/PaaContext", () => ({
  PaaContext: {
    Provider: ({ children }) => <>{children}</>,
  },
  usePaaContext: (...args) => mockUsePaaContext(...args),
}));

jest.mock("../AtividadesPrevistas", () => ({
  AtividadesPrevistas: () => <div data-testid="atividades-previstas-mock" />,
}));

jest.mock("../RecursosProprios", () => ({
  RecursosProprios: ({ paa }) => (
    <div
      data-testid="recursos-proprios-mock"
      data-paa-status={paa?.status || ""}
    />
  ),
}));

jest.mock("antd", () => ({
  Spin: ({ spinning, children }) => (
    <div data-testid="spin-wrapper" data-spinning={String(spinning)}>
      {children}
    </div>
  ),
}));

jest.mock("../../components/RelatorioVisualizacao", () => ({
  RelatorioVisualizacao: ({ title, onBack, children }) => (
    <div data-testid="relatorio-visualizacao">
      <h3>{title}</h3>
      {onBack && (
        <button data-testid="btn-voltar" onClick={onBack}>
          Voltar
        </button>
      )}
      <div>{children}</div>
    </div>
  ),
}));

const PAA_UUID = "uuid-paa-test";
const MOCK_PAA = { uuid: PAA_UUID, status: "ABERTO" };

const setupDefaultMocks = ({ paa = MOCK_PAA, isFetching = false } = {}) => {
  mockUseGetPaa.mockReturnValue({ data: paa, refetch: jest.fn(), isFetching });
  mockUsePaaContext.mockReturnValue({ paa, isFetching });
};

const renderComponent = () => render(<VisualizarAtividadesPrevistas />);

describe("VisualizarAtividadesPrevistas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("PAA", PAA_UUID);
    setupDefaultMocks();
  });

  afterEach(() => {
    localStorage.removeItem("PAA");
  });

  describe("quando paa é nulo", () => {
    it("não renderiza conteúdo", () => {
      mockUseGetPaa.mockReturnValue({
        data: null,
        refetch: jest.fn(),
        isFetching: false,
      });
      renderComponent();
      expect(
        screen.queryByTestId("relatorio-visualizacao"),
      ).not.toBeInTheDocument();
    });
  });

  describe("renderização básica", () => {
    it("renderiza o título 'Atividades previstas'", () => {
      renderComponent();
      expect(screen.getByText("Atividades previstas")).toBeInTheDocument();
    });

    it("renderiza o botão Voltar", () => {
      renderComponent();
      expect(screen.getByTestId("btn-voltar")).toBeInTheDocument();
    });

    it("renderiza o componente AtividadesPrevistas", () => {
      renderComponent();
      expect(
        screen.getByTestId("atividades-previstas-mock"),
      ).toBeInTheDocument();
    });

    it("renderiza o componente RecursosProprios com a prop paa", () => {
      renderComponent();
      const el = screen.getByTestId("recursos-proprios-mock");
      expect(el).toBeInTheDocument();
      expect(el).toHaveAttribute("data-paa-status", "ABERTO");
    });
  });

  describe("handleVoltar", () => {
    it("navega para /elaborar-novo-paa quando status não é EM_RETIFICACAO", async () => {
      renderComponent();
      await act(async () => {
        fireEvent.click(screen.getByTestId("btn-voltar"));
      });
      expect(mockNavigate).toHaveBeenCalledWith("/elaborar-novo-paa", {
        state: {
          activeTab: "relatorios",
          expandedSections: { planoAnual: true, componentes: true },
        },
      });
    });

    it("navega para /retificacao-paa/:uuid quando status é EM_RETIFICACAO", async () => {
      const paaRetificacao = { uuid: PAA_UUID, status: "EM_RETIFICACAO" };
      setupDefaultMocks({ paa: paaRetificacao });
      renderComponent();
      await act(async () => {
        fireEvent.click(screen.getByTestId("btn-voltar"));
      });
      expect(mockNavigate).toHaveBeenCalledWith(
        `/retificacao-paa/${PAA_UUID}`,
        {
          state: {
            activeTab: "relatorios",
            expandedSections: { planoAnual: true, componentes: true },
          },
        },
      );
    });
  });

  describe("Spin de carregamento do PAA", () => {
    it("Spin não está girando quando isFetching=false", () => {
      setupDefaultMocks({ isFetching: false });
      renderComponent();
      expect(screen.getByTestId("spin-wrapper")).toHaveAttribute(
        "data-spinning",
        "false",
      );
    });

    it("Spin está girando quando isFetching=true", () => {
      setupDefaultMocks({ isFetching: true });
      renderComponent();
      expect(screen.getByTestId("spin-wrapper")).toHaveAttribute(
        "data-spinning",
        "true",
      );
    });
  });

  describe("prop paa repassada para RecursosProprios", () => {
    it("repassa paa com status EM_RETIFICACAO para RecursosProprios", () => {
      const paaRetificacao = { uuid: PAA_UUID, status: "EM_RETIFICACAO" };
      setupDefaultMocks({ paa: paaRetificacao });
      renderComponent();
      expect(screen.getByTestId("recursos-proprios-mock")).toHaveAttribute(
        "data-paa-status",
        "EM_RETIFICACAO",
      );
    });
  });
});
