import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { RelatorioConsolidadoApuracao } from "../index";
import {
  getItensDashboard,
  getExecucaoFinanceira,
  getDevolucoesContaPtrf,
  getJustificativa,
  postJustificativa,
  patchJustificativa,
  getDevolucoesAoTesouro,
  putCriarEditarDeletarObservacaoDevolucaoContaPtrf,
  putCriarEditarDeletarObservacaoDevolucaoTesouro,
  getConsolidadoDre,
} from "../../../../../services/dres/RelatorioConsolidado.service";
import { visoesService } from "../../../../../services/visoes.service";
import { auxGetNomes } from "../../auxGetNomes";

const mockUseParams = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => mockUseParams(),
}));

jest.mock("../../../../../services/dres/RelatorioConsolidado.service", () => ({
  getItensDashboard: jest.fn(),
  getExecucaoFinanceira: jest.fn(),
  getDevolucoesContaPtrf: jest.fn(),
  getJustificativa: jest.fn(),
  postJustificativa: jest.fn(),
  patchJustificativa: jest.fn(),
  getDevolucoesAoTesouro: jest.fn(),
  putCriarEditarDeletarObservacaoDevolucaoContaPtrf: jest.fn(),
  putCriarEditarDeletarObservacaoDevolucaoTesouro: jest.fn(),
  getConsolidadoDre: jest.fn(),
}));

jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getItemUsuarioLogado: jest.fn(),
  },
}));

jest.mock("../../auxGetNomes", () => ({
  auxGetNomes: {
    nomePeriodo: jest.fn(),
    nomeConta: jest.fn(),
  },
}));

jest.mock("../../../../../utils/Loading", () => () => <div>Carregando...</div>);

// Os subcomponentes têm testes próprios; aqui só capturamos as props recebidas.
// As funções do mock só leem mockProps no render, depois que ele já foi inicializado.
const mockProps = {};

const mockCapturaProps = (nome, props) => {
  mockProps[nome] = props;
  return <div data-testid={nome} />;
};

jest.mock("../TopoComBotoes", () => ({
  TopoComBotoes: (props) => mockCapturaProps("TopoComBotoes", props),
}));
jest.mock("../InfoAssociacoesEmAnalise", () => ({
  InfoAssociacoesEmAnalise: (props) => mockCapturaProps("InfoAssociacoesEmAnalise", props),
}));
jest.mock("../BoxConsultarDados", () => ({
  BoxConsultarDados: (props) => mockCapturaProps("BoxConsultarDados", props),
}));
jest.mock("../TabelaExecucaoFinanceira", () => ({
  TabelaExecucaoFinanceira: (props) => mockCapturaProps("TabelaExecucaoFinanceira", props),
}));
jest.mock("../JustificativaDiferenca", () => ({
  JustificativaDiferenca: (props) => mockCapturaProps("JustificativaDiferenca", props),
}));
jest.mock("../TabelaDevolucoesContaPtrf", () => ({
  TabelaDevolucoesContaPtrf: (props) => mockCapturaProps("TabelaDevolucoesContaPtrf", props),
}));
jest.mock("../TabelaDevolucoesAoTesouro", () => ({
  TabelaDevolucoesAoTesouro: (props) => mockCapturaProps("TabelaDevolucoesAoTesouro", props),
}));
jest.mock("../TabelaExecucaoFisica", () => ({
  TabelaExecucaoFisica: (props) => mockCapturaProps("TabelaExecucaoFisica", props),
}));
jest.mock("../../ModalObservacoesRelatorioConsolidadoApuracao", () => ({
  ModalObservacoesRelatorioConsolidadoApuracao: (props) =>
    mockCapturaProps("ModalObservacoesRelatorioConsolidadoApuracao", props),
}));
jest.mock("../../ModalSalvarJustificativa", () => ({
  ModalSalvarJustificativa: (props) => mockCapturaProps("ModalSalvarJustificativa", props),
}));

describe("RelatorioConsolidadoApuracao - complementar", () => {
  const itens = {
    total_associacoes_dre: 10,
    cards: [{ status: "EM_ANALISE", quantidade_prestacoes: 1 }],
  };

  const params = {
    periodo_uuid: "periodo-1",
    conta_uuid: "conta-1",
    ja_publicado: "false",
    consolidado_dre_uuid: "consolidado-1",
  };

  const aguardaCarga = () =>
    waitFor(() => {
      expect(mockProps.ModalObservacoesRelatorioConsolidadoApuracao).toBeDefined();
      expect(mockProps.TabelaExecucaoFisica.itensDashboard).toEqual(itens);
    });

  beforeEach(() => {
    Object.keys(mockProps).forEach((chave) => delete mockProps[chave]);
    jest.spyOn(console, "log").mockImplementation(() => {});
    mockUseParams.mockReturnValue(params);
    visoesService.getItemUsuarioLogado.mockReturnValue("dre-1");
    getItensDashboard.mockResolvedValue(itens);
    getExecucaoFinanceira.mockResolvedValue({});
    getDevolucoesContaPtrf.mockResolvedValue([]);
    getDevolucoesAoTesouro.mockResolvedValue([]);
    getJustificativa.mockResolvedValue([]);
    getConsolidadoDre.mockResolvedValue([]);
    patchJustificativa.mockResolvedValue({});
    putCriarEditarDeletarObservacaoDevolucaoContaPtrf.mockResolvedValue({});
    putCriarEditarDeletarObservacaoDevolucaoTesouro.mockResolvedValue({});
    auxGetNomes.nomePeriodo.mockResolvedValue("Periodo");
    auxGetNomes.nomeConta.mockResolvedValue("Conta");
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  it("carrega o consolidado DRE quando a consulta retorna itens", async () => {
    getConsolidadoDre.mockResolvedValue([{ uuid: "c1", versao: "FINAL" }]);
    render(<RelatorioConsolidadoApuracao />);
    await aguardaCarga();
    await waitFor(() => expect(getConsolidadoDre).toHaveBeenCalledWith("dre-1", "periodo-1"));
    expect(screen.getByTestId("TopoComBotoes")).toBeInTheDocument();
  });

  it("não busca dashboard nem nome do período sem periodo_uuid", async () => {
    mockUseParams.mockReturnValue({ ...params, periodo_uuid: undefined });
    render(<RelatorioConsolidadoApuracao />);
    await waitFor(() => expect(auxGetNomes.nomeConta).toHaveBeenCalled());
    expect(getItensDashboard).not.toHaveBeenCalled();
    expect(auxGetNomes.nomePeriodo).not.toHaveBeenCalled();
    expect(getConsolidadoDre).not.toHaveBeenCalled();
  });

  it("registra erro ao salvar observação de devolução ao tesouro e encerra o loading", async () => {
    const erro = new Error("falha tesouro");
    putCriarEditarDeletarObservacaoDevolucaoTesouro.mockRejectedValue(erro);
    render(<RelatorioConsolidadoApuracao />);
    await aguardaCarga();

    act(() => {
      mockProps.TabelaDevolucoesAoTesouro.onClickObservacao({
        tipo_devolucao: "devolucao_tesouro",
        tipo_uuid: "t-1",
        observacao: "x",
      });
    });
    await act(async () => {
      await mockProps.ModalObservacoesRelatorioConsolidadoApuracao.serviceObservacao({
        operacao: "salvar",
      });
    });

    expect(console.log).toHaveBeenCalledWith(
      "Erro ao ",
      "salvar",
      "observação devolução ao Tesouro ",
      erro
    );
    expect(screen.getByTestId("TopoComBotoes")).toBeInTheDocument();
  });

  it("não chama nenhuma API de observação quando o tipo de devolução é desconhecido", async () => {
    render(<RelatorioConsolidadoApuracao />);
    await aguardaCarga();

    act(() => {
      mockProps.TabelaDevolucoesContaPtrf.onClickObservacao({ tipo_devolucao: "outro" });
    });
    await act(async () => {
      await mockProps.ModalObservacoesRelatorioConsolidadoApuracao.serviceObservacao({
        operacao: "operacao-desconhecida",
      });
    });

    expect(putCriarEditarDeletarObservacaoDevolucaoContaPtrf).not.toHaveBeenCalled();
    expect(putCriarEditarDeletarObservacaoDevolucaoTesouro).not.toHaveBeenCalled();
    expect(screen.getByTestId("TopoComBotoes")).toBeInTheDocument();
  });

  it("atualiza o texto da observação via onChangeObservacao e envia no salvar", async () => {
    render(<RelatorioConsolidadoApuracao />);
    await aguardaCarga();

    act(() => {
      mockProps.TabelaDevolucoesContaPtrf.onClickObservacao({
        tipo_devolucao: "devolucao_conta",
        tipo_uuid: "c-1",
        observacao: "antiga",
      });
    });
    act(() => {
      mockProps.ModalObservacoesRelatorioConsolidadoApuracao.onChangeObservacao("nova");
    });
    await act(async () => {
      await mockProps.ModalObservacoesRelatorioConsolidadoApuracao.serviceObservacao({
        operacao: "salvar",
      });
    });

    expect(putCriarEditarDeletarObservacaoDevolucaoContaPtrf).toHaveBeenCalledWith(
      "dre-1", "periodo-1", "conta-1", "c-1", { observacao: "nova" }
    );
  });

  it("mantém justificativa inicial quando a consulta retorna null", async () => {
    getJustificativa.mockResolvedValue(null);
    render(<RelatorioConsolidadoApuracao />);
    await aguardaCarga();
    expect(mockProps.JustificativaDiferenca.justificativaDiferenca.uuid).toBe("");
  });

  it("propaga ja_publicado='true' como true", async () => {
    mockUseParams.mockReturnValue({ ...params, ja_publicado: "true" });
    render(<RelatorioConsolidadoApuracao />);
    await aguardaCarga();
    expect(mockProps.BoxConsultarDados.jaPublicado).toBe(true);
  });
});
