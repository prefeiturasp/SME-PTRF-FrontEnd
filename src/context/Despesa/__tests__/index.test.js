import React, { useContext } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DespesaContext, DespesaContextProvider } from "../index";

const MockComponent = () => {
  const {
    verboHttp,
    setVerboHttp,
    idDespesa,
    setIdDespesa,
    initialValues,
    setInitialValues,
    valores_iniciais,
  } = useContext(DespesaContext);

  return (
    <div>
      <div data-testid="verboHttp">{verboHttp}</div>
      <div data-testid="idDespesa">{idDespesa}</div>
      <div data-testid="initialValues">{initialValues.numero_documento}</div>
      <div data-testid="valoresIniciais">
        {valores_iniciais.numero_documento}
      </div>

      <button onClick={() => setVerboHttp("POST")}>Set Verbo</button>
      <button onClick={() => setIdDespesa("abc123")}>Set ID</button>
      <button
        onClick={() =>
          setInitialValues((prev) => ({ ...prev, numero_documento: "12345" }))
        }
      >
        Set InitialValues
      </button>
    </div>
  );
};

describe("DespesaContext", () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn(() => "uuid-associacao-fake");
  });

  it("renderiza com valores padrões", () => {
    render(
      <DespesaContextProvider>
        <MockComponent />
      </DespesaContextProvider>
    );

    expect(screen.getByTestId("verboHttp").textContent).toBe("");
    expect(screen.getByTestId("idDespesa").textContent).toBe("");
    expect(screen.getByTestId("initialValues").textContent).toBe("");
    expect(screen.getByTestId("valoresIniciais").textContent).toBe("");
  });

  it("permite atualizar valores do contexto", () => {
    render(
      <DespesaContextProvider>
        <MockComponent />
      </DespesaContextProvider>
    );

    fireEvent.click(screen.getByText("Set Verbo"));
    expect(screen.getByTestId("verboHttp").textContent).toBe("POST");

    fireEvent.click(screen.getByText("Set ID"));
    expect(screen.getByTestId("idDespesa").textContent).toBe("abc123");

    fireEvent.click(screen.getByText("Set InitialValues"));
    expect(screen.getByTestId("initialValues").textContent).toBe("12345");
  });
});
