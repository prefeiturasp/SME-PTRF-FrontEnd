import React from "react";
import { render, screen } from "@testing-library/react";
import BotaoAcertoDocumentoInclusaoGasto from "../BotaoAcertoDocumentoInclusaoGasto";
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


describe("BotaoAcertoDocumentoInclusaoGasto", () => {
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

  it("deve renderizar 'Incluir novo gasto' quando não houver despesa e tiver permissão", () => {
    RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(true);

    render(
      <BotaoAcertoDocumentoInclusaoGasto
        {...defaultProps}
        acerto={{ despesa_incluida: null }}
      />
    );

    expect(screen.getByText("Incluir novo gasto")).toBeInTheDocument();

    const link = screen.getByTestId("link-custom");
    expect(link).toHaveAttribute("data-url", "/cadastro-de-despesa/");
  });

  it("deve renderizar 'Clique aqui para editar' quando houver despesa e tiver permissão", () => {
    RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(true);

    render(
      <BotaoAcertoDocumentoInclusaoGasto
        {...defaultProps}
        acerto={{ despesa_incluida: "456" }}
      />
    );

    expect(screen.getByText(/Clique aqui para editar/i)).toBeInTheDocument();

    const link = screen.getByTestId("link-custom");
    expect(link).toHaveAttribute("data-url", "/edicao-de-despesa/456");
  });

  it("deve renderizar 'Clique aqui para ver' quando houver despesa e NÃO tiver permissão", () => {
    RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(false);

    render(
      <BotaoAcertoDocumentoInclusaoGasto
        {...defaultProps}
        acerto={{ despesa_incluida: "456" }}
      />
    );

    expect(screen.getByText(/Clique aqui para ver/i)).toBeInTheDocument();

    const link = screen.getByTestId("link-custom");
    expect(link).toHaveAttribute("data-url", "/edicao-de-despesa/456");
  });

  it("deve usar URL de cadastro quando despesa_incluida for undefined", () => {
    RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(true);

    render(
      <BotaoAcertoDocumentoInclusaoGasto
        {...defaultProps}
        acerto={{ despesa_incluida: undefined }}
      />
    );

    const link = screen.getByTestId("link-custom");
    expect(link).toHaveAttribute("data-url", "/cadastro-de-despesa/");
  });
});