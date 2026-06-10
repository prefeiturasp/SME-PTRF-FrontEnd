import { render, screen } from "@testing-library/react";
import { BlocoPrioridadesRetificacao } from "../index";

describe("BlocoPrioridadesRetificacao", () => {
  const mockPrioridadesAgrupadas = {
    PTRF: {
      prioridades: [
        { id: 1, alteracao: true, valor_total: "150.50" },
        { id: 2, alteracao: false, valor_total: "500.00" },
      ],
    },
    PDDE: {
      prioridades: [
        { id: 3, alteracao: true, valor_total: "100.00" },
        { id: 4, alteracao: true, valor_total: "250.75" },
      ],
    },
    RECURSO_PROPRIO: {
      prioridades: [
        { id: 5, alteracao: true, valor_total: null },
      ],
    },
  };

  it("deve renderizar as seções de retificação com os títulos e valores calculados corretamente", () => {
    render(<BlocoPrioridadesRetificacao prioridadesAgrupadas={mockPrioridadesAgrupadas} />);

    expect(screen.getByRole("heading", { level: 4, name: /prioridades ptrf/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 4, name: /prioridades pdde/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 4, name: /prioridades outros recursos/i })).toBeInTheDocument();

    expect(screen.getAllByText("150,50")).toHaveLength(2);

    expect(screen.getByText("350,75")).toBeInTheDocument();

    expect(screen.getByText("0,00")).toBeInTheDocument();
  });

  it("deve ocultar as tabelas cujos itens não sofreram nenhuma alteração", () => {
    const mockApenasPtrfAlterado = {
      PTRF: {
        prioridades: [{ id: 1, alteracao: true, valor_total: "80.00" }],
      },
      PDDE: {
        prioridades: [{ id: 2, alteracao: false, valor_total: "200.00" }],
      },
      RECURSO_PROPRIO: {
        prioridades: [],
      },
    };

    render(<BlocoPrioridadesRetificacao prioridadesAgrupadas={mockApenasPtrfAlterado} />);

    expect(screen.getByRole("heading", { level: 4, name: /prioridades ptrf/i })).toBeInTheDocument();
    expect(screen.getAllByText("80,00")).toHaveLength(2);

    expect(screen.queryByRole("heading", { level: 4, name: /prioridades pdde/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 4, name: /prioridades outros recursos/i })).not.toBeInTheDocument();
  });
});