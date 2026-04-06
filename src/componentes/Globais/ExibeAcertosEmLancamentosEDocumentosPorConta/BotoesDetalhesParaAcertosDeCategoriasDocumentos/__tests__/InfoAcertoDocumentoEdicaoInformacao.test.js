import React from "react";
import { render, screen } from "@testing-library/react";
import InfoAcertoDocumentoEdicaoInformacao from "../InfoAcertoDocumentoEdicaoInformacao";

// Mock do LinkCustomSemAcao
jest.mock("../LinkCustomSemAcao", () => (props) => {
  return (
    <div data-testid="link-sem-acao" className={props.classeCssBotao}>
      {props.children}
    </div>
  );
});

describe("InfoAcertoDocumentoEdicaoInformacao", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar informação quando informacao_conciliacao_atualizada for true", () => {
    render(
      <InfoAcertoDocumentoEdicaoInformacao
        analise_documento={{ informacao_conciliacao_atualizada: true }}
      />
    );

    const elemento = screen.getByTestId("link-sem-acao");

    expect(elemento).toBeInTheDocument();
    expect(elemento).toHaveClass("texto-green text-center");

    expect(
      screen.getByText(/Justificativas e informações adicionais atualizada/i)
    ).toBeInTheDocument();
  });

  it("não deve renderizar quando informacao_conciliacao_atualizada for false", () => {
    const { container } = render(
      <InfoAcertoDocumentoEdicaoInformacao
        analise_documento={{ informacao_conciliacao_atualizada: false }}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("não deve renderizar quando analise_documento for null", () => {
    const { container } = render(
      <InfoAcertoDocumentoEdicaoInformacao
        analise_documento={null}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});