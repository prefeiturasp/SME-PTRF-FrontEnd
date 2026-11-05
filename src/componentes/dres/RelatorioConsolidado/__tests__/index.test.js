import React from "react";
import { act, render, screen, waitFor, fireEvent } from "@testing-library/react";
import RelatorioConsolidado from "../index";
import {
  getExecucaoFinanceira,
  getFiqueDeOlhoRelatoriosConsolidados,
  getStatusConsolidadoDre,
  postPublicarConsolidadoDre,
  getTrilhaStatus,
  postGerarPreviaConsolidadoDre,
  getConsolidadosDreJaPublicadosProximaPublicacao,
  getStatusRelatorioConsolidadoDePublicacoesParciais,
} from "../../../../services/dres/RelatorioConsolidado.service";
import { getPeriodos } from "../../../../services/dres/Dashboard.service";
import { visoesService } from "../../../../services/visoes.service";
import { useRecursoSelecionadoContext } from "../../../../context/RecursoSelecionado";
import { useGetComissaoResponsavelPC } from "../hooks/useGetComissaoResponsavelPC";
import { toastCustom } from "../../../Globais/ToastCustom";
import { PERIODO_RELATORIO_CONSOLIDADO_DRE } from "../../../../services/auth.service";

const mockGetUUIDDre = jest.fn();

jest.mock("../../../../services/dres/RelatorioConsolidado.service", () => ({
  getExecucaoFinanceira: jest.fn(),
  getFiqueDeOlhoRelatoriosConsolidados: jest.fn(),
  getStatusConsolidadoDre: jest.fn(),
  postPublicarConsolidadoDre: jest.fn(),
  getTrilhaStatus: jest.fn(),
  postGerarPreviaConsolidadoDre: jest.fn(),
  getConsolidadosDreJaPublicadosProximaPublicacao: jest.fn(),
  getStatusRelatorioConsolidadoDePublicacoesParciais: jest.fn(),
}));
jest.mock("../../../../services/dres/Dashboard.service", () => ({ getPeriodos: jest.fn() }));
jest.mock("../../../../services/visoes.service", () => ({
  visoesService: { getItemUsuarioLogado: jest.fn() },
}));
jest.mock("../../../../hooks/Globais/useUnidadeSelecionada", () => ({
  __esModule: true,
  default: () => ({ getUUIDUnidadeSelecionadaTipoDRE: mockGetUUIDDre }),
}));
jest.mock("../../../../context/RecursoSelecionado", () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));
jest.mock("../hooks/useGetComissaoResponsavelPC", () => ({
  useGetComissaoResponsavelPC: jest.fn(),
}));
jest.mock("../../../Globais/ToastCustom", () => ({
  toastCustom: { ToastCustomError: jest.fn() },
}));
jest.mock("../../../../paginas/PaginasContainer", () => ({
  PaginasContainer: ({ children }) => <div>{children}</div>,
}));
jest.mock("../../../../utils/Loading", () => () => <div data-testid="loading">Carregando...</div>);
jest.mock("../../../Globais/Mensagens/MsgImgCentralizada", () => ({
  MsgImgCentralizada: ({ texto }) => <div data-testid="msg-img">{texto}</div>,
}));
jest.mock("../../../../utils/Modais", () => ({
  ModalAtaNaoPreenchida: ({ show, handleClose }) =>
    show ? (
      <div data-testid="modal-ata">
        <button onClick={handleClose}>fechar-ata</button>
      </div>
    ) : null,
}));

// Subcomponentes têm testes próprios; aqui capturamos as props recebidas.
const mockProps = {};
const mockCaptura = (nome, props) => {
  mockProps[nome] = props;
  return <div data-testid={nome} />;
};

jest.mock("../SelectPeriodo", () => ({
  SelectPeriodo: (p) => mockCaptura("SelectPeriodo", p),
}));
jest.mock("../BarraDeStatus", () => ({
  BarraDeStatus: (p) => mockCaptura("BarraDeStatus", p),
}));
jest.mock("../TrilhaDeStatus", () => ({
  TrilhaDeStatus: (p) => mockCaptura("TrilhaDeStatus", p),
}));
jest.mock("../PublicarDocumentos", () => (p) => (
  <div>
    {mockCaptura("PublicarDocumentos", p)}
    {p.children}
  </div>
));
jest.mock("../PreviaDocumento", () => (p) => mockCaptura("PreviaDocumento", p));
jest.mock("../DemonstrativoDaExecucaoFisicoFinanceira", () => (p) => mockCaptura("Demonstrativo", p));
jest.mock("../AtaParecerTecnico", () => ({
  AtaParecerTecnico: (p) => mockCaptura("AtaParecerTecnico", p),
}));
jest.mock("../Lauda", () => (p) => mockCaptura("Lauda", p));
jest.mock("../BlocoPublicacaoParcial", () => (p) => mockCaptura(`Bloco-${p.consolidadoDre.uuid}`, p));

const trilhaPadrao = (concluido = 3) => ({
  cards: [
    { status: "RECEBIDA", quantidade_prestacoes: 1 },
    { status: "CONCLUIDO", quantidade_prestacoes: concluido },
    { status: "APROVADA", quantidade_prestacoes: 12 },
    { status: "REPROVADA", quantidade_prestacoes: 120 },
  ],
});

const proxima = { uuid: "prox", eh_retificacao: false, ata_de_parecer_tecnico: { alterado_em: "2024-01-01" } };

let consolidadosPadrao;
let recurso;

const configuraPadrao = () => {
  consolidadosPadrao = {
    publicacoes_anteriores: [{ uuid: "pub1" }],
    proxima_publicacao: proxima,
  };
  recurso = { uuid: "rec1", habilita_exibicao_de_lauda: true };
  mockGetUUIDDre.mockReturnValue("dre-unidade");
  visoesService.getItemUsuarioLogado.mockReturnValue("dre-uuid");
  useRecursoSelecionadoContext.mockReturnValue({ recursoSelecionado: recurso });
  useGetComissaoResponsavelPC.mockReturnValue({ data: { uuid: "com1" } });
  getPeriodos.mockResolvedValue([{ uuid: "p-atual" }, { uuid: "p-anterior" }]);
  getStatusConsolidadoDre.mockResolvedValue([{ status_geracao: "CONCLUIDO" }]);
  getStatusRelatorioConsolidadoDePublicacoesParciais.mockResolvedValue({ status: "CONCLUIDO" });
  getTrilhaStatus.mockResolvedValue(trilhaPadrao());
  getExecucaoFinanceira.mockResolvedValue({ por_tipo_de_conta: [] });
  getConsolidadosDreJaPublicadosProximaPublicacao.mockResolvedValue(consolidadosPadrao);
  getFiqueDeOlhoRelatoriosConsolidados.mockResolvedValue({ results: [{ texto: "<b>Fique atento</b>" }] });
  postPublicarConsolidadoDre.mockResolvedValue({ status: "EM_PROCESSAMENTO" });
  postGerarPreviaConsolidadoDre.mockResolvedValue({ status: "CONCLUIDO" });
};

const renderiza = () => render(<RelatorioConsolidado />);

const aguardaCarregado = () =>
  waitFor(() => {
    expect(screen.getByTestId("PublicarDocumentos")).toBeInTheDocument();
    expect(mockProps.PublicarDocumentos.disableGerar).toBe(false);
  });

describe("RelatorioConsolidado (index)", () => {
  let logSpy;

  beforeEach(() => {
    Object.keys(mockProps).forEach((k) => delete mockProps[k]);
    localStorage.clear();
    configuraPadrao();
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renderiza fluxo completo com publicação atual e anteriores", async () => {
    renderiza();
    await aguardaCarregado();

    expect(screen.getByText("Consolidado das PCs")).toBeInTheDocument();
    expect(screen.getByText("Fique atento")).toBeInTheDocument();
    expect(mockProps.SelectPeriodo.periodoEscolhido).toBe("p-anterior");
    expect(mockProps.BarraDeStatus.statusBarraDeStatus).toEqual({ status_geracao: "CONCLUIDO" });
    expect(getFiqueDeOlhoRelatoriosConsolidados).toHaveBeenCalledWith(expect.anything(), "rec1");
    expect(getPeriodos).toHaveBeenCalledWith("dre-unidade");
    expect(getExecucaoFinanceira).toHaveBeenCalledWith("dre-uuid", "p-anterior", undefined);
    expect(mockProps.PublicarDocumentos.existeComissaoResponsavelPC).toBe(true);
    expect(mockProps.PublicarDocumentos.removerBtnGerar).toBeFalsy();
    expect(screen.getByTestId("PreviaDocumento")).toBeInTheDocument();
    expect(screen.getByTestId("Demonstrativo")).toBeInTheDocument();
    expect(screen.getByTestId("AtaParecerTecnico")).toBeInTheDocument();
    expect(screen.getByTestId("Lauda")).toBeInTheDocument();
    expect(screen.getByTestId("Bloco-pub1")).toBeInTheDocument();
    expect(mockProps["Bloco-pub1"].isShowLauda).toBe(true);
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  });

  it("usa período único (índice 0)", async () => {
    getPeriodos.mockResolvedValue([{ uuid: "unico" }]);
    renderiza();
    await waitFor(() => expect(mockProps.SelectPeriodo.periodoEscolhido).toBe("unico"));
  });

  it("usa período salvo no localStorage", async () => {
    localStorage.setItem(PERIODO_RELATORIO_CONSOLIDADO_DRE, "salvo");
    renderiza();
    await waitFor(() => expect(mockProps.SelectPeriodo.periodoEscolhido).toBe("salvo"));
  });

  it("sem períodos mostra mensagem e não escolhe período", async () => {
    getPeriodos.mockResolvedValue([]);
    renderiza();
    await waitFor(() => expect(getPeriodos).toHaveBeenCalled());
    expect(screen.getByTestId("msg-img")).toHaveTextContent("Selecione um período");
    expect(screen.queryByTestId("TrilhaDeStatus")).not.toBeInTheDocument();
  });

  it("trata erro ao buscar períodos", async () => {
    getPeriodos.mockRejectedValue(new Error("x"));
    renderiza();
    await waitFor(() => expect(logSpy).toHaveBeenCalledWith("Erro ao buscar períodos ", expect.any(Error)));
  });

  it("sem dre_uuid não carrega trilha e exibe mensagem", async () => {
    visoesService.getItemUsuarioLogado.mockReturnValue(null);
    renderiza();
    await waitFor(() => expect(mockProps.SelectPeriodo.periodoEscolhido).toBe("p-anterior"));
    expect(getTrilhaStatus).not.toHaveBeenCalled();
    expect(screen.getByTestId("msg-img")).toBeInTheDocument();
  });

  it("não exibe fique de olho em branco e trata erro", async () => {
    getFiqueDeOlhoRelatoriosConsolidados.mockResolvedValue({ results: [{ texto: "   " }] });
    const { unmount } = renderiza();
    await aguardaCarregado();
    expect(screen.queryByText("Fique atento")).not.toBeInTheDocument();
    unmount();

    getFiqueDeOlhoRelatoriosConsolidados.mockRejectedValue(new Error("x"));
    renderiza();
    await waitFor(() => expect(logSpy).toHaveBeenCalledWith("Erro ao buscar Fique de Olho ", expect.any(Error)));
  });

  it("handleChangePeriodos atualiza estado e localStorage", async () => {
    renderiza();
    await aguardaCarregado();
    await act(async () => {
      await mockProps.SelectPeriodo.handleChangePeriodos("novo");
    });
    expect(localStorage.getItem(PERIODO_RELATORIO_CONSOLIDADO_DRE)).toBe("novo");
    await waitFor(() => expect(mockProps.SelectPeriodo.periodoEscolhido).toBe("novo"));
  });

  it("trata erros de status, parciais, consolidados e execução financeira", async () => {
    getStatusConsolidadoDre.mockRejectedValue(new Error("a"));
    getStatusRelatorioConsolidadoDePublicacoesParciais.mockRejectedValue(new Error("b"));
    getExecucaoFinanceira.mockRejectedValue(new Error("c"));
    renderiza();
    await waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith("Erro ao buscar status Consolidado Dre ", expect.any(Error));
      expect(logSpy).toHaveBeenCalledWith("Erro ao carregar execução financeira ", expect.any(Error));
    });
  });

  it("status vazio não define barra de status", async () => {
    getStatusConsolidadoDre.mockResolvedValue([]);
    renderiza();
    await waitFor(() => expect(getStatusConsolidadoDre).toHaveBeenCalled());
    expect(screen.queryByTestId("BarraDeStatus")).not.toBeInTheDocument();
  });

  it("trata erro ao buscar consolidados já publicados", async () => {
    getConsolidadosDreJaPublicadosProximaPublicacao.mockRejectedValue(new Error("z"));
    renderiza();
    await waitFor(() => expect(logSpy).toHaveBeenCalledWith("Erro ao buscar Consolidado Dre ", expect.any(Error)));
  });

  it("sem próxima publicação nem anteriores", async () => {
    getConsolidadosDreJaPublicadosProximaPublicacao.mockResolvedValue({
      publicacoes_anteriores: false,
      proxima_publicacao: null,
    });
    renderiza();
    await waitFor(() => expect(screen.getByTestId("TrilhaDeStatus")).toBeInTheDocument());
    await waitFor(() => expect(getConsolidadosDreJaPublicadosProximaPublicacao).toHaveBeenCalled());
    expect(screen.queryByTestId("PublicarDocumentos")).not.toBeInTheDocument();
  });

  it("recarrega consolidados quando há relatório consolidado em processamento", async () => {
    consolidadosPadrao.proxima_publicacao = {
      ...proxima,
      relatorios_fisico_financeiros: [{ versao: "CONSOLIDADA", status_geracao: "EM_PROCESSAMENTO" }],
    };
    renderiza();
    await waitFor(() =>
      expect(getConsolidadosDreJaPublicadosProximaPublicacao.mock.calls.length).toBeGreaterThanOrEqual(2)
    );
  });

  it("não recarrega quando relatórios não estão em processamento", async () => {
    consolidadosPadrao.proxima_publicacao = {
      ...proxima,
      relatorios_fisico_financeiros: [{ versao: "CONSOLIDADA", status_geracao: "CONCLUIDO" }],
    };
    renderiza();
    await aguardaCarregado();
    expect(getConsolidadosDreJaPublicadosProximaPublicacao).toHaveBeenCalledTimes(1);
  });

  describe("polling", () => {
    let timers;
    beforeEach(() => {
      timers = [];
      jest.spyOn(global, "setInterval").mockImplementation((fn) => {
        timers.push(fn);
        return timers.length;
      });
      jest.spyOn(global, "clearInterval").mockImplementation(() => {});
    });

    it("EM_PROCESSAMENTO do consolidado mostra loading e refaz polling", async () => {
      getStatusConsolidadoDre.mockResolvedValue([{ status_geracao: "EM_PROCESSAMENTO" }]);
      renderiza();
      await waitFor(() => expect(screen.getByTestId("loading")).toBeInTheDocument());
      expect(screen.getByText(/documentos estão sendo gerados/)).toBeInTheDocument();
      expect(screen.queryByTestId("PublicarDocumentos")).not.toBeInTheDocument();

      const chamadas = getStatusConsolidadoDre.mock.calls.length;
      getStatusConsolidadoDre.mockResolvedValue([{ status_geracao: "CONCLUIDO" }]);
      await act(async () => {
        timers.forEach((fn) => fn());
      });
      expect(getStatusConsolidadoDre.mock.calls.length).toBeGreaterThan(chamadas);
      await waitFor(() => expect(screen.queryByTestId("loading")).not.toBeInTheDocument());
    });

    it("EM_PROCESSAMENTO das publicações parciais mostra loading", async () => {
      getStatusRelatorioConsolidadoDePublicacoesParciais.mockResolvedValue({ status: "EM_PROCESSAMENTO" });
      renderiza();
      await waitFor(() => expect(screen.getByTestId("loading")).toBeInTheDocument());

      getStatusRelatorioConsolidadoDePublicacoesParciais.mockResolvedValue({ status: "CONCLUIDO" });
      await act(async () => {
        timers.forEach((fn) => fn());
      });
      await waitFor(() => expect(screen.queryByTestId("loading")).not.toBeInTheDocument());
    });
  });

  describe("funções da trilha de status", () => {
    it("formataNumero, classes, cor, círculo duplo e filtraStatus", async () => {
      renderiza();
      await waitFor(() => expect(screen.getByTestId("TrilhaDeStatus")).toBeInTheDocument());
      const p = mockProps.TrilhaDeStatus;
      expect(p.formataNumero("CONCLUIDO")).toBe("03");
      expect(p.formataNumero("APROVADA")).toBe("12");
      expect(p.formataNumero("REPROVADA")).toBe("120");
      expect(p.retornaClasseCirculoTrilhaStatus("APROVADA")).toBe("circulo-relatorio-consolidado-dois-digitos");
      expect(p.retornaClasseCirculoTrilhaStatus("REPROVADA")).toBe("circulo-relatorio-consolidado-tres-digitos");
      expect(p.retornaCorCirculoTrilhaStatus(2)).toBe("circulo-relatorio-consolidado-simples-vermelho");
      expect(p.retornaCorCirculoTrilhaStatus(0)).toBe("circulo-relatorio-consolidado-simples");
      expect(p.eh_circulo_duplo(1)).toBe(true);
      expect(p.eh_circulo_duplo(2)).toBe(false);
      expect(p.filtraStatus().map((c) => c.status)).toEqual(["RECEBIDA", "CONCLUIDO"]);
    });
  });

  describe("regras de exibição e permissões", () => {
    it("sem prestações concluídas não exibe próxima publicação", async () => {
      getTrilhaStatus.mockResolvedValue(trilhaPadrao(0));
      renderiza();
      await waitFor(() => expect(screen.getByTestId("TrilhaDeStatus")).toBeInTheDocument());
      await waitFor(() => expect(screen.getByTestId("Bloco-pub1")).toBeInTheDocument());
      expect(screen.queryByTestId("PublicarDocumentos")).not.toBeInTheDocument();
      expect(mockProps["Bloco-pub1"].podeGerarPrevia()).toBe(false);
      expect(mockProps["Bloco-pub1"].podeAcessarInfoConsolidado(null)).toBe(false);
    });

    it("trilha sem cards: funções retornam undefined", async () => {
      getTrilhaStatus.mockResolvedValue({ cards: [] });
      renderiza();
      await waitFor(() => expect(screen.getByTestId("Bloco-pub1")).toBeInTheDocument());
      const p = mockProps["Bloco-pub1"];
      expect(p.podeGerarPrevia()).toBeUndefined();
      expect(p.podeGerarPreviaRetificacao()).toBeUndefined();
      expect(p.podeAcessarInfoConsolidado(null)).toBeUndefined();
    });

    it("podeGerarPreviaRetificacao e retificação concluída", async () => {
      renderiza();
      await aguardaCarregado();
      const p = mockProps["Bloco-pub1"];
      expect(p.podeGerarPreviaRetificacao({})).toBe(true);
      expect(p.todasAsPcsDaRetificacaoConcluidas({ eh_retificacao: true, todas_pcs_da_retificacao_concluidas: true })).toBe(true);
      expect(p.todasAsPcsDaRetificacaoConcluidas({ eh_retificacao: false })).toBeUndefined();
      expect(p.todasAsPcsDaRetificacaoConcluidas(null)).toBeFalsy();
      expect(p.podeAcessarInfoConsolidado({ eh_retificacao: true, todas_pcs_da_retificacao_concluidas: false })).toBe(false);
      expect(p.podeAcessarInfoConsolidado({ eh_retificacao: false })).toBe(true);
    });

    it("podeGerarPreviaRetificacao falso quando só há zero em pendentes", async () => {
      getTrilhaStatus.mockResolvedValue({
        cards: [
          { status: "RECEBIDA", quantidade_prestacoes: 0 },
          { status: "DEVOLVIDA", quantidade_prestacoes: 0 },
          { status: "CONCLUIDO", quantidade_prestacoes: 1 },
        ],
      });
      renderiza();
      await waitFor(() => expect(screen.getByTestId("Bloco-pub1")).toBeInTheDocument());
      expect(mockProps["Bloco-pub1"].podeGerarPreviaRetificacao({})).toBe(false);
    });

    it("publicações parciais: sem Ata e Lauda e com removerBtnGerar", async () => {
      consolidadosPadrao.proxima_publicacao = { ...proxima, eh_consolidado_de_publicacoes_parciais: true };
      getTrilhaStatus.mockResolvedValue(trilhaPadrao(0));
      renderiza();
      await aguardaCarregado();
      expect(mockProps.PublicarDocumentos.removerBtnGerar).toBe(true);
      expect(screen.queryByTestId("AtaParecerTecnico")).not.toBeInTheDocument();
      expect(screen.queryByTestId("Lauda")).not.toBeInTheDocument();
      expect(screen.getByTestId("Demonstrativo")).toBeInTheDocument();
    });

    it("sem habilitar lauda, Lauda não é exibida e sem comissão repassa false", async () => {
      recurso = { uuid: "rec1", habilita_exibicao_de_lauda: false };
      useRecursoSelecionadoContext.mockReturnValue({ recursoSelecionado: recurso });
      useGetComissaoResponsavelPC.mockReturnValue({ data: undefined });
      renderiza();
      await aguardaCarregado();
      expect(screen.queryByTestId("Lauda")).not.toBeInTheDocument();
      expect(mockProps.PublicarDocumentos.existeComissaoResponsavelPC).toBe(false);
      expect(mockProps["Bloco-pub1"].isShowLauda).toBe(false);
    });

    it("sem recursoSelecionado funciona", async () => {
      useRecursoSelecionadoContext.mockReturnValue({ recursoSelecionado: undefined });
      renderiza();
      await aguardaCarregado();
      expect(screen.queryByTestId("Lauda")).not.toBeInTheDocument();
    });

    it("execução financeira usa uuid da próxima publicação quando não é 'null'", async () => {
      renderiza();
      await aguardaCarregado();
      // Reescolhe o período: a execução é recarregada já com a próxima publicação carregada
      await act(async () => {
        await mockProps.SelectPeriodo.handleChangePeriodos("outro");
      });
      await waitFor(() => expect(getExecucaoFinanceira).toHaveBeenCalledWith("dre-uuid", "outro", "prox"));
    });
  });

  describe("publicarConsolidadoDre", () => {
    it("sem ata preenchida abre modal de ata e fecha", async () => {
      renderiza();
      await aguardaCarregado();
      const setShow = jest.fn();
      await act(async () => {
        await mockProps.PublicarDocumentos.publicarConsolidadoDre({ ata_de_parecer_tecnico: null }, setShow);
      });
      expect(setShow).toHaveBeenCalledWith(false);
      expect(screen.getByTestId("modal-ata")).toBeInTheDocument();
      expect(postPublicarConsolidadoDre).not.toHaveBeenCalled();
      fireEvent.click(screen.getByText("fechar-ata"));
      expect(screen.queryByTestId("modal-ata")).not.toBeInTheDocument();
    });

    it("ata sem alterado_em também abre modal", async () => {
      renderiza();
      await aguardaCarregado();
      await act(async () => {
        await mockProps.PublicarDocumentos.publicarConsolidadoDre({ ata_de_parecer_tecnico: {} }, jest.fn());
      });
      expect(screen.getByTestId("modal-ata")).toBeInTheDocument();
    });

    it("publica com sucesso e entra em processamento", async () => {
      renderiza();
      await aguardaCarregado();
      await act(async () => {
        await mockProps.PublicarDocumentos.publicarConsolidadoDre(proxima, jest.fn());
      });
      expect(postPublicarConsolidadoDre).toHaveBeenCalledWith({
        dre_uuid: "dre-uuid",
        periodo_uuid: "p-anterior",
        uuid_retificacao: null,
      });
      await waitFor(() => expect(screen.getByTestId("loading")).toBeInTheDocument());
    });

    it("erro com mensagem da API exibe toast", async () => {
      postPublicarConsolidadoDre.mockRejectedValue({ response: { data: { mensagem: "falhou" } } });
      renderiza();
      await aguardaCarregado();
      await act(async () => {
        await mockProps.PublicarDocumentos.publicarConsolidadoDre(proxima, jest.fn());
      });
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Erro ao publicar Consolidado Dre.", "falhou");
    });

    it("erro sem mensagem usa texto padrão", async () => {
      postPublicarConsolidadoDre.mockRejectedValue(new Error("x"));
      renderiza();
      await aguardaCarregado();
      await act(async () => {
        await mockProps.PublicarDocumentos.publicarConsolidadoDre(proxima, jest.fn());
      });
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Erro ao publicar Consolidado Dre.",
        "Erro ao publicar Consolidado Dre."
      );
    });
  });

  describe("publicarRetificacao", () => {
    const retificacao = { ...proxima, uuid: "ret1", eh_retificacao: true };

    it("sem ata abre modal", async () => {
      renderiza();
      await aguardaCarregado();
      await act(async () => {
        await mockProps.PublicarDocumentos.publicarRetificacao({ uuid: "ret1" });
      });
      expect(screen.getByTestId("modal-ata")).toBeInTheDocument();
    });

    it("publica com uuid da retificação", async () => {
      renderiza();
      await aguardaCarregado();
      await act(async () => {
        await mockProps.PublicarDocumentos.publicarRetificacao(retificacao);
      });
      expect(postPublicarConsolidadoDre).toHaveBeenCalledWith({
        dre_uuid: "dre-uuid",
        periodo_uuid: "p-anterior",
        uuid_retificacao: "ret1",
      });
    });

    it("erro é apenas logado", async () => {
      postPublicarConsolidadoDre.mockRejectedValue(new Error("x"));
      renderiza();
      await aguardaCarregado();
      await act(async () => {
        await mockProps.PublicarDocumentos.publicarRetificacao(retificacao);
      });
      expect(logSpy).toHaveBeenCalledWith("Erro ao publicar Consolidado Dre ", expect.any(Error));
    });

    it("setShowPublicarRetificacao é repassado aos filhos", async () => {
      renderiza();
      await aguardaCarregado();
      expect(mockProps.PublicarDocumentos.showPublicarRetificacao).toBe(false);
      act(() => {
        mockProps.PublicarDocumentos.setShowPublicarRetificacao(true);
      });
      expect(mockProps.PublicarDocumentos.showPublicarRetificacao).toBe(true);
    });
  });

  describe("prévias", () => {
    it("gerarPreviaConsolidadoDre sucesso", async () => {
      renderiza();
      await aguardaCarregado();
      await act(async () => {
        await mockProps.PreviaDocumento.gerarPreviaConsolidadoDre();
      });
      expect(postGerarPreviaConsolidadoDre).toHaveBeenCalledWith({
        dre_uuid: "dre-uuid",
        periodo_uuid: "p-anterior",
        uuid_retificacao: null,
      });
    });

    it("gerarPreviaConsolidadoDre erro", async () => {
      postGerarPreviaConsolidadoDre.mockRejectedValue(new Error("x"));
      renderiza();
      await aguardaCarregado();
      await act(async () => {
        await mockProps.PreviaDocumento.gerarPreviaConsolidadoDre();
      });
      expect(logSpy).toHaveBeenCalledWith("Erro ao publicar Prévia Consolidado Dre ", expect.any(Error));
    });

    it("gerarPreviaRetificacao sucesso e erro", async () => {
      renderiza();
      await aguardaCarregado();
      await act(async () => {
        await mockProps.PublicarDocumentos.gerarPreviaRetificacao({ uuid: "ret1" });
      });
      expect(postGerarPreviaConsolidadoDre).toHaveBeenCalledWith({
        dre_uuid: "dre-uuid",
        periodo_uuid: "p-anterior",
        uuid_retificacao: "ret1",
      });

      postGerarPreviaConsolidadoDre.mockRejectedValue(new Error("x"));
      await act(async () => {
        await mockProps.PublicarDocumentos.gerarPreviaRetificacao({ uuid: "ret1" });
      });
      expect(logSpy).toHaveBeenCalledWith("Erro ao publicar Prévia Consolidado Dre ", expect.any(Error));
    });
  });
});
