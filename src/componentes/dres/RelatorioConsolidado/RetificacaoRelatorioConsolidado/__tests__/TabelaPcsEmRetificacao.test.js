import React from "react";
import { render, screen } from "@testing-library/react";
import { TabelaPcsEmRetificacao } from "../TabelaPcsEmRetificacao";

jest.mock("../../../../Globais/Mensagens/MsgImgCentralizada", () => ({
  MsgImgCentralizada: ({ texto }) => <div data-testid="msg">{texto}</div>,
}));

describe("TabelaPcsEmRetificacao", () => {
  const base = () => ({
    pcsEmRetificacao: [{ uuid: "1", nome: "Escola A" }, { uuid: "2", nome: "Escola B" }],
    rowsPerPage: 10,
    nomeComTipoTemplateRetificacao: (r) => <span>{r.nome}</span>,
    selecionarHeader: jest.fn(() => <span>HEADER</span>),
    selecionarTemplatePcsEmRetificacao: () => <span>chk</span>,
    quantidadeSelecionadaEmRetificacao: 0,
    montagemDesfazerRetificacao: jest.fn(() => <div>MONTAGEM</div>),
    mensagemQuantidadeExibida: jest.fn(() => <div>MSGQTD</div>),
    rowClassNamePcsEmRetificacao: jest.fn(),
  });

  it("sem seleção mostra mensagem de quantidade (true) e tabela", () => {
    const p = base();
    render(<TabelaPcsEmRetificacao {...p} />);
    expect(screen.getByText("MSGQTD")).toBeInTheDocument();
    expect(p.mensagemQuantidadeExibida).toHaveBeenCalledWith(true);
    expect(p.selecionarHeader).toHaveBeenCalledWith(true);
    expect(screen.getByText("Escola B")).toBeInTheDocument();
  });

  it("com seleção mostra montagemDesfazerRetificacao", () => {
    render(<TabelaPcsEmRetificacao {...base()} quantidadeSelecionadaEmRetificacao={1} />);
    expect(screen.getByText("MONTAGEM")).toBeInTheDocument();
  });

  it("lista vazia mostra mensagem", () => {
    render(<TabelaPcsEmRetificacao {...base()} pcsEmRetificacao={[]} />);
    expect(screen.getByTestId("msg")).toBeInTheDocument();
  });

  it("pcsEmRetificacao falso mostra mensagem", () => {
    render(<TabelaPcsEmRetificacao {...base()} pcsEmRetificacao={false} />);
    expect(screen.getByTestId("msg")).toBeInTheDocument();
  });

  it("pagina quando excede rowsPerPage", () => {
    render(<TabelaPcsEmRetificacao {...base()} rowsPerPage={1} />);
    expect(document.querySelector(".p-paginator")).toBeInTheDocument();
  });
});
