import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TabelaRecursosProprios from "../TabelaRecursosProprios";

jest.mock("../hooks/useGetReceitasPrevistasOutrosRecursosPeriodo", () => ({
  useGetTodos: () => ({
    isLoading: false,
    data: [
      {
        uuid: "x1",
        outro_recurso_objeto: {
          nome: "Prêmio Excelência",
          cor: "#111",
          aceita_custeio: true,
          aceita_capital: true,
          aceita_livre_aplicacao: true,
        },
        receitas_previstas: [
          {
            previsao_valor_capital: 1000,
            previsao_valor_custeio: 2000,
            previsao_valor_livre: 3000,
            saldo_capital: 1000,
            saldo_custeio: 2000,
            saldo_livre: 3000,
          },
        ],
      },
      {
        uuid: "x2",
        outro_recurso_objeto: {
          nome: "Prêmio de Educação",
          cor: "#222",
          aceita_custeio: true,
          aceita_capital: true,
          aceita_livre_aplicacao: true,
        },
        receitas_previstas: [
          {
            previsao_valor_capital: 2000,
            previsao_valor_custeio: 3000,
            previsao_valor_livre: 4000,
            saldo_capital: 1000,
            saldo_custeio: 2000,
            saldo_livre: 3000,
          },
        ],
      },
      {
        uuid: "x3",
        outro_recurso_objeto: {
          nome: "Prêmio de Melhor escola",
          cor: "#333",
          aceita_custeio: true,
          aceita_capital: true,
          aceita_livre_aplicacao: true,
        },
        receitas_previstas: [],
      },
    ],
  }),
}));

jest.mock("../../../../../../Globais/UI/Button/IconButton", () => ({
  IconButton: ({ onClick, "aria-label": ariaLabel }) => (
    <button aria-label={ariaLabel} onClick={onClick}>
      Editar
    </button>
  ),
}));

jest.mock("primereact/column", () => {
  const React = require("react");

  return {
    Column: (props) => React.createElement("column", props),
  };
});

jest.mock("primereact/datatable", () => {
  const React = require("react");

  return {
    DataTable: ({ value, children }) => {
      const columns = React.Children.toArray(children);

      return (
        <table>
          <tbody>
            {value.map((row, rowIndex) => (
              <tr key={row.uuid || rowIndex}>
                {columns.map((column, colIndex) => {
                  if (!column?.props) return <td key={colIndex} />;

                  const { body, field } = column.props;

                  let content = null;

                  if (typeof body === "function") {
                    content = body(row, { rowIndex });
                  } else if (field) {
                    content = row[field];
                  }

                  return <td key={colIndex}>{content}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      );
    },
  };
});

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithQueryClient = (ui) => {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

const renderComponent = (props = {}) => {
  const defaultProps = {
    totalRecursosProprios: { total: 1000 },
    setActiveTab: jest.fn(),
    handleOpenEditar: jest.fn(),
  };

  return renderWithQueryClient(
    <TabelaRecursosProprios {...defaultProps} {...props} />
  );
};

describe("TabelaRecursosProprios", () => {
  it("deve renderizar os nomes dos recursos", () => {
    renderComponent();

    expect(screen.getByText("Recursos Próprios")).toBeInTheDocument();
    expect(screen.getByText("Prêmio Excelência")).toBeInTheDocument();
    expect(screen.getByText("Prêmio de Educação")).toBeInTheDocument();
    expect(screen.getByText("Prêmio de Melhor escola")).toBeInTheDocument();
    expect(screen.getByText("Total de Outros Recursos")).toBeInTheDocument();
  });

  it("deve calcular e renderizar o total de saldos corretamente", () => {
    renderComponent();

    // Total inclui recursos próprios (1000) + outros recursos (27000) = 28000
    expect(screen.getByText("R$ 28.000,00")).toBeInTheDocument();
  });

  it("deve exibir '__' quando o campo for nulo", () => {
    renderComponent();

    const placeholders = screen.getAllByText("__");
    expect(placeholders.length).toBeGreaterThan(0);
  });

  it("deve exibir traço para custeio e capital em Recursos Próprios", () => {
    renderComponent({ totalRecursosProprios: { total: 5000 } });
    
    const tracos = screen.getAllByText("__");
    expect(tracos.length).toBeGreaterThan(0);
  });

  it("deve exibir valor de livre aplicação em Recursos Próprios", () => {
    renderComponent({ totalRecursosProprios: { total: 5000 } });

    const valores = screen.getAllByText("R$ 5.000,00");
    expect(valores.length).toBeGreaterThan(0);
  });

  it("não deve renderizar botão de ação para linha fixa (Total)", () => {
    renderComponent();

    const botoes = screen.getAllByRole("button", { name: "Editar" });
    expect(botoes.length).toBe(4);
  });

  it("deve chamar setActiveTab ao clicar em editar Recursos Próprios", () => {
    const setActiveTab = jest.fn();

    renderComponent({ setActiveTab });
    const botao = screen.getAllByRole("button", { name: "Editar" })[0];
    fireEvent.click(botao);
    expect(setActiveTab).toHaveBeenCalledTimes(1);
  });

  it("deve chamar handleOpenEditar com os dados da linha ao editar outro recurso", () => {
    const handleOpenEditar = jest.fn();

    renderComponent({ handleOpenEditar });

    const botoes = screen.getAllByRole("button", { name: "Editar" });

    fireEvent.click(botoes[1]);

    expect(handleOpenEditar).toHaveBeenCalledTimes(1);
    expect(handleOpenEditar.mock.calls[0][0]).toMatchObject({
      uuid: "x1",
      nome: "Prêmio Excelência",
    });
  });
});
