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

describe("RelatorioConsolidadoApuracao Component", () => {
  const mockItensDashboard = {
    total_associacoes_dre: 30,
    cards: [
      { status: "RECEBIDA", quantidade_prestacoes: 2 },
      { status: "DEVOLVIDA", quantidade_prestacoes: 1 },
      { status: "EM_ANALISE", quantidade_prestacoes: 4 },
      { status: "APROVADA", quantidade_prestacoes: 10 },
      { status: "APROVADA_RESSALVA", quantidade_prestacoes: 5 },
      { status: "REPROVADA", quantidade_prestacoes: 3 },
    ],
  };

  const mockExecucaoFinanceira = {
    repasses_previstos_sme_custeio: 1000,
    repasses_no_periodo_custeio: 900,
    repasses_previstos_sme_capital: 0,
    repasses_no_periodo_capital: 0,
    repasses_previstos_sme_livre: 0,
    repasses_no_periodo_livre: 0,
    repasses_previstos_sme_total: 1000,
    repasses_no_periodo_total: 900,
    existe_lancamentos_devolucao_ao_tesouro: true,
  };

  const mockDevolucoesConta = [{ tipo_uuid: "tipo-conta-1", tipo_nome: "Saldo" }];
  const mockDevolucoesTesouro = [{ tipo_uuid: "tipo-tesouro-1", tipo_nome: "Glosa" }];

  const renderComponente = async () => {
    render(<RelatorioConsolidadoApuracao />);

    await waitFor(() => {
      expect(mockProps.TabelaExecucaoFisica.itensDashboard).toEqual(mockItensDashboard);
    });
    await waitFor(() => {
      expect(mockProps.TabelaExecucaoFinanceira.execucaoFinanceira).toEqual(
        mockExecucaoFinanceira
      );
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(mockProps).forEach((chave) => delete mockProps[chave]);
    jest.spyOn(console, "log").mockImplementation(() => {});

    mockUseParams.mockReturnValue({
      periodo_uuid: "periodo-1",
      conta_uuid: "conta-1",
      ja_publicado: "false",
      consolidado_dre_uuid: "consolidado-1",
    });
    visoesService.getItemUsuarioLogado.mockReturnValue("dre-1");

    getItensDashboard.mockResolvedValue(mockItensDashboard);
    getExecucaoFinanceira.mockResolvedValue(mockExecucaoFinanceira);
    getDevolucoesContaPtrf.mockResolvedValue(mockDevolucoesConta);
    getDevolucoesAoTesouro.mockResolvedValue(mockDevolucoesTesouro);
    getJustificativa.mockResolvedValue([]);
    getConsolidadoDre.mockResolvedValue([]);
    postJustificativa.mockResolvedValue({});
    patchJustificativa.mockResolvedValue({});
    putCriarEditarDeletarObservacaoDevolucaoContaPtrf.mockResolvedValue({});
    putCriarEditarDeletarObservacaoDevolucaoTesouro.mockResolvedValue({});
    auxGetNomes.nomePeriodo.mockResolvedValue("2025.1 - 01/01/2025 até 30/06/2025");
    auxGetNomes.nomeConta.mockResolvedValue("Cheque");
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  describe("Carregamento inicial", () => {
    it("deve buscar os dados do relatório usando os parâmetros da rota e a DRE logada", async () => {
      await renderComponente();

      expect(visoesService.getItemUsuarioLogado).toHaveBeenCalledWith(
        "associacao_selecionada.uuid"
      );
      expect(getItensDashboard).toHaveBeenCalledWith("periodo-1");
      expect(getExecucaoFinanceira).toHaveBeenCalledWith("dre-1", "periodo-1", "consolidado-1");
      expect(getConsolidadoDre).toHaveBeenCalledWith("dre-1", "periodo-1");
      await waitFor(() => {
        expect(getDevolucoesContaPtrf).toHaveBeenCalledWith("dre-1", "periodo-1", "conta-1");
      });
      expect(getDevolucoesAoTesouro).toHaveBeenCalledWith("dre-1", "periodo-1", "conta-1");
      expect(getJustificativa).toHaveBeenCalledWith("dre-1", "periodo-1", "conta-1");
    });

    it("deve enviar consolidado vazio para a execução financeira quando o parâmetro for 'null'", async () => {
      mockUseParams.mockReturnValue({
        periodo_uuid: "periodo-1",
        conta_uuid: "conta-1",
        ja_publicado: "false",
        consolidado_dre_uuid: "null",
      });

      await renderComponente();

      expect(getExecucaoFinanceira).toHaveBeenCalledWith("dre-1", "periodo-1", "");
    });

    it("deve repassar os nomes do período e da conta para o topo", async () => {
      await renderComponente();

      await waitFor(() => {
        expect(mockProps.TopoComBotoes).toEqual({
          periodoNome: "2025.1 - 01/01/2025 até 30/06/2025",
          contaNome: "Cheque",
        });
      });
      expect(auxGetNomes.nomePeriodo).toHaveBeenCalledWith("periodo-1");
      expect(auxGetNomes.nomeConta).toHaveBeenCalledWith("conta-1");
    });

    it("deve repassar as devoluções carregadas para as tabelas", async () => {
      await renderComponente();

      await waitFor(() => {
        expect(mockProps.TabelaDevolucoesContaPtrf.devolucoesContaPtrf).toEqual(
          mockDevolucoesConta
        );
      });
      expect(mockProps.TabelaDevolucoesAoTesouro.devolucoesAoTesouro).toEqual(
        mockDevolucoesTesouro
      );
    });

    it("deve repassar para a tabela financeira se existe devolução ao tesouro", async () => {
      await renderComponente();

      expect(mockProps.TabelaExecucaoFinanceira.exibe_devolucao_ao_tesouro).toBe(true);
    });
  });

  describe("Erros no carregamento inicial", () => {
    it("deve registrar o erro e manter a tabela financeira sem dados quando a execução financeira falhar", async () => {
      const erro = new Error("Falha execução");
      getExecucaoFinanceira.mockRejectedValue(erro);

      render(<RelatorioConsolidadoApuracao />);

      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith(
          "Erro ao carregar execução financeira ",
          erro
        );
      });
      expect(mockProps.TabelaExecucaoFinanceira.execucaoFinanceira).toBe(false);
      expect(mockProps.TabelaExecucaoFinanceira.comparaValores()).toBe(false);
    });

    it("deve registrar o erro e manter a tabela vazia quando as devoluções à conta PTRF falharem", async () => {
      const erro = new Error("Falha devoluções conta");
      getDevolucoesContaPtrf.mockRejectedValue(erro);

      render(<RelatorioConsolidadoApuracao />);

      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith(
          "Erro ao carregar Devolucoes a Conta Ptrf ",
          erro
        );
      });
      expect(mockProps.TabelaDevolucoesContaPtrf.devolucoesContaPtrf).toBe(false);
    });

    it("deve registrar o erro e manter a tabela vazia quando as devoluções ao tesouro falharem", async () => {
      const erro = new Error("Falha devoluções tesouro");
      getDevolucoesAoTesouro.mockRejectedValue(erro);

      render(<RelatorioConsolidadoApuracao />);

      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith(
          "Erro ao carregar Devolucoes ao Tesouro ",
          erro
        );
      });
      expect(mockProps.TabelaDevolucoesAoTesouro.devolucoesAoTesouro).toBe(false);
    });

    it("deve registrar o erro e manter a justificativa inicial quando a consulta falhar", async () => {
      const erro = new Error("Falha justificativa");
      getJustificativa.mockRejectedValue(erro);

      render(<RelatorioConsolidadoApuracao />);

      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith("Erro ao carregar justificativa ", erro);
      });
      expect(mockProps.JustificativaDiferenca.justificativaDiferenca).toEqual({
        uuid: "",
        dre: "dre-1",
        periodo: "periodo-1",
        tipo_conta: "conta-1",
        texto: "",
      });
    });

    it("deve registrar o erro e continuar exibindo a tela quando o consolidado DRE falhar", async () => {
      const erro = new Error("Falha consolidado");
      getConsolidadoDre.mockRejectedValue(erro);

      await renderComponente();

      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith("Erro ao buscar Consolidado Dre ", erro);
      });
      expect(screen.getByTestId("TopoComBotoes")).toBeInTheDocument();
    });

    it("não deve buscar o consolidado DRE quando não houver DRE logada", async () => {
      visoesService.getItemUsuarioLogado.mockReturnValue(undefined);

      render(<RelatorioConsolidadoApuracao />);

      await waitFor(() => {
        expect(getItensDashboard).toHaveBeenCalled();
      });
      expect(getConsolidadoDre).not.toHaveBeenCalled();
    });
  });

  describe("Consolidado já publicado", () => {
    it.each([
      ["false", false],
      ["true", true],
    ])("deve converter ja_publicado='%s' em %p para os subcomponentes", async (param, esperado) => {
      mockUseParams.mockReturnValue({
        periodo_uuid: "periodo-1",
        conta_uuid: "conta-1",
        ja_publicado: param,
        consolidado_dre_uuid: "consolidado-1",
      });

      await renderComponente();

      expect(mockProps.BoxConsultarDados).toEqual({
        periodo_uuid: "periodo-1",
        conta_uuid: "conta-1",
        jaPublicado: esperado,
      });
      expect(mockProps.JustificativaDiferenca.jaPublicado).toBe(esperado);
    });
  });

  describe("Cálculos da execução física", () => {
    it("deve somar as prestações recebidas, devolvidas e em análise", async () => {
      await renderComponente();

      await waitFor(() => {
        expect(mockProps.InfoAssociacoesEmAnalise).toEqual({
          totalEmAnalise: 7,
          periodoUuid: "periodo-1",
        });
      });
    });

    it("deve retornar a quantidade de prestações por status", async () => {
      await renderComponente();

      const { retornaQtdePorStatus } = mockProps.TabelaExecucaoFisica;

      expect(retornaQtdePorStatus("APROVADA")).toBe(10);
      expect(retornaQtdePorStatus("REPROVADA")).toBe(3);
    });

    it("deve calcular as não apresentadas descontando os status do total de associações", async () => {
      await renderComponente();

      // 30 - EM_ANALISE(4) - APROVADA(10) - APROVADA_RESSALVA(5) - REPROVADA(3)
      expect(mockProps.TabelaExecucaoFisica.retornaNaoApresentadas()).toBe(8);
    });
  });

  describe("Execução financeira", () => {
    it("deve formatar valores no padrão monetário brasileiro sem o símbolo R$", async () => {
      await renderComponente();

      expect(mockProps.TabelaExecucaoFinanceira.valorTemplate(1234.5).trim()).toBe("1.234,50");
    });

    it("deve indicar diferença entre previsto e transferido", async () => {
      await renderComponente();

      expect(mockProps.TabelaExecucaoFinanceira.comparaValores()).toBe(true);
      expect(mockProps.JustificativaDiferenca.comparaValores()).toBe(true);
    });

    it("não deve indicar diferença quando previsto e transferido forem iguais", async () => {
      const execucaoSemDiferenca = {
        ...mockExecucaoFinanceira,
        repasses_no_periodo_custeio: 1000,
        repasses_no_periodo_total: 1000,
      };
      getExecucaoFinanceira.mockResolvedValue(execucaoSemDiferenca);

      render(<RelatorioConsolidadoApuracao />);

      await waitFor(() => {
        expect(mockProps.TabelaExecucaoFinanceira.execucaoFinanceira).toEqual(
          execucaoSemDiferenca
        );
      });
      expect(mockProps.TabelaExecucaoFinanceira.comparaValores()).toBe(false);
    });
  });

  describe("Justificativa da diferença", () => {
    it("deve iniciar a justificativa com os dados da DRE, período e conta", async () => {
      await renderComponente();

      expect(mockProps.JustificativaDiferenca.justificativaDiferenca).toEqual({
        uuid: "",
        dre: "dre-1",
        periodo: "periodo-1",
        tipo_conta: "conta-1",
        texto: "",
      });
      expect(mockProps.JustificativaDiferenca.btnSalvarJustificativaDisable).toBe(true);
    });

    it("deve carregar a justificativa existente", async () => {
      const justificativaExistente = { uuid: "just-1", texto: "Texto salvo" };
      getJustificativa.mockResolvedValue([justificativaExistente]);

      await renderComponente();

      await waitFor(() => {
        expect(mockProps.JustificativaDiferenca.justificativaDiferenca).toEqual(
          justificativaExistente
        );
      });
    });

    it("deve atualizar o texto e habilitar o botão salvar ao alterar a justificativa", async () => {
      await renderComponente();

      act(() => {
        mockProps.JustificativaDiferenca.onChangeJustificativaDiferenca("Novo texto");
      });

      expect(mockProps.JustificativaDiferenca.justificativaDiferenca.texto).toBe("Novo texto");
      expect(mockProps.JustificativaDiferenca.btnSalvarJustificativaDisable).toBe(false);
    });

    it("deve criar a justificativa sem uuid quando ainda não existir", async () => {
      await renderComponente();

      act(() => {
        mockProps.JustificativaDiferenca.onChangeJustificativaDiferenca("Nova justificativa");
      });

      await act(async () => {
        await mockProps.JustificativaDiferenca.onSubmitJustificativaDiferenca();
      });

      expect(postJustificativa).toHaveBeenCalledWith({
        dre: "dre-1",
        periodo: "periodo-1",
        tipo_conta: "conta-1",
        texto: "Nova justificativa",
      });
      expect(patchJustificativa).not.toHaveBeenCalled();
      expect(mockProps.ModalSalvarJustificativa.show).toBe(true);
      expect(mockProps.JustificativaDiferenca.btnSalvarJustificativaDisable).toBe(true);
    });

    it("deve atualizar a justificativa existente pelo uuid", async () => {
      getJustificativa.mockResolvedValue([{ uuid: "just-1", texto: "Texto salvo" }]);

      await renderComponente();

      await waitFor(() => {
        expect(mockProps.JustificativaDiferenca.justificativaDiferenca.uuid).toBe("just-1");
      });

      act(() => {
        mockProps.JustificativaDiferenca.onChangeJustificativaDiferenca("Texto alterado");
      });

      await act(async () => {
        await mockProps.JustificativaDiferenca.onSubmitJustificativaDiferenca();
      });

      expect(patchJustificativa).toHaveBeenCalledWith("just-1", { texto: "Texto alterado" });
      expect(postJustificativa).not.toHaveBeenCalled();
      expect(mockProps.ModalSalvarJustificativa.show).toBe(true);
    });

    it("deve fechar o modal de justificativa salva", async () => {
      await renderComponente();

      await act(async () => {
        await mockProps.JustificativaDiferenca.onSubmitJustificativaDiferenca();
      });

      act(() => {
        mockProps.ModalSalvarJustificativa.handleClose();
      });

      expect(mockProps.ModalSalvarJustificativa.show).toBe(false);
    });
  });

  describe("Observações das devoluções", () => {
    it("deve abrir o modal com a devolução selecionada e fechá-lo", async () => {
      await renderComponente();

      const devolucao = { tipo_uuid: "tipo-conta-1", tipo_devolucao: "devolucao_conta" };

      act(() => {
        mockProps.TabelaDevolucoesContaPtrf.onClickObservacao(devolucao);
      });

      expect(mockProps.ModalObservacoesRelatorioConsolidadoApuracao).toMatchObject({
        show: true,
        observacao: devolucao,
        titulo: "Observação sobre devolução",
      });

      act(() => {
        mockProps.ModalObservacoesRelatorioConsolidadoApuracao.handleClose();
      });

      expect(mockProps.ModalObservacoesRelatorioConsolidadoApuracao.show).toBe(false);
    });

    it("deve salvar a observação de devolução à conta PTRF e recarregar a tabela", async () => {
      await renderComponente();
      await waitFor(() => {
        expect(mockProps.TabelaDevolucoesContaPtrf.devolucoesContaPtrf).toEqual(
          mockDevolucoesConta
        );
      });
      const chamadasAntes = getDevolucoesContaPtrf.mock.calls.length;

      act(() => {
        mockProps.TabelaDevolucoesContaPtrf.onClickObservacao({
          tipo_uuid: "tipo-conta-1",
          tipo_devolucao: "devolucao_conta",
        });
      });
      act(() => {
        mockProps.ModalObservacoesRelatorioConsolidadoApuracao.onChangeObservacao(
          "Observação nova"
        );
      });

      await act(async () => {
        await mockProps.ModalObservacoesRelatorioConsolidadoApuracao.serviceObservacao({
          operacao: "salvar",
        });
      });

      expect(putCriarEditarDeletarObservacaoDevolucaoContaPtrf).toHaveBeenCalledWith(
        "dre-1",
        "periodo-1",
        "conta-1",
        "tipo-conta-1",
        { observacao: "Observação nova" }
      );
      expect(getDevolucoesContaPtrf).toHaveBeenCalledTimes(chamadasAntes + 1);
      expect(putCriarEditarDeletarObservacaoDevolucaoTesouro).not.toHaveBeenCalled();
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
    });

    it("deve apagar a observação de devolução ao tesouro e recarregar a tabela", async () => {
      await renderComponente();
      await waitFor(() => {
        expect(mockProps.TabelaDevolucoesAoTesouro.devolucoesAoTesouro).toEqual(
          mockDevolucoesTesouro
        );
      });
      const chamadasAntes = getDevolucoesAoTesouro.mock.calls.length;

      act(() => {
        mockProps.TabelaDevolucoesAoTesouro.onClickObservacao({
          tipo_uuid: "tipo-tesouro-1",
          tipo_devolucao: "devolucao_tesouro",
          observacao: "Observação antiga",
        });
      });

      await act(async () => {
        await mockProps.ModalObservacoesRelatorioConsolidadoApuracao.serviceObservacao({
          operacao: "deletar",
        });
      });

      expect(putCriarEditarDeletarObservacaoDevolucaoTesouro).toHaveBeenCalledWith(
        "dre-1",
        "periodo-1",
        "conta-1",
        "tipo-tesouro-1",
        { observacao: "" }
      );
      expect(getDevolucoesAoTesouro).toHaveBeenCalledTimes(chamadasAntes + 1);
      expect(putCriarEditarDeletarObservacaoDevolucaoContaPtrf).not.toHaveBeenCalled();
    });

    it("deve exibir o carregamento enquanto a observação é salva", async () => {
      let resolverPut;
      putCriarEditarDeletarObservacaoDevolucaoContaPtrf.mockReturnValue(
        new Promise((resolve) => {
          resolverPut = resolve;
        })
      );

      await renderComponente();

      act(() => {
        mockProps.TabelaDevolucoesContaPtrf.onClickObservacao({
          tipo_uuid: "tipo-conta-1",
          tipo_devolucao: "devolucao_conta",
        });
      });

      let promessaServico;
      act(() => {
        promessaServico = mockProps.ModalObservacoesRelatorioConsolidadoApuracao.serviceObservacao({
          operacao: "salvar",
        });
      });

      expect(screen.getByText("Carregando...")).toBeInTheDocument();
      expect(screen.queryByTestId("TopoComBotoes")).not.toBeInTheDocument();

      await act(async () => {
        resolverPut({});
        await promessaServico;
      });

      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
      expect(screen.getByTestId("TopoComBotoes")).toBeInTheDocument();
    });

    it("deve encerrar o carregamento mesmo quando a API de observação falhar", async () => {
      putCriarEditarDeletarObservacaoDevolucaoContaPtrf.mockRejectedValue(new Error("Erro"));

      await renderComponente();

      act(() => {
        mockProps.TabelaDevolucoesContaPtrf.onClickObservacao({
          tipo_uuid: "tipo-conta-1",
          tipo_devolucao: "devolucao_conta",
        });
      });

      await act(async () => {
        await mockProps.ModalObservacoesRelatorioConsolidadoApuracao.serviceObservacao({
          operacao: "salvar",
        });
      });

      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
      expect(screen.getByTestId("TopoComBotoes")).toBeInTheDocument();
    });
  });
});
