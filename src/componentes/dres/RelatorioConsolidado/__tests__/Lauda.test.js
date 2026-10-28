import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Lauda from "../Lauda";
import { getDownloadLauda } from "../../../../services/dres/Laudas.service";

jest.mock("../../../../services/dres/Laudas.service", () => ({ getDownloadLauda: jest.fn() }));

const baixar = (container) => fireEvent.click(container.querySelector("svg"));

describe("Lauda", () => {
  it("mostra pendente de geração quando gerou retificação e não há laudas", () => {
    render(<Lauda consolidadoDre={{ gerou_uma_retificacao: true, laudas: [] }} />);
    expect(screen.getByText("Documento pedente de geração")).toBeInTheDocument();
  });

  it("sem laudas e sem retificação: só o container", () => {
    const { container } = render(<Lauda consolidadoDre={{ laudas: [] }} />);
    expect(container.querySelector(".border")).toBeInTheDocument();
    expect(screen.queryByText("Lauda")).not.toBeInTheDocument();
  });

  it("consolidadoDre sem campo laudas (undefined)", () => {
    const { container } = render(<Lauda consolidadoDre={{}} />);
    expect(container.querySelector(".border")).toBeInTheDocument();
  });

  it("lauda sem movimentação exibe mensagem", () => {
    render(<Lauda consolidadoDre={{ laudas: [{ uuid: "l1", sem_movimentacao: true, mensagem_sem_movimentacao: "Sem movimentação no período" }] }} />);
    expect(screen.getByText("Sem movimentação no período")).toBeInTheDocument();
  });

  it.each([
    ["NAO_GERADOS", "documento-pendente"],
    ["EM_PROCESSAMENTO", "documento-processando"],
    ["GERADO_TOTAL", "documento-gerado"],
  ])("classe de status %s", (status, classe) => {
    const { container } = render(<Lauda consolidadoDre={{ laudas: [{ uuid: "l1", status, status_geracao_arquivo: "Msg" }] }} />);
    expect(container.querySelector(`p.${classe}`)).toBeInTheDocument();
  });

  it("download usa nome com slug da DRE", async () => {
    const { container } = render(<Lauda consolidadoDre={{ dre_nome: "DIRETORIA REGIONAL DE EDUCACAO BUTANTA", laudas: [{ uuid: "l1", status: "GERADO_TOTAL", status_geracao_arquivo: "ok" }] }} />);
    baixar(container);
    expect(getDownloadLauda).toHaveBeenCalledWith("l1", "Lauda_butanta.pdf");
  });

  it("download sem dre_nome usa fallback", () => {
    const { container } = render(<Lauda consolidadoDre={{ laudas: [{ uuid: "l2", status: "GERADO_TOTAL", status_geracao_arquivo: "ok" }] }} />);
    baixar(container);
    expect(getDownloadLauda).toHaveBeenCalledWith("l2", "Lauda.pdf");
  });
});
