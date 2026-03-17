import React from "react";
import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { RelatorioDosAcertos } from "../RelatorioDosAcertos";

import {
  getRelatorioAcertosInfo,
  gerarPreviaRelatorioAcertos,
  downloadDocumentoPreviaPdf,
  getAnalisePrestacaoConta,
  getAnalisesDePcDevolvidas,
} from "../../../../../../services/dres/PrestacaoDeContas.service";
import { RetornaSeTemPermissaoEdicaoAcompanhamentoDePc } from "../../../RetornaSeTemPermissaoEdicaoAcompanhamentoDePc";

jest.mock("../../../../../../services/dres/PrestacaoDeContas.service", () => ({
  getRelatorioAcertosInfo: jest.fn(),
  gerarPreviaRelatorioAcertos: jest.fn(),
  downloadDocumentoPreviaPdf: jest.fn(),
  getAnalisePrestacaoConta: jest.fn(),
  getAnalisesDePcDevolvidas: jest.fn(),
}));

jest.mock("../../../RetornaSeTemPermissaoEdicaoAcompanhamentoDePc", () => ({
  RetornaSeTemPermissaoEdicaoAcompanhamentoDePc: jest.fn(),
}));

const defaultProps = {
  prestacaoDeContasUuid: "pc-uuid",
  analiseAtualUuid: "analise-uuid",
  podeGerarPrevia: true,
};

const setup = (props = {}) =>
  render(<RelatorioDosAcertos {...defaultProps} {...props} />);

beforeEach(() => {
  jest.clearAllMocks();

  RetornaSeTemPermissaoEdicaoAcompanhamentoDePc.mockReturnValue(true);

  getAnalisesDePcDevolvidas.mockResolvedValue([]);
  getAnalisePrestacaoConta.mockResolvedValue({
    versao: "RASCUNHO",
    status: "EM_ANALISE",
  });

  getRelatorioAcertosInfo.mockResolvedValue(
    "Nenhuma prévia gerada."
  );
  gerarPreviaRelatorioAcertos.mockResolvedValue({});
  downloadDocumentoPreviaPdf.mockResolvedValue({});
});

describe("RelatorioDosAcertos", () => {
  it("exibe Loading enquanto busca analise inicial", async () => {
    getAnalisePrestacaoConta.mockImplementation(
      () => new Promise(() => {})
    );

    setup();

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("após carregar analise, mostra título e mensagem retornada pelo serviço", async () => {
    getRelatorioAcertosInfo.mockResolvedValue(
      "Nenhuma prévia encontrada."
    );

    setup();

    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );

    expect(
      screen.getByText("DRE - Relatório dos acertos")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Relatório de devoluções para acertos")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Nenhuma prévia encontrada.")
    ).toBeInTheDocument();
  });

  it("usa número da devolução quando podeGerarPrevia é false e existem análises devolvidas", async () => {
    getAnalisesDePcDevolvidas.mockResolvedValue([
      { uuid: "analise-uuid-1" },
      { uuid: "analise-uuid" },
    ]);

    setup({ podeGerarPrevia: false });

    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );

    expect(
      screen.getByText("2º Relatório de devoluções para acertos")
    ).toBeInTheDocument();
  });

  it("define classe documento-processando e desabilita botões quando mensagem indica processamento", async () => {
    getRelatorioAcertosInfo.mockResolvedValue(
      "Relatório sendo gerado..."
    );

    setup();

    await waitFor(() =>
      expect(
        screen.queryByTestId("loading-relatorio-acertos")
      ).not.toBeInTheDocument()
    );

    const mensagem = screen.getByText("Relatório sendo gerado...");
    expect(mensagem).toHaveClass("documento-processando");

    const botaoGerar = screen.getByRole("button", { name: /Gerar prévia/i });
    expect(botaoGerar).toBeDisabled();
  });

  it("define classe documento-pendente quando não há prévias", async () => {
    getRelatorioAcertosInfo.mockResolvedValue(
      "Nenhuma prévia encontrada."
    );

    setup();

    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );

    const mensagem = screen.getByText("Nenhuma prévia encontrada.");
    expect(mensagem).toHaveClass("documento-pendente");
  });

  it("habilita download quando mensagem indica relatório já gerado", async () => {
    getRelatorioAcertosInfo.mockResolvedValue(
      "Relatório gerado em 01/01/2025."
    );

    setup();

    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );

    const botaoDownload = screen.getByTitle("Download");
    expect(botaoDownload).toBeEnabled();

    await act(async () => {
      fireEvent.click(botaoDownload);
    });

    expect(downloadDocumentoPreviaPdf).toHaveBeenCalledWith("analise-uuid");
    expect(getRelatorioAcertosInfo).toHaveBeenCalledTimes(3);
  });

  it("chama gerarPreviaRelatorioAcertos ao clicar em Gerar prévia", async () => {
    getRelatorioAcertosInfo.mockResolvedValue(
      "Nenhuma prévia gerada."
    );

    setup();

    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );

    const botaoGerar = screen.getByRole("button", { name: /Gerar prévia/i });
    expect(botaoGerar).toBeEnabled();

    await act(async () => {
      fireEvent.click(botaoGerar);
    });

    expect(gerarPreviaRelatorioAcertos).toHaveBeenCalledWith("analise-uuid");
  });
});

