import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PaaCard } from "../PaaCard";
import { downloadDocumentoFinalPaa, getDownloadAtaPaa } from "../../../../../../../services/Paa.service";
import { toastCustom } from "../../../../../../../componentes/Globais/ToastCustom";

let mockHook;

jest.mock("../../../../../../../services/Paa.service", () => ({
  downloadDocumentoFinalPaa: jest.fn(),
  getDownloadAtaPaa: jest.fn(),
}));

jest.mock("../../../../../../../hooks/Globais/useDocumentoFinalPaa", () => ({
  useDocumentoFinalPaa: () => mockHook,
}));

jest.mock("../../../../../../../componentes/Globais/ToastCustom", () => ({
  toastCustom: { ToastCustomError: jest.fn() },
}));

jest.mock("../../../../../../Globais/ModalVisualizarPdf", () => ({
  ModalVisualizarPdf: ({ show, url, titulo, iframeTitle, onHide }) => (
    <div data-testid="modal-pdf" data-show={String(show)} data-url={url || ""} data-titulo={titulo} data-iframe={iframeTitle}>
      <button type="button" onClick={onHide}>fechar-modal</button>
    </div>
  ),
}));

jest.mock("../RetificacoesAnteriores", () => ({
  __esModule: true,
  default: ({ retificacoesAnteriores }) => (
    <div data-testid="retificacoes-anteriores" data-total={retificacoesAnteriores.length} />
  ),
}));

jest.mock("../PaaSecaoPlanoEAta/PaaSecaoPlanoEAta", () => ({
  PaaSecaoPlanoEAta: (p) => (
    <div data-testid={`secao-${p.tituloSecao || "unica"}`} data-titulo-ata={p.tituloAta} data-resumo={p.resumoAssembleia || ""}>
      <button type="button" onClick={() => p.onVisualizarDocumento({ status: { retificacao: true } })}>
        {`vis-doc-${p.tituloSecao || "unica"}`}
      </button>
      <button type="button" onClick={() => p.onDownloadDocumento({ status: { retificacao: true } })}>
        {`down-doc-${p.tituloSecao || "unica"}`}
      </button>
      <button type="button" onClick={() => p.onVisualizarAta({ uuid: "ata-1" }, "Ata X")}>
        {`vis-ata-${p.tituloSecao || "unica"}`}
      </button>
      <button type="button" onClick={() => p.onVisualizarAta({}, undefined)}>
        {`vis-ata-sem-uuid-${p.tituloSecao || "unica"}`}
      </button>
      <button type="button" onClick={() => p.onDownloadAta({ uuid: "ata-1" })}>
        {`down-ata-${p.tituloSecao || "unica"}`}
      </button>
      <button type="button" onClick={() => p.onDownloadAta({})}>
        {`down-ata-sem-uuid-${p.tituloSecao || "unica"}`}
      </button>
    </div>
  ),
}));

const blocoOriginal = {
  secao_titulo: "Original",
  documento: { status: { retificacao: false } },
  ata: { uuid: "ata-1", status: { status_geracao: "CONCLUIDO" }, resumo_assembleia: "Resumo original" },
};

const dadosSimples = { uuid: "paa-1", original: blocoOriginal, exibe_dados_retificacao: false };

const dadosComRetificacao = {
  uuid: "paa-1",
  original: blocoOriginal,
  exibe_dados_retificacao: true,
  retificacao: {
    secao_titulo: "Retificação atual",
    documento: { status: { retificacao: true } },
    ata: { uuid: "ata-2", status: { status_geracao: "CONCLUIDO" }, resumo_assembleia: "Resumo retificação" },
  },
  retificacao_anterior: null,
  retificacoes_anteriores: [],
};

describe("PaaCard", () => {
  beforeEach(() => {
    mockHook = {
      obterUrlDocumentoFinal: jest.fn().mockResolvedValue("blob:doc"),
      obterUrlArquivoAtaPaa: jest.fn().mockResolvedValue("blob:ata"),
      revogarUrlDocumento: jest.fn(),
      visualizacaoEmAndamento: null,
      chaveVisualizacaoDocumento: jest.fn(),
    };
    downloadDocumentoFinalPaa.mockReset();
    getDownloadAtaPaa.mockReset();
    toastCustom.ToastCustomError.mockReset();
  });

  describe("renderização", () => {
    it("não renderiza sem documento original", () => {
      const { container } = render(
        <PaaCard dados={{ uuid: "paa-1", original: { ata: {} } }} onDadosAtualizados={jest.fn()} />
      );

      expect(container).toBeEmptyDOMElement();
    });

    it("não renderiza sem ata original", () => {
      const { container } = render(
        <PaaCard dados={{ uuid: "paa-1", original: { documento: {} } }} onDadosAtualizados={jest.fn()} />
      );

      expect(container).toBeEmptyDOMElement();
    });

    it("não renderiza sem dados", () => {
      const { container } = render(<PaaCard />);

      expect(container).toBeEmptyDOMElement();
    });

    it("sem retificação, mostra uma única seção sem título e a ata de apresentação", () => {
      render(<PaaCard dados={dadosSimples} onDadosAtualizados={jest.fn()} />);

      const secao = screen.getByTestId("secao-unica");
      expect(secao).toHaveAttribute("data-titulo-ata", "Ata de apresentação do PAA");
      expect(secao).toHaveAttribute("data-resumo", "Resumo original");
      expect(screen.queryByTestId("retificacoes-anteriores")).not.toBeInTheDocument();
    });

    it("com retificação, mostra a seção da retificação e a do original", () => {
      render(<PaaCard dados={dadosComRetificacao} onDadosAtualizados={jest.fn()} />);

      const retificacao = screen.getByTestId("secao-Retificação atual");
      expect(retificacao).toHaveAttribute("data-titulo-ata", "Ata de retificação do PAA");
      expect(retificacao).toHaveAttribute("data-resumo", "Resumo retificação");
      const original = screen.getByTestId("secao-Original");
      expect(original).toHaveAttribute("data-titulo-ata", "Ata de apresentação do PAA");
      expect(original).toHaveAttribute("data-resumo", "Resumo original");
    });

    it("mostra a retificação anterior quando existir", () => {
      const dados = {
        ...dadosComRetificacao,
        retificacao_anterior: {
          secao_titulo: "Retificação anterior",
          documento: { status: { retificacao: true } },
          ata: { uuid: "ata-3", resumo_assembleia: "Resumo anterior" },
        },
      };
      render(<PaaCard dados={dados} onDadosAtualizados={jest.fn()} />);

      expect(screen.getByTestId("secao-Retificação anterior")).toHaveAttribute("data-resumo", "Resumo anterior");
    });

    it("mostra as retificações anteriores com a lista recebida", () => {
      const dados = { ...dadosComRetificacao, retificacoes_anteriores: [{ secao_titulo: "R1" }, { secao_titulo: "R2" }] };
      render(<PaaCard dados={dados} onDadosAtualizados={jest.fn()} />);

      expect(screen.getByTestId("retificacoes-anteriores")).toHaveAttribute("data-total", "2");
    });

    it("exibe o separador final apenas quando não há retificações anteriores", () => {
      const { container, rerender } = render(<PaaCard dados={dadosComRetificacao} onDadosAtualizados={jest.fn()} />);
      expect(container.querySelectorAll("hr.paa-card__separador")).toHaveLength(1);

      rerender(
        <PaaCard
          dados={{ ...dadosComRetificacao, retificacoes_anteriores: [{ secao_titulo: "R1" }] }}
          onDadosAtualizados={jest.fn()}
        />
      );
      expect(container.querySelectorAll("hr.paa-card__separador")).toHaveLength(0);
    });

    it("inicia com o modal de PDF fechado", () => {
      render(<PaaCard dados={dadosSimples} onDadosAtualizados={jest.fn()} />);

      const modal = screen.getByTestId("modal-pdf");
      expect(modal).toHaveAttribute("data-show", "false");
      expect(modal).toHaveAttribute("data-titulo", "Documento");
      expect(modal).toHaveAttribute("data-iframe", "Documento PAA");
    });
  });

  describe("visualização de documentos", () => {
    it("abre o modal com o Plano Anual usando a retificação do bloco", async () => {
      render(<PaaCard dados={dadosSimples} onDadosAtualizados={jest.fn()} />);

      await userEvent.click(screen.getByText("vis-doc-unica"));

      await waitFor(() => expect(screen.getByTestId("modal-pdf")).toHaveAttribute("data-show", "true"));
      expect(mockHook.obterUrlDocumentoFinal).toHaveBeenCalledWith("paa-1", true);
      const modal = screen.getByTestId("modal-pdf");
      expect(modal).toHaveAttribute("data-url", "blob:doc");
      expect(modal).toHaveAttribute("data-titulo", "Documento — Plano Anual");
      expect(modal).toHaveAttribute("data-iframe", "Plano Anual");
    });

    it("abre o modal com a ata usando o título informado", async () => {
      render(<PaaCard dados={dadosSimples} onDadosAtualizados={jest.fn()} />);

      await userEvent.click(screen.getByText("vis-ata-unica"));

      await waitFor(() => expect(screen.getByTestId("modal-pdf")).toHaveAttribute("data-show", "true"));
      expect(mockHook.obterUrlArquivoAtaPaa).toHaveBeenCalledWith("ata-1");
      expect(screen.getByTestId("modal-pdf")).toHaveAttribute("data-titulo", "Documento — Ata X");
    });

    it("usa 'Ata' como título padrão e não abre o modal quando a ata não tem uuid", async () => {
      render(<PaaCard dados={dadosSimples} onDadosAtualizados={jest.fn()} />);

      await userEvent.click(screen.getByText("vis-ata-sem-uuid-unica"));

      expect(mockHook.obterUrlArquivoAtaPaa).not.toHaveBeenCalled();
      expect(screen.getByTestId("modal-pdf")).toHaveAttribute("data-show", "false");
    });

    it("não abre o modal quando a URL não é obtida", async () => {
      mockHook.obterUrlDocumentoFinal.mockResolvedValue(null);
      render(<PaaCard dados={dadosSimples} onDadosAtualizados={jest.fn()} />);

      await userEvent.click(screen.getByText("vis-doc-unica"));

      await waitFor(() => expect(mockHook.obterUrlDocumentoFinal).toHaveBeenCalled());
      expect(screen.getByTestId("modal-pdf")).toHaveAttribute("data-show", "false");
    });

    it("revoga a URL anterior ao abrir outro documento", async () => {
      render(<PaaCard dados={dadosSimples} onDadosAtualizados={jest.fn()} />);

      await userEvent.click(screen.getByText("vis-doc-unica"));
      await waitFor(() => expect(screen.getByTestId("modal-pdf")).toHaveAttribute("data-url", "blob:doc"));
      mockHook.obterUrlArquivoAtaPaa.mockResolvedValue("blob:ata-2");
      await userEvent.click(screen.getByText("vis-ata-unica"));

      await waitFor(() => expect(screen.getByTestId("modal-pdf")).toHaveAttribute("data-url", "blob:ata-2"));
      expect(mockHook.revogarUrlDocumento).toHaveBeenCalledWith("blob:doc");
    });

    it("ao fechar o modal revoga a URL e volta ao estado inicial", async () => {
      render(<PaaCard dados={dadosSimples} onDadosAtualizados={jest.fn()} />);
      await userEvent.click(screen.getByText("vis-doc-unica"));
      await waitFor(() => expect(screen.getByTestId("modal-pdf")).toHaveAttribute("data-show", "true"));

      await userEvent.click(screen.getByText("fechar-modal"));

      expect(mockHook.revogarUrlDocumento).toHaveBeenCalledWith("blob:doc");
      const modal = screen.getByTestId("modal-pdf");
      expect(modal).toHaveAttribute("data-show", "false");
      expect(modal).toHaveAttribute("data-url", "");
      expect(modal).toHaveAttribute("data-titulo", "Documento");
    });
  });

  describe("downloads", () => {
    it("baixa o documento final com a flag de retificação do bloco", async () => {
      downloadDocumentoFinalPaa.mockResolvedValue();
      render(<PaaCard dados={dadosSimples} onDadosAtualizados={jest.fn()} />);

      await userEvent.click(screen.getByText("down-doc-unica"));

      expect(downloadDocumentoFinalPaa).toHaveBeenCalledWith("paa-1", { retificacao: true });
      expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    });

    it("mostra erro quando o documento não é encontrado (404)", async () => {
      downloadDocumentoFinalPaa.mockRejectedValue({ status: 404 });
      render(<PaaCard dados={dadosSimples} onDadosAtualizados={jest.fn()} />);

      await userEvent.click(screen.getByText("down-doc-unica"));

      await waitFor(() =>
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
          "Documento não encontrado",
          "Não foi possível encontrar documento para visualização."
        )
      );
    });

    it("não mostra o erro de documento para outros status de falha", async () => {
      downloadDocumentoFinalPaa.mockRejectedValue({ status: 500 });
      render(<PaaCard dados={dadosSimples} onDadosAtualizados={jest.fn()} />);

      await userEvent.click(screen.getByText("down-doc-unica"));

      await waitFor(() => expect(downloadDocumentoFinalPaa).toHaveBeenCalled());
      expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    });

    it("baixa a ata quando ela possui uuid", async () => {
      getDownloadAtaPaa.mockResolvedValue();
      render(<PaaCard dados={dadosSimples} onDadosAtualizados={jest.fn()} />);

      await userEvent.click(screen.getByText("down-ata-unica"));

      expect(getDownloadAtaPaa).toHaveBeenCalledWith("ata-1");
    });

    it("não baixa a ata sem uuid", async () => {
      render(<PaaCard dados={dadosSimples} onDadosAtualizados={jest.fn()} />);

      await userEvent.click(screen.getByText("down-ata-sem-uuid-unica"));

      expect(getDownloadAtaPaa).not.toHaveBeenCalled();
    });
  });

  describe("atualização periódica durante o processamento da ata", () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    const emProcessamento = (extra = {}) => ({
      ...dadosSimples,
      original: {
        ...blocoOriginal,
        ata: { ...blocoOriginal.ata, status: { status_geracao: "EM_PROCESSAMENTO" } },
      },
      ...extra,
    });

    it("chama onDadosAtualizados a cada 5 segundos enquanto a ata original processa", () => {
      const onDadosAtualizados = jest.fn();
      render(<PaaCard dados={emProcessamento()} onDadosAtualizados={onDadosAtualizados} />);

      expect(onDadosAtualizados).not.toHaveBeenCalled();
      act(() => jest.advanceTimersByTime(5000));
      expect(onDadosAtualizados).toHaveBeenCalledTimes(1);
      act(() => jest.advanceTimersByTime(10000));
      expect(onDadosAtualizados).toHaveBeenCalledTimes(3);
    });

    it("também atualiza quando a ata de retificação está processando", () => {
      const onDadosAtualizados = jest.fn();
      const dados = {
        ...dadosComRetificacao,
        retificacao: {
          ...dadosComRetificacao.retificacao,
          ata: { ...dadosComRetificacao.retificacao.ata, status: { status_geracao: "EM_PROCESSAMENTO" } },
        },
      };
      render(<PaaCard dados={dados} onDadosAtualizados={onDadosAtualizados} />);

      act(() => jest.advanceTimersByTime(5000));

      expect(onDadosAtualizados).toHaveBeenCalledTimes(1);
    });

    it("não atualiza quando nenhuma ata está processando", () => {
      const onDadosAtualizados = jest.fn();
      render(<PaaCard dados={dadosSimples} onDadosAtualizados={onDadosAtualizados} />);

      act(() => jest.advanceTimersByTime(20000));

      expect(onDadosAtualizados).not.toHaveBeenCalled();
    });

    it("não falha sem onDadosAtualizados", () => {
      render(<PaaCard dados={emProcessamento()} />);

      expect(() => act(() => jest.advanceTimersByTime(5000))).not.toThrow();
    });

    it("interrompe a atualização ao desmontar", () => {
      const onDadosAtualizados = jest.fn();
      const { unmount } = render(<PaaCard dados={emProcessamento()} onDadosAtualizados={onDadosAtualizados} />);

      unmount();
      act(() => jest.advanceTimersByTime(10000));

      expect(onDadosAtualizados).not.toHaveBeenCalled();
    });
  });
});
