import React, { useContext } from "react";
import { render, screen } from "@testing-library/react";
import { DataLimiteDevolucao, DataLimiteProvider } from "../index";
import userEvent from "@testing-library/user-event";

const TestComponent = () => {
  const { dataLimite, setDataLimite } = useContext(DataLimiteDevolucao);

  return (
    <div>
      <p data-testid="data-limite">{dataLimite || "sem data"}</p>
      <button onClick={() => setDataLimite("2025-04-10")}>Definir Data</button>
    </div>
  );
};

describe("DataLimiteProvider", () => {
  it("renderiza com valor inicial undefined", () => {
    render(
      <DataLimiteProvider>
        <TestComponent />
      </DataLimiteProvider>
    );

    expect(screen.getByTestId("data-limite")).toHaveTextContent("sem data");
  });

  it("altera o valor de dataLimite com setDataLimite", async () => {
    render(
      <DataLimiteProvider>
        <TestComponent />
      </DataLimiteProvider>
    );

    await userEvent.click(screen.getByText("Definir Data"));

    expect(screen.getByTestId("data-limite")).toHaveTextContent("2025-04-10");
  });
});
