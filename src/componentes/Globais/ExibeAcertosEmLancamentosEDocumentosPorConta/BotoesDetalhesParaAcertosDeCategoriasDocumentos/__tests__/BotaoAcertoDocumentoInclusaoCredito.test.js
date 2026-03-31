import React from "react";
import { render, screen } from "@testing-library/react";
import BotaoAcertoDocumentoInclusaoCredito from "../BotaoAcertoDocumentoInclusaoCredito";
import { RetornaSeTemPermissaoEdicaoAjustesLancamentos } from "../../RetornaSeTemPermissaoEdicaoAjustesLancamentos";

// Mock de permissão
jest.mock("../../RetornaSeTemPermissaoEdicaoAjustesLancamentos", () => ({
  RetornaSeTemPermissaoEdicaoAjustesLancamentos: jest.fn(),
}));

// Mock do LinkCustom
jest.mock("../LinkCustom", () => (props) => {
  return (
    <div data-testid="link-custom" data-url={props.url}>
      {props.children}
    </div>
  );
});


describe("BotaoAcertoDocumentoInclusaoCredito", () => {
  const defaultProps = {
    analise_documento: { id: 1 },
    prestacaoDeContasUuid: "uuid-123",
    prestacaoDeContas: { id: 10 },
    analisePermiteEdicao: true,
    uuid_acerto_documento: "uuid-doc",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar 'Incluir novo crédito' quando não houver receita e tiver permissão", () => {
    RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(true);

    render(
      <BotaoAcertoDocumentoInclusaoCredito
        {...defaultProps}
        acerto={{ receita_incluida: null }}
      />
    );

    expect(screen.getByText("Incluir novo crédito")).toBeInTheDocument();

    const link = screen.getByTestId("link-custom");
    expect(link).toHaveAttribute("data-url", "/cadastro-de-credito/");
  });

  it("deve renderizar 'Clique aqui para editar' quando houver receita e tiver permissão", () => {
    RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(true);

    render(
      <BotaoAcertoDocumentoInclusaoCredito
        {...defaultProps}
        acerto={{ receita_incluida: "123" }}
      />
    );

    expect(screen.getByText(/Clique aqui para editar/i)).toBeInTheDocument();

    const link = screen.getByTestId("link-custom");
    expect(link).toHaveAttribute("data-url", "/edicao-de-receita/123");
  });

  it("deve renderizar 'Clique aqui para ver' quando houver receita e NÃO tiver permissão", () => {
    RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(false);

    render(
      <BotaoAcertoDocumentoInclusaoCredito
        {...defaultProps}
        acerto={{ receita_incluida: "123" }}
      />
    );

    expect(screen.getByText(/Clique aqui para ver/i)).toBeInTheDocument();

    const link = screen.getByTestId("link-custom");
    expect(link).toHaveAttribute("data-url", "/edicao-de-receita/123");
  });

  it("deve usar URL de cadastro quando não houver receita", () => {
    RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(true);

    render(
      <BotaoAcertoDocumentoInclusaoCredito
        {...defaultProps}
        acerto={{ receita_incluida: undefined }}
      />
    );

    const link = screen.getByTestId("link-custom");
    expect(link).toHaveAttribute("data-url", "/cadastro-de-credito/");
  });
});