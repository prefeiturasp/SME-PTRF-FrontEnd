import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { RelatorioDosAcertos } from "../index";
import {
  gerarPreviaRelatorioDevolucaoAcertosSme,
  verificarStatusGeracaoDevolucaoAcertosSme,
  downloadDocumentPdfDevolucaoAcertos,
} from "../../../../../../services/sme/AcompanhamentoSME.service";

jest.mock("../../../../../../services/sme/AcompanhamentoSME.service", () => ({
  gerarPreviaRelatorioDevolucaoAcertosSme: jest.fn(),
  verificarStatusGeracaoDevolucaoAcertosSme: jest.fn(),
  downloadDocumentPdfDevolucaoAcertos: jest.fn(),
}));

const defaultProps = {
  analiseSequenciaVisualizacao: {
    sequenciaConferencia: { uuid: "analise-sequencia-uuid" },
    versao_numero: 2,
  },
  relatorioConsolidado: {
    analise_atual: { uuid: "analise-atual-uuid" },
  },
  podeGerarPrevia: true,
};

const setup = (props = {}) =>
  render(<RelatorioDosAcertos {...defaultProps} {...props} />);

beforeEach(() => {
  jest.clearAllMocks();
  verificarStatusGeracaoDevolucaoAcertosSme.mockResolvedValue(
    "Nenhuma prévia gerada."
  );
  gerarPreviaRelatorioDevolucaoAcertosSme.mockResolvedValue({});
  downloadDocumentPdfDevolucaoAcertos.mockResolvedValue({});
});

describe("RelatorioDosAcertos SME", () => {
  it("should render safely with no props", async () => {
    render(<RelatorioDosAcertos />);

    expect(screen.getByText("Análise SME")).toBeInTheDocument();
    expect(
      screen.getByText("º Relatório de devoluções para acertos da DRE")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(verificarStatusGeracaoDevolucaoAcertosSme).not.toHaveBeenCalled();
    });
  });

  it("should render with valid props and call status service with uuid from relatorioConsolidado when podeGerarPrevia is true", async () => {
    setup({ podeGerarPrevia: true });

    expect(
      screen.getByText("Relatório de devoluções para acertos da DRE")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(verificarStatusGeracaoDevolucaoAcertosSme).toHaveBeenCalledWith(
        "analise-atual-uuid"
      );
    });

    expect(
      screen.getByRole("button", { name: /Gerar prévia/i })
    ).toBeInTheDocument();
  });

  it("should use uuid from analiseSequenciaVisualizacao when podeGerarPrevia is false", async () => {
    setup({
      podeGerarPrevia: false,
      analiseSequenciaVisualizacao: {
        sequenciaConferencia: { uuid: "sequencia-uuid" },
        versao_numero: 3,
      },
    });

    expect(
      screen.getByText("3º Relatório de devoluções para acertos da DRE")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(verificarStatusGeracaoDevolucaoAcertosSme).toHaveBeenCalledWith(
        "sequencia-uuid"
      );
    });

    expect(
      screen.queryByRole("button", { name: /Gerar prévia/i })
    ).not.toBeInTheDocument();
  });

  it("should set pending state when message contains Nenhuma", async () => {
    verificarStatusGeracaoDevolucaoAcertosSme.mockResolvedValueOnce(
      "Nenhuma prévia encontrada."
    );

    setup();

    const mensagem = await screen.findByText("Nenhuma prévia encontrada.");
    expect(mensagem).toHaveClass("documento-pendente");
    expect(screen.queryByTitle("Download")).not.toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Gerar prévia/i })).toBeEnabled();
  });

  it("should set pending state when message contains Nenhum", async () => {
    verificarStatusGeracaoDevolucaoAcertosSme.mockResolvedValueOnce(
      "Nenhum relatório disponível."
    );

    setup();

    const mensagem = await screen.findByText("Nenhum relatório disponível.");
    expect(mensagem).toHaveClass("documento-pendente");
    expect(screen.queryByTitle("Download")).not.toBeInTheDocument();
  });

  it("should set processing state and show spinner when service returns processing message", async () => {
    verificarStatusGeracaoDevolucaoAcertosSme.mockResolvedValueOnce(
      "Relatório sendo gerado..."
    );

    setup();

    const mensagem = await screen.findByText("Relatório sendo gerado...");
    expect(mensagem).toHaveClass("documento-processando");

    expect(screen.getByRole("button", { name: /Gerar prévia/i })).toBeDisabled();
    expect(screen.queryByTitle("Download")).not.toBeInTheDocument();
    expect(screen.getByRole("presentation")).toBeInTheDocument();
  });

  it("should enable download when message contains gerada em and execute download callback", async () => {
    verificarStatusGeracaoDevolucaoAcertosSme.mockResolvedValue(
      "Prévia gerada em 01/04/2026."
    );

    setup();

    await screen.findByText("Prévia gerada em 01/04/2026.");

    const botaoDownload = screen.getByTitle("Download");
    expect(botaoDownload).toBeEnabled();

    const user = userEvent.setup();
    await user.click(botaoDownload);

    expect(downloadDocumentPdfDevolucaoAcertos).toHaveBeenCalledWith(
      "analise-atual-uuid"
    );

    await waitFor(() => {
      expect(verificarStatusGeracaoDevolucaoAcertosSme.mock.calls.length).toBeGreaterThan(1);
    });
  });

  it("should trigger gerarPrevia callback and move UI to processing when clicking Gerar prévia", async () => {
    verificarStatusGeracaoDevolucaoAcertosSme.mockResolvedValue(
      "Nenhuma prévia gerada."
    );

    setup({ podeGerarPrevia: true });

    await screen.findByText("Nenhuma prévia gerada.");

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /Gerar prévia/i }));

    expect(gerarPreviaRelatorioDevolucaoAcertosSme).toHaveBeenCalledWith(
      "analise-atual-uuid"
    );

    expect(screen.getByText("Relatório sendo gerado...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Gerar prévia/i })).toBeDisabled();
  });

  it("should execute polling every 5 seconds while status is EM_PROCESSAMENTO", async () => {
    jest.useFakeTimers();
    verificarStatusGeracaoDevolucaoAcertosSme.mockResolvedValue(
      "Relatório sendo gerado..."
    );

    setup();

    await screen.findByText("Relatório sendo gerado...");
    const chamadasIniciais = verificarStatusGeracaoDevolucaoAcertosSme.mock.calls.length;

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(verificarStatusGeracaoDevolucaoAcertosSme.mock.calls.length).toBeGreaterThan(
        chamadasIniciais
      );
    });

    jest.useRealTimers();
  });

  it("should rerender and call status service with new uuid when props change", async () => {
    const { rerender } = setup({
      podeGerarPrevia: true,
      relatorioConsolidado: { analise_atual: { uuid: "uuid-inicial" } },
    });

    await waitFor(() => {
      expect(verificarStatusGeracaoDevolucaoAcertosSme).toHaveBeenCalledWith(
        "uuid-inicial"
      );
    });

    rerender(
      <RelatorioDosAcertos
        {...defaultProps}
        podeGerarPrevia={true}
        relatorioConsolidado={{ analise_atual: { uuid: "uuid-novo" } }}
      />
    );

    await waitFor(() => {
      expect(verificarStatusGeracaoDevolucaoAcertosSme).toHaveBeenCalledWith(
        "uuid-novo"
      );
    });
  });

  it("should not call services when uuid is absent in props", async () => {
    setup({
      podeGerarPrevia: true,
      relatorioConsolidado: { analise_atual: {} },
    });

    await waitFor(() => {
      expect(verificarStatusGeracaoDevolucaoAcertosSme).not.toHaveBeenCalled();
      expect(downloadDocumentPdfDevolucaoAcertos).not.toHaveBeenCalled();
      expect(gerarPreviaRelatorioDevolucaoAcertosSme).not.toHaveBeenCalled();
    });
  });
});
