import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import useValorTemplate from "../useValorTemplate";

function TestComponent({ rowData, column, valor }) {
  const retornaValor = useValorTemplate();
  return <span>{retornaValor(rowData, column, valor)}</span>;
}

describe("useValorTemplate", () => {
  it("formata corretamente o valor passado diretamente", () => {
    render(<TestComponent valor={1234.56} />);
    expect(screen.getByText("1.234,56")).toBeInTheDocument();
  });

  it("formata corretamente o valor vindo de rowData e column", () => {
    const rowData = { valor_total: 9876.5 };
    const column = { field: "valor_total" };

    render(<TestComponent rowData={rowData} column={column} />);
    expect(screen.getByText("9.876,50")).toBeInTheDocument();
  });

  it('formata 0 como "0,00"', () => {
    const rowData = { valor_total: 0 };
    const column = { field: "valor_total" };
    render(<TestComponent rowData={rowData} column={column} />);
    expect(screen.getByText("0,00")).toBeInTheDocument();
  });

  it('retorna "NaN" quando valor não é número válido', () => {
    render(<TestComponent valor={"abc"} />);
    expect(screen.getByText("NaN")).toBeInTheDocument();
  });
});
