import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import useTagRateioTemplate from "../useTagRateioTemplate";

function TestComponent({ rateio }) {
  const renderTemplate = useTagRateioTemplate();
  return renderTemplate(rateio);
}

describe("useTagRateioTemplate", () => {
  it("renderiza o nome da tag quando presente", () => {
    const rateio = { tag: { nome: "Financeiro" } };

    render(<TestComponent rateio={rateio} />);

    expect(screen.getByText("Financeiro")).toBeInTheDocument();
    expect(screen.getByText("Financeiro")).toHaveClass(
      "span-rateio-tag-conferencia-de-lancamentos"
    );
  });

  it('renderiza "-" quando rateio é null', () => {
    render(<TestComponent rateio={null} />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it('renderiza "-" quando rateio não tem tag', () => {
    const rateio = {};

    render(<TestComponent rateio={rateio} />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it('renderiza "-" quando tag existe mas não tem nome', () => {
    const rateio = { tag: {} };

    render(<TestComponent rateio={rateio} />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
