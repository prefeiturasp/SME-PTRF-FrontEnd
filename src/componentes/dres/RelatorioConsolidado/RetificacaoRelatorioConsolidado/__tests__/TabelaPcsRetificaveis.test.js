import React from "react";
import { render, screen } from "@testing-library/react";
import { TabelaPcsRetificaveis } from "../TabelaPcsRetificaveis";

jest.mock("../../../../Globais/Mensagens/MsgImgCentralizada", () => ({
  MsgImgCentralizada: ({ texto }) => <div data-testid="msg">{texto}</div>,
}));

describe("TabelaPcsRetificaveis", () => {
  const base = () => ({
    pcsDoConsolidado: [{ uuid: "1", nome: "Escola A" }, { uuid: "2", nome: "Escola B" }],
    rowsPerPage: 10,
    nomeComTipoTemplate: (r) => <span>{r.nome}</span>,
    selecionarHeader: jest.fn(() => <span>HEADER</span>),
    selecionarTemplate: () => <span>chk</span>,
    quantidadeSelecionada: 0,
    montagemRetificar: jest.fn(() => <div>MONTAGEM</div>),
    mensagemQuantidadeExibida: jest.fn(() => <div>MSGQTD</div>),
    rowClassName: jest.fn(),
  });

  it("sem seleção mostra mensagem de quantidade e a tabela", () => {
    const p = base();
    render(<TabelaPcsRetificaveis {...p} />);
    expect(screen.getByText("MSGQTD")).toBeInTheDocument();
    expect(screen.queryByText("MONTAGEM")).not.toBeInTheDocument();
    expect(screen.getByText("Escola A")).toBeInTheDocument();
    expect(screen.getAllByText("HEADER").length).toBeGreaterThan(0);
  });

  it("com seleção mostra montagemRetificar", () => {
    render(<TabelaPcsRetificaveis {...base()} quantidadeSelecionada={2} />);
    expect(screen.getByText("MONTAGEM")).toBeInTheDocument();
    expect(screen.queryByText("MSGQTD")).not.toBeInTheDocument();
  });

  it("lista vazia mostra mensagem sem resultados", () => {
    render(<TabelaPcsRetificaveis {...base()} pcsDoConsolidado={[]} />);
    expect(screen.getByTestId("msg")).toHaveTextContent("Não encontramos resultados");
  });

  it("pcsDoConsolidado falso mostra mensagem sem resultados", () => {
    render(<TabelaPcsRetificaveis {...base()} pcsDoConsolidado={false} />);
    expect(screen.getByTestId("msg")).toBeInTheDocument();
  });

  it("pagina quando excede rowsPerPage", () => {
    render(<TabelaPcsRetificaveis {...base()} rowsPerPage={1} />);
    expect(document.querySelector(".p-paginator")).toBeInTheDocument();
  });
});
