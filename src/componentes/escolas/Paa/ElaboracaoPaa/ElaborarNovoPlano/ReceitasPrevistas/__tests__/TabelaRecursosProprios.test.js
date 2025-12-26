import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TabelaRecursosProprios from "../TabelaRecursosProprios";

jest.mock("../../../../../../../utils/money", () => ({
  formatMoneyBRL: jest.fn((value) => `R$ ${value}`),
}));

jest.mock(
  "../../../../../../Globais/UI/Button/IconButton",
  () => ({
    IconButton: ({ onClick, "aria-label": ariaLabel }) => (
      <button aria-label={ariaLabel} onClick={onClick}>
        Editar
      </button>
    ),
  })
);


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
                  const { body, field } = column.props;

                  let content = null;

                  if (body) {
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


const renderComponent = (props = {}) => {
  const defaultProps = {
    totalRecursosProprios: { total: 1000 },
    setActiveTab: jest.fn(),
    handleOpenEditar: jest.fn(),
  };

  return render(<TabelaRecursosProprios {...defaultProps} {...props} />);
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

    expect(screen.getByText("R$ 21000")).toBeInTheDocument();
  });

  it("deve exibir '__' quando o campo for nulo", () => {
    renderComponent();

    const placeholders = screen.getAllByText("__");
    expect(placeholders.length).toBeGreaterThan(0);
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
