import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RelatorioAposAcertos } from "../RelatorioAposAcertos";
import {
  gerarPreviaRelatorioAposAcertos,
  verificarStatusGeracaoAposAcertos,
  downloadDocumentPdfAposAcertos,
  regerarPreviaRelatorioAposAcertos,
} from "../../../../services/escolas/PrestacaoDeContas.service";
import {
  getAnalisePrestacaoConta,
  getAnalisesDePcDevolvidas,
} from "../../../../services/dres/PrestacaoDeContas.service";
import { visoesService } from "../../../../services/visoes.service";

jest.mock("../../../../services/dres/PrestacaoDeContas.service");

jest.mock("../../../../services/escolas/PrestacaoDeContas.service", () => ({
  gerarPreviaRelatorioAposAcertos: jest.fn(),
  verificarStatusGeracaoAposAcertos: jest.fn(),
  downloadDocumentPdfAposAcertos: jest.fn(),
  regerarRelatorioAposAcertos: jest.fn(),
  regerarPreviaRelatorioAposAcertos: jest.fn(),
}));

jest.mock("../../../../services/dres/PrestacaoDeContas.service", () => ({
  getAnalisePrestacaoConta: jest.fn(),
  getAnalisesDePcDevolvidas: jest.fn(),
}));

jest.mock("../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(),
  },
}));

describe("RelatorioAposAcertos Component", () => {
  const mockProps = {
    prestacaoDeContasUuid: "test-uuid",
    prestacaoDeContas: {
      status: "DEVOLVIDA",
    },
    analiseAtualUuid: "analise-uuid",
    podeGerarPrevia: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock initial API responses
    getAnalisesDePcDevolvidas.mockResolvedValue([{ uuid: "analise-uuid" }]);
    getAnalisePrestacaoConta.mockResolvedValue({
      versao: "RASCUNHO",
      status: "DEVOLVIDA",
      pode_reprocessar_relatorio_apos_acertos: true,
    });
  });

  it("renderiza o componente com o estado inicial após o carregamento", () => {
    verificarStatusGeracaoAposAcertos.mockReturnValue("Relatório sendo gerado...");
    render(<RelatorioAposAcertos {...mockProps} />);
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("renderiza o componente com o estado inicial após o carregamento", async () => {
    verificarStatusGeracaoAposAcertos.mockResolvedValue("Relatório sendo gerado...");

    render(<RelatorioAposAcertos {...mockProps} />);

    await waitFor(() => {
      expect(screen.getAllByText("Relatório de apresentação após acertos")[0]).toBeInTheDocument();
      expect(screen.getByText("Relatório sendo gerado...")).toBeInTheDocument();
    });
  });

  it("gera a prévia do relatório de apresentação após acertos", async () => {
    verificarStatusGeracaoAposAcertos
      .mockResolvedValueOnce("Nenhum relatório gerado")
      .mockResolvedValueOnce("Relatório sendo gerado...");

    visoesService.getPermissoes.mockReturnValue(true);
    render(<RelatorioAposAcertos {...mockProps} />);
    const gerarPreviaButton = await screen.findByText("Gerar prévia");
    expect(gerarPreviaButton).toBeEnabled();
    fireEvent.click(gerarPreviaButton);
    await waitFor(() => {
      expect(gerarPreviaRelatorioAposAcertos).toHaveBeenCalledWith("analise-uuid");
    });
    await waitFor(() => {
      expect(screen.getByText("Relatório sendo gerado...")).toBeInTheDocument();
    });
  });

  it("regera o documento", async () => {
    verificarStatusGeracaoAposAcertos.mockResolvedValue("Erro ao gerar relatório");

    render(<RelatorioAposAcertos {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText("Regerar")).toBeInTheDocument();
    });

    const regerarButton = screen.getByText("Regerar");
    fireEvent.click(regerarButton);

    await waitFor(() => {
      expect(regerarPreviaRelatorioAposAcertos).toHaveBeenCalledWith("analise-uuid");
    });
  });

  it("baixa o documento", async () => {
    verificarStatusGeracaoAposAcertos.mockResolvedValue("Relatório gerado em 01/01/2024");

    render(<RelatorioAposAcertos {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByTitle("Download")).toBeInTheDocument();
    });

    const downloadButton = screen.getByTitle("Download");
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(downloadDocumentPdfAposAcertos).toHaveBeenCalledWith("analise-uuid");
    });
  });

  it("mostra as mensagens de status corretas", async () => {
    const statusMessages = [
      "Relatório sendo gerado...",
      "Nenhum relatório gerado",
      "Erro ao gerar relatório",
      "Relatório gerado em 01/01/2024",
    ];

    for (const message of statusMessages) {
      verificarStatusGeracaoAposAcertos.mockResolvedValue(message);

      const { rerender } = render(<RelatorioAposAcertos {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText(message)).toBeInTheDocument();
      });

      // Check correct CSS classes
      const messageElement = screen.getByText(message);
      if (message.includes("sendo gerado")) {
        expect(messageElement).toHaveClass("documento-processando");
      } else if (message.includes("Nenhum") || message.includes("Erro")) {
        expect(messageElement).toHaveClass("documento-pendente");
      } else if (message.includes("gerado em")) {
        expect(messageElement).toHaveClass("documento-gerado");
      }

      rerender(<RelatorioAposAcertos {...mockProps} />);
    }
  });

  it("verifica o status do relatório de apresentação após acertos", async () => {
    jest.useFakeTimers();
    verificarStatusGeracaoAposAcertos
      .mockResolvedValueOnce("Relatório sendo gerado...")
      .mockResolvedValueOnce("Relatório sendo gerado...")
      .mockResolvedValueOnce("Relatório gerado em 01/01/2024");

    render(<RelatorioAposAcertos {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText("Relatório sendo gerado...")).toBeInTheDocument();
    });

    // Fast-forward through polling intervals
    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(verificarStatusGeracaoAposAcertos).toHaveBeenCalledTimes(3);
    });

    jest.useRealTimers();
  });

  it("mostra o número da devolução correto", async () => {
    getAnalisesDePcDevolvidas.mockResolvedValue([{ uuid: "other-uuid" }, { uuid: "analise-uuid" }]);

    verificarStatusGeracaoAposAcertos.mockResolvedValue("Relatório gerado em 01/01/2024");

    render(<RelatorioAposAcertos {...mockProps} podeGerarPrevia={false} />);

    await waitFor(() => {
      expect(screen.getByText("2º Relatório de apresentação após acertos")).toBeInTheDocument();
    });
  });

  it("desabilita os botões apropriadamente com base no status", async () => {
    verificarStatusGeracaoAposAcertos.mockResolvedValue("Relatório sendo gerado...");

    render(<RelatorioAposAcertos {...mockProps} />);

    await waitFor(() => {
      const gerarPreviaButton = screen.queryByText("Gerar prévia");
      const regerarButton = screen.queryByText("Regerar");
      const downloadButton = screen.queryByTitle("Download");

      if (gerarPreviaButton) expect(gerarPreviaButton).toBeDisabled();
      if (regerarButton) expect(regerarButton).toBeDisabled();
      expect(downloadButton).not.toBeInTheDocument();
    });
  });

  it('desabilita "Gerar prévia" quando não tem permissão, mesmo com demais condições válidas', async () => {
    visoesService.getPermissoes.mockReturnValue(false);
    verificarStatusGeracaoAposAcertos.mockResolvedValue("Nenhum relatório gerado");

    render(<RelatorioAposAcertos {...mockProps} />);

    const gerarPreviaButton = await screen.findByText("Gerar prévia");
    expect(gerarPreviaButton).toBeDisabled();
  });

  it('habilita "Gerar prévia" quando tem permissão e condições válidas', async () => {
    visoesService.getPermissoes.mockReturnValue(true);
    verificarStatusGeracaoAposAcertos.mockResolvedValue("Nenhum relatório gerado");

    render(<RelatorioAposAcertos {...mockProps} />);

    const gerarPreviaButton = await screen.findByText("Gerar prévia");
    expect(gerarPreviaButton).toBeEnabled();
  });

  it('desabilita "Gerar prévia" se status da prestação de contas diferente de DEVOLVIDA', async () => {
    visoesService.getPermissoes.mockReturnValue(true);
    verificarStatusGeracaoAposAcertos.mockResolvedValue("Nenhum relatório gerado");

    render(<RelatorioAposAcertos {...mockProps} prestacaoDeContas={{ status: "DIFERENTE DE DEVOLVIDA" }} />);

    const gerarPreviaButton = await screen.findByText("Gerar prévia");
    expect(gerarPreviaButton).toBeDisabled();
  });
});
