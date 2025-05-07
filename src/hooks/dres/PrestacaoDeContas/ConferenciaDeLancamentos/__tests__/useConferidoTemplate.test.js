import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import useConferidoTemplate from "../useConferidoTemplate";

jest.mock("../../../../../componentes/Globais/UI/Icon", () => ({
  Icon: ({ icon, iconProps }) => (
    <div data-testid={`icon-${icon}`} {...iconProps}>
      {icon}
    </div>
  ),
}));

function TestComponent({ rowData, column }) {
  const renderTemplate = useConferidoTemplate();
  return renderTemplate(rowData, column);
}

describe("useConferidoTemplate", () => {
  it("exibe ícone verde e o ícone conferido automaticamente quando resultado é CORRETO e houve_considerados_corretos_automaticamente = true", () => {
    const rowData = {
      coluna1: {
        resultado: "CORRETO",
        houve_considerados_corretos_automaticamente: true,
      },
    };
    const column = { field: "coluna1" };

    render(<TestComponent rowData={rowData} column={column} />);

    expect(screen.getByTestId("icon-faCheckCircle")).toBeInTheDocument();
    expect(
      screen.getByTestId("icon-icon-conferido-automaticamente")
    ).toHaveAttribute("aria-label", "Conferido automaticamente");
  });

  it("exibe ícone vermelho quando resultado é AJUSTE e não houve conferido automaticamente", () => {
    const rowData = {
      coluna1: {
        resultado: "AJUSTE",
        houve_considerados_corretos_automaticamente: false,
      },
    };
    const column = { field: "coluna1" };

    render(<TestComponent rowData={rowData} column={column} />);

    expect(screen.getByTestId("icon-faCheckCircle")).toBeInTheDocument();
    expect(
      screen.queryByTestId("icon-conferido-automaticamente")
    ).not.toBeInTheDocument();
  });

  it('exibe "-" quando resultado não é CORRETO nem AJUSTE', () => {
    const rowData = {
      coluna1: {
        resultado: "INDEFINIDO",
      },
    };
    const column = { field: "coluna1" };

    render(<TestComponent rowData={rowData} column={column} />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
