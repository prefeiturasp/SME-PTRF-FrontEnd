import React from "react";
import { render, screen } from "@testing-library/react";
import BotoesDetalhesParaAcertosDeCategorias from "../index";

// Mocks dos filhos
jest.mock("../BotaoAcertoDocumentoInclusaoGasto", () => () => (
  <div data-testid="botao-gasto" />
));

jest.mock("../BotaoAcertoDocumentoInclusaoCredito", () => () => (
  <div data-testid="botao-credito" />
));

jest.mock("../InfoAcertoDocumentoEdicaoInformacao", () => () => (
  <div data-testid="info-edicao" />
));

describe("BotoesDetalhesParaAcertosDeCategorias (Documentos)", () => {
  const defaultProps = {
    prestacaoDeContasUuid: "uuid-123",
    prestacaoDeContas: { id: 1 },
    analisePermiteEdicao: true,
    uuid_acerto_documento: "acerto-1",
    acerto: {},
  };

  const renderComponent = (analise_documento) =>
    render(
      <BotoesDetalhesParaAcertosDeCategorias
        {...defaultProps}
        analise_documento={analise_documento}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar botão de inclusão de gasto", () => {
    renderComponent({
      requer_inclusao_gasto: true,
    });

    expect(screen.getByTestId("botao-gasto")).toBeInTheDocument();
  });

  it("deve renderizar botão de inclusão de crédito", () => {
    renderComponent({
      requer_inclusao_credito: true,
    });

    expect(screen.getByTestId("botao-credito")).toBeInTheDocument();
  });

  it("deve renderizar informação de edição de conciliação", () => {
    renderComponent({
      requer_edicao_informacao_conciliacao: true,
    });

    expect(screen.getByTestId("info-edicao")).toBeInTheDocument();
  });

  it("deve renderizar múltiplos componentes quando múltiplas flags forem true", () => {
    renderComponent({
      requer_inclusao_gasto: true,
      requer_inclusao_credito: true,
      requer_edicao_informacao_conciliacao: true,
    });

    expect(screen.getByTestId("botao-gasto")).toBeInTheDocument();
    expect(screen.getByTestId("botao-credito")).toBeInTheDocument();
    expect(screen.getByTestId("info-edicao")).toBeInTheDocument();
  });

  it("não deve renderizar nenhum componente quando todas flags forem false", () => {
    renderComponent({
      requer_inclusao_gasto: false,
      requer_inclusao_credito: false,
      requer_edicao_informacao_conciliacao: false,
    });

    expect(screen.queryByTestId("botao-gasto")).not.toBeInTheDocument();
    expect(screen.queryByTestId("botao-credito")).not.toBeInTheDocument();
    expect(screen.queryByTestId("info-edicao")).not.toBeInTheDocument();
  });
});