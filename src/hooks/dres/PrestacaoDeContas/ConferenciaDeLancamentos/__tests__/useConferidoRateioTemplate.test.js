import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import useConferidoRateioTemplate from "../useConferidoRateioTemplate";

function TestComponent({ rateio }) {
  const renderTemplate = useConferidoRateioTemplate();
  return renderTemplate(rateio);
}

describe("useConferidoRateioTemplate", () => {
  it("renderiza checkbox marcado quando conferido = true", () => {
    const rateio = { conferido: true };
    render(<TestComponent rateio={rateio} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeDisabled();
    expect(checkbox).toBeChecked();
  });

  it("renderiza checkbox desmarcado quando conferido = false", () => {
    const rateio = { conferido: false };
    render(<TestComponent rateio={rateio} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeDisabled();
    expect(checkbox).not.toBeChecked();
  });
});
