import React from "react";
import { render, screen, within } from "@testing-library/react";
import { TabelaExecucaoFisica } from "../TabelaExecucaoFisica";

describe("TabelaExecucaoFisica Component", () => {
  const quantidadesPorStatus = {
    APROVADA: 10,
    APROVADA_RESSALVA: 4,
    EM_ANALISE: 3,
    REPROVADA: 2,
  };

  const renderComponente = (itensDashboard = { total_associacoes_dre: 25 }) => {
    const retornaQtdePorStatus = jest.fn((status) => quantidadesPorStatus[status]);
    const retornaNaoApresentadas = jest.fn(() => 6);

    render(
      <TabelaExecucaoFisica
        itensDashboard={itensDashboard}
        retornaQtdePorStatus={retornaQtdePorStatus}
        retornaNaoApresentadas={retornaNaoApresentadas}
      />
    );

    return { retornaQtdePorStatus, retornaNaoApresentadas };
  };

  it("não deve renderizar nada quando não houver itens do dashboard", () => {
    const { container } = render(
      <TabelaExecucaoFisica
        itensDashboard={false}
        retornaQtdePorStatus={jest.fn()}
        retornaNaoApresentadas={jest.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("deve renderizar o título e os cabeçalhos da tabela", () => {
    renderComponente();

    expect(screen.getByText("Execução Física")).toBeInTheDocument();
    expect(screen.getByText("Prestação de contas das Associações")).toBeInTheDocument();

    [
      "Aprovadas",
      "Aprovadas com ressalvas",
      "Em análise",
      "Não apresentadas",
      "Não aprovadas",
      "Total",
    ].forEach((cabecalho) => {
      expect(screen.getByRole("columnheader", { name: cabecalho })).toBeInTheDocument();
    });
    expect(
      screen.getByRole("columnheader", {
        name: "Devidas (Não apresentadas + não aprovadas)",
      })
    ).toBeInTheDocument();
  });

  it("deve exibir as quantidades por status, as devidas e o total de associações", () => {
    renderComponente();

    const [, linhaValores] = screen.getAllByRole("row");
    const celulas = within(linhaValores)
      .getAllByRole("cell")
      .map((celula) => celula.textContent);

    // Aprovadas, com ressalvas, em análise, não apresentadas, não aprovadas, devidas (6 + 2), total
    expect(celulas).toEqual(["10", "4", "3", "6", "2", "8", "25"]);
  });

  it("deve consultar a quantidade de cada status exibido", () => {
    const { retornaQtdePorStatus } = renderComponente();

    ["APROVADA", "APROVADA_RESSALVA", "EM_ANALISE", "REPROVADA"].forEach((status) => {
      expect(retornaQtdePorStatus).toHaveBeenCalledWith(status);
    });
  });
});
