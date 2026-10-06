import React from "react";
import { render, screen } from "@testing-library/react";
import { DashboardCardPorDiretoria } from "../DashboardCardPorDiretoria";

const itensDashboard = {
  cards: [
    { titulo: "Não recebidas", quantidade_prestacoes: 4, status: "NAO_RECEBIDA" },
    { titulo: "Em análise", quantidade_prestacoes: 7, status: "EM_ANALISE" },
    { titulo: "Recebidas", quantidade_prestacoes: 11, status: "RECEBIDA" },
    { titulo: "Aprovadas", quantidade_prestacoes: 9, status: "APROVADA" },
    { titulo: "Total", quantidade_prestacoes: 31, status: "TOTAL_UNIDADES" },
  ],
};

describe("DashboardCardPorDiretoria", () => {
  it("deve exibir todos os cards enquanto o período não está concluído", () => {
    render(
      <DashboardCardPorDiretoria
        itensDashboard={itensDashboard}
        statusPeriodo={{ status: "EM_ANDAMENTO", cor_idx: 1 }}
      />
    );

    expect(screen.getByText("Não recebidas")).toBeInTheDocument();
    expect(screen.getByText("Em análise")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("31")).toBeInTheDocument();
    expect(screen.getByText("Total").closest(".card")).toHaveStyle({
      backgroundColor: "#2B7D83",
    });
  });

  it("deve exibir somente os três últimos cards quando o período está concluído", () => {
    render(
      <DashboardCardPorDiretoria
        itensDashboard={itensDashboard}
        statusPeriodo={{ status: "CONCLUIDO", cor_idx: 2 }}
      />
    );

    expect(screen.queryByText("Não recebidas")).not.toBeInTheDocument();
    expect(screen.queryByText("Em análise")).not.toBeInTheDocument();
    expect(screen.getByText("Recebidas")).toBeInTheDocument();
    expect(screen.getByText("Aprovadas")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
  });
});
