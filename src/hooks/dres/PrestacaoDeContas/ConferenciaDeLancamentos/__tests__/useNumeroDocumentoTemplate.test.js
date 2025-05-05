import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import useNumeroDocumentoTemplate from "../useNumeroDocumentoTemplate";

function TestComponent({ rowData, column }) {
  const renderTemplate = useNumeroDocumentoTemplate();
  return renderTemplate(rowData, column);
}

describe("useNumeroDocumentoTemplate", () => {
  it("exibe o valor do campo quando está presente", () => {
    const rowData = { documento: "ABC123" };
    const column = { field: "documento" };

    render(<TestComponent rowData={rowData} column={column} />);

    expect(screen.getByText("ABC123")).toBeInTheDocument();
  });

  it('exibe "-" quando o valor do campo é nulo ou undefined', () => {
    const rowData = { documento: null };
    const column = { field: "documento" };

    render(<TestComponent rowData={rowData} column={column} />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it('exibe "-" quando a chave do campo nem existe', () => {
    const rowData = {};
    const column = { field: "documento" };

    render(<TestComponent rowData={rowData} column={column} />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
