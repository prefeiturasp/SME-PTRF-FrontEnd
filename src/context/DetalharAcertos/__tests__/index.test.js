import React, { useContext } from "react";
import { render, screen } from "@testing-library/react";
import { ProviderValidaParcial, ValidarParcialTesouro } from "../index";
import userEvent from "@testing-library/user-event";

const TestComponent = () => {
  const { isValorParcialValido, setIsValorParcialValido } = useContext(
    ValidarParcialTesouro
  );

  return (
    <div>
      <p data-testid="valor-parcial">
        {isValorParcialValido ? "true" : "false"}
      </p>
      <button onClick={() => setIsValorParcialValido(true)}>Validar</button>
    </div>
  );
};

describe("ProviderValidaParcial", () => {
  it('renderiza corretamente com valor inicial "false"', () => {
    render(
      <ProviderValidaParcial>
        <TestComponent />
      </ProviderValidaParcial>
    );

    expect(screen.getByTestId("valor-parcial")).toHaveTextContent("false");
  });

  it("altera o valor de isValorParcialValido ao chamar setIsValorParcialValido", async () => {
    render(
      <ProviderValidaParcial>
        <TestComponent />
      </ProviderValidaParcial>
    );

    await userEvent.click(screen.getByText("Validar"));

    expect(screen.getByTestId("valor-parcial")).toHaveTextContent("true");
  });
});
