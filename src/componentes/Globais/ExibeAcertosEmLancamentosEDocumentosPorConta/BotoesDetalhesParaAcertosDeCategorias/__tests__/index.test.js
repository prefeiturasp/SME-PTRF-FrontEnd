import React from "react";
import { render, screen } from "@testing-library/react";
import BotoesDetalhesParaAcertosDeCategorias from "../index";

// Mock dos componentes filhos
jest.mock("../BotaoAcertosLancamentosDevolucaoAoTesouro", () => () => <div data-testid="devolucao" />);
jest.mock("../BotaoAcertosLancamentosEdicaoGasto", () => () => <div data-testid="edicao-gasto" />);
jest.mock("../BotaoAcertosLancamentosEdicaoCredito", () => () => <div data-testid="edicao-credito" />);
jest.mock("../BotaoAcertosLancamentosExclusaoGasto", () => () => <div data-testid="exclusao-gasto" />);
jest.mock("../BotaoAcertosLancamentosExclusaoCredito", () => () => <div data-testid="exclusao-credito" />);
jest.mock("../BotaoAcertosLancamentosConciliacaoGasto", () => () => <div data-testid="conciliacao-gasto" />);
jest.mock("../BotaoAcertosLancamentosDesconciliacaoGasto", () => () => <div data-testid="desconciliacao-gasto" />);

describe("BotoesDetalhesParaAcertosDeCategorias", () => {
  const defaultProps = {
    carregaAcertosLancamentos: jest.fn(),
    conta: { id: 1 },
    prestacaoDeContasUuid: "uuid-123",
    prestacaoDeContas: { id: 10 },
    analisePermiteEdicao: true,
  };

  const renderComponent = (analise_lancamento, tipo_transacao = "Gasto") => {
    return render(
      <BotoesDetalhesParaAcertosDeCategorias
        {...defaultProps}
        analise_lancamento={analise_lancamento}
        tipo_transacao={tipo_transacao}
      />
    );
  };

  it("deve renderizar botão de devolução ao tesouro", () => {
    renderComponent({
      requer_atualizacao_devolucao_ao_tesouro: true,
    });

    expect(screen.getByTestId("devolucao")).toBeInTheDocument();
  });

  it("deve renderizar botão de edição de gasto", () => {
    renderComponent({
      requer_atualizacao_lancamento: true,
    });

    expect(screen.getByTestId("edicao-gasto")).toBeInTheDocument();
  });

  it("deve renderizar botão de conciliação (categoria CONCILIACAO_LANCAMENTO)", () => {
    renderComponent({
      requer_conciliacao_lancamento: true,
      categoria: "CONCILIACAO_LANCAMENTO",
    });

    expect(screen.getByTestId("conciliacao-gasto")).toBeInTheDocument();
  });

  it("deve renderizar botão de desconciliação (categoria DESCONCILIACAO_LANCAMENTO)", () => {
    renderComponent({
      requer_conciliacao_lancamento: true,
      categoria: "DESCONCILIACAO_LANCAMENTO",
    });

    expect(screen.getByTestId("desconciliacao-gasto")).toBeInTheDocument();
  });

  it("deve renderizar botão de edição de crédito", () => {
    renderComponent(
      {
        requer_atualizacao_lancamento: true,
      },
      "Crédito"
    );

    expect(screen.getByTestId("edicao-credito")).toBeInTheDocument();
  });

  it("deve renderizar botão de exclusão de gasto", () => {
    renderComponent({
      requer_exclusao_lancamento: true,
    });

    expect(screen.getByTestId("exclusao-gasto")).toBeInTheDocument();
  });

  it("deve renderizar botão de exclusão de crédito", () => {
    renderComponent(
      {
        requer_exclusao_lancamento: true,
      },
      "Crédito"
    );

    expect(screen.getByTestId("exclusao-credito")).toBeInTheDocument();
  });

  it("não deve renderizar nada quando analise_lancamento for null", () => {
    renderComponent(null);

    expect(screen.queryByTestId("devolucao")).not.toBeInTheDocument();
    expect(screen.queryByTestId("edicao-gasto")).not.toBeInTheDocument();
    expect(screen.queryByTestId("conciliacao-gasto")).not.toBeInTheDocument();
  });

  it("não deve renderizar botões de gasto quando tipo_transacao for Crédito", () => {
    renderComponent(
      {
        requer_atualizacao_devolucao_ao_tesouro: true,
        requer_atualizacao_lancamento: true,
        requer_exclusao_lancamento: true,
      },
      "Crédito"
    );

    expect(screen.queryByTestId("devolucao")).not.toBeInTheDocument();
    expect(screen.queryByTestId("edicao-gasto")).not.toBeInTheDocument();
    expect(screen.queryByTestId("exclusao-gasto")).not.toBeInTheDocument();
  });
});