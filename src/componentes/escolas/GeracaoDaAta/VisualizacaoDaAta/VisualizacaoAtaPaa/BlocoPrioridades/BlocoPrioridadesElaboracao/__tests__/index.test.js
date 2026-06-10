import { render, screen } from "@testing-library/react";
import { BlocoPrioridadesElaboracao } from "../index";

describe("BlocoPrioridadesElaboracao", () => {
  const mockPrioridadesAgrupadas = {
    PTRF: {
      prioridades: [{ id: 1, recurso: "PTRF", valorTotal: 10 }],
      total: 10,
    },
    PDDE: {
      prioridades: [{ id: 2, recurso: "PDDE", valorTotal: 5 }],
      total: 5,
    },
    RECURSO_PROPRIO: {
      prioridades: [{ id: 3, recurso: "Outros", valorTotal: 15 }],
      total: 15,
    },
  };

  it("deve renderizar as seções de tabelas de prioridades com os títulos h4 corretos", () => {
    render(<BlocoPrioridadesElaboracao prioridadesAgrupadas={mockPrioridadesAgrupadas} />);

    expect(screen.getByRole("heading", { level: 4, name: /prioridades ptrf/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 4, name: /prioridades pdde/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 4, name: /prioridades outros recursos/i })).toBeInTheDocument();
  });

  it("deve repassar e exibir corretamente os totais formatados dentro das tabelas", () => {
    render(<BlocoPrioridadesElaboracao prioridadesAgrupadas={mockPrioridadesAgrupadas} />);

    expect(screen.getByText("10,00")).toBeInTheDocument();
    expect(screen.getByText("5,00")).toBeInTheDocument();
    expect(screen.getByText("15,00")).toBeInTheDocument();
    
    const elementosTotal = screen.getAllByText("TOTAL");
    expect(elementosTotal.length).toBe(3);
  });

  it("deve ocultar a tabela ou renderizar vazio se o grupo de prioridades não contiver dados", () => {

    const mockComGrupoVazio = {
      PTRF: { prioridades: [{ id: 1 }], total: 10 },
      PDDE: { prioridades: [{ id: 2 }], total: 5 },
      RECURSO_PROPRIO: { prioridades: [], total: 0 },
    };

    render(<BlocoPrioridadesElaboracao prioridadesAgrupadas={mockComGrupoVazio} />);

    expect(screen.getByRole("heading", { level: 4, name: /prioridades ptrf/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 4, name: /prioridades pdde/i })).toBeInTheDocument();

    expect(screen.queryByRole("heading", { level: 4, name: /prioridades outros recursos/i })).not.toBeInTheDocument();
  });
});