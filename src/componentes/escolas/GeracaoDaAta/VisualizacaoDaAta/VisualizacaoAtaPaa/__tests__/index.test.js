import React from "react";
import { render, screen } from "@testing-library/react";
import { VisualizacaoAtaPaa } from "../index";
import { useVisualizacaoAtaPaa } from "../hooks/useVisualizacaoAtaPaa";
import { useGetPaaRetificacao } from "../hooks/useGetPaaRetificacao";

jest.mock("../hooks/useVisualizacaoAtaPaa", () => ({
  useVisualizacaoAtaPaa: jest.fn(),
}));

jest.mock("../hooks/useGetPaaRetificacao", () => ({
  useGetPaaRetificacao: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useParams: () => ({ uuid_paa: "mocked-uuid-123" }),
}));

jest.mock("../TopoComBotoes", () => ({
  TopoComBotoes: () => <div data-testid="mock-topo-com-botoes" />,
}));

jest.mock("../../../../../Globais/WatermarkPrevia/WatermarkPrevia", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-watermark" />,
}));

jest.mock("../AtaElaboracao", () => ({
  AtaElaboracao: () => <div data-testid="mock-ata-elaboracao" />,
}));

jest.mock("../AtaRetificacao", () => ({
  AtaRetificacao: () => <div data-testid="mock-ata-retificacao" />,
}));

jest.mock("../BlocoPrioridades/BlocoPrioridadesElaboracao", () => ({
  BlocoPrioridadesElaboracao: () => <div data-testid="mock-prioridades-elaboracao" />,
}));

jest.mock("../BlocoPrioridades/BlocoPrioridadesRetificacao", () => ({
  BlocoPrioridadesRetificacao: () => <div data-testid="mock-prioridades-retificacao" />,
}));

jest.mock("../AtividadesEstatutarias", () => ({
  AtividadesEstatutarias: () => <div data-testid="mock-atividades-estatutarias" />,
}));

jest.mock("../Manifestacoes", () => ({
  Manifestacoes: () => <div data-testid="mock-manifestacoes" />,
}));

jest.mock("../ListaPresentes", () => ({
  ListaPresentes: () => <div data-testid="mock-lista-presentes" />,
}));

const createMockVisualizacaoHook = (overrides = {}) => ({
  dadosAta: { uuid: "ata-123", justificativa: "Justificativa aceita" },
  tabelas: {},
  listaPresentes: [],
  alturaDocumento: 0,
  referenciaDocumento: { current: null },
  prioridadesAgrupadas: { alta: [] },
  isLoadingPrioridades: false,
  atividades: [],
  isLoadingAtividades: false,
  handleClickFecharAta: jest.fn(),
  handleClickEditarAta: jest.fn(),
  getNomeUnidadeEducacional: jest.fn(),
  getDiaPorExtenso: jest.fn(),
  getMesPorExtenso: jest.fn(),
  getAnoPorExtenso: jest.fn(),
  getDataFormatada: jest.fn(),
  getLocalReuniao: jest.fn(),
  getNomeUnidade: jest.fn(),
  getHoraInicio: jest.fn(),
  getTipoReuniao: jest.fn(),
  getTipoUnidadeComNome: jest.fn(),
  getPeriodoPaaFormatado: jest.fn().mockReturnValue("2026"),
  formatarMesAno: jest.fn(),
  formatarData: jest.fn(),
  getNomeSecretarioReuniao: jest.fn().mockReturnValue("Secretário Teste"),
  getNomePresidente: jest.fn(),
  ...overrides,
});

const createMockRetificacaoHook = (overrides = {}) => ({
  data: null,
  isLoading: false,
  ...overrides,
});

describe("VisualizacaoAtaPaa - Container", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (visualizacaoOverrides = {}, retificacaoOverrides = {}) => {
    useVisualizacaoAtaPaa.mockReturnValue(createMockVisualizacaoHook(visualizacaoOverrides));
    useGetPaaRetificacao.mockReturnValue(createMockRetificacaoHook(retificacaoOverrides));
    return render(<VisualizacaoAtaPaa />);
  };

  describe("Renderização Comum e Globais", () => {
    it("deve renderizar a Watermark se a altura do documento for maior que zero", () => {
      renderComponent({ alturaDocumento: 150 });
      expect(screen.getByTestId("mock-watermark")).toBeInTheDocument();
    });

    it("não deve renderizar a Watermark se a altura do documento for zero", () => {
      renderComponent({ alturaDocumento: 0 });
      expect(screen.queryByTestId("mock-watermark")).not.toBeInTheDocument();
    });

    it("deve renderizar o TopoComBotoes quando existirem dados e não estiver carregando", () => {
      renderComponent(
        { dadosAta: { uuid: "123" } },
        { isLoading: false }
      );
      expect(screen.getByTestId("mock-topo-com-botoes")).toBeInTheDocument();
    });

    it("deve passar a lista de presentes filtrada corretamente para o subcomponente", () => {
      const listaPresentesMix = [
        { uuid: "1", membro: true, presente: true },
        { uuid: "2", membro: false, presente: true },
        { uuid: "3", membro: true, presente: false },
      ];

      renderComponent({ listaPresentes: listaPresentesMix });
      expect(screen.getByTestId("mock-lista-presentes")).toBeInTheDocument();
    });
  });

  describe("Fluxo de Elaboração (Quando NÃO há dados de Retificação)", () => {
    beforeEach(() => {
      useVisualizacaoAtaPaa.mockReturnValue(createMockVisualizacaoHook());
      useGetPaaRetificacao.mockReturnValue(createMockRetificacaoHook({ data: null, isLoading: false }));
    });

    it("deve renderizar a AtaElaboracao e as prioridades de elaboração", () => {
      render(<VisualizacaoAtaPaa />);

      expect(screen.getByTestId("mock-ata-elaboracao")).toBeInTheDocument();
      expect(screen.queryByTestId("mock-ata-retificacao")).not.toBeInTheDocument();
      expect(screen.getByTestId("mock-prioridades-elaboracao")).toBeInTheDocument();
    });

    it("deve exibir o texto de encerramento específico para Elaboração com o secretário em negrito", () => {
      useVisualizacaoAtaPaa.mockReturnValue(createMockVisualizacaoHook({
        getNomeSecretarioReuniao: () => "João da Silva"
      }));
      render(<VisualizacaoAtaPaa />);

      const textoEncerramento = screen.getByText(/Esgotados os assuntos, o \(a\) senhor \(a\) presidente ofereceu a palavra/i);
      expect(textoEncerramento).toBeInTheDocument();
      
      const secretarioStrong = screen.getByText("João da Silva");
      expect(secretarioStrong.tagName).toBe("STRONG");
    });

    it("não deve renderizar o bloco de Justificativa de Retificação", () => {
      render(<VisualizacaoAtaPaa />);
      expect(screen.queryByRole("heading", { name: /Justificativa da Retificação/i })).not.toBeInTheDocument();
    });
  });

  describe("Fluxo de Retificação (Quando HÁ dados de Retificação)", () => {
    const mockPaaRetificacao = {
      get_ata_elaboracao: { data_reuniao: "2026-05-10" }
    };

    beforeEach(() => {
      useVisualizacaoAtaPaa.mockReturnValue(createMockVisualizacaoHook({
        dadosAta: { uuid: "123", justificativa: "Texto da justificativa aqui" }
      }));
      useGetPaaRetificacao.mockReturnValue(createMockRetificacaoHook({ data: mockPaaRetificacao, isLoading: false }));
    });

    it("deve renderizar a AtaRetificacao e as prioridades de retificação", () => {
      render(<VisualizacaoAtaPaa />);

      expect(screen.getByTestId("mock-ata-retificacao")).toBeInTheDocument();
      expect(screen.queryByTestId("mock-ata-elaboracao")).not.toBeInTheDocument();
      expect(screen.getByTestId("mock-prioridades-retificacao")).toBeInTheDocument();
    });

    it("deve exibir a seção de justificativa da retificação preenchida", () => {
      render(<VisualizacaoAtaPaa />);

      expect(screen.getByRole("heading", { name: /Justificativa da Retificação/i })).toBeInTheDocument();
      expect(screen.getByText("Texto da justificativa aqui")).toBeInTheDocument();
    });

    it("deve exibir o texto de encerramento específico para Retificação", () => {
      render(<VisualizacaoAtaPaa />);

      const textoEncerramento = screen.getByText(/A seguir foi dada a palavra e, não havendo manifestação dos presentes/i);
      expect(textoEncerramento).toBeInTheDocument();
    });
  });
});