import React, { useContext } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AnaliseDREContext, AnaliseDREProvider } from "../index";

const MockConsumer = () => {
  const {
    lancamentosAjustes,
    setLancamentosAjustes,
    podeConcluir,
    setPodeConcluir,
  } = useContext(AnaliseDREContext);

  return (
    <div>
      <div data-testid="ajustes">{JSON.stringify(lancamentosAjustes)}</div>
      <div data-testid="pode-concluir">{podeConcluir.toString()}</div>
      <button onClick={() => setLancamentosAjustes([{ id: 1, valor: 100 }])}>
        Atualizar Ajustes
      </button>
      <button onClick={() => setPodeConcluir(true)}>Permitir Concluir</button>
    </div>
  );
};

describe("AnaliseDREContext", () => {
  it("fornece os valores padrões corretos", () => {
    render(
      <AnaliseDREProvider>
        <MockConsumer />
      </AnaliseDREProvider>
    );

    expect(screen.getByTestId("ajustes").textContent).toBe("[]");
    expect(screen.getByTestId("pode-concluir").textContent).toBe("false");
  });

  it("permite atualizar os valores do contexto", async () => {
    render(
      <AnaliseDREProvider>
        <MockConsumer />
      </AnaliseDREProvider>
    );

    // Clica para atualizar ajustes
    screen.getByText("Atualizar Ajustes").click();

    await waitFor(() => {
      expect(screen.getByTestId("ajustes").textContent).toBe(
        '[{"id":1,"valor":100}]'
      );
    });

    // Clica para permitir concluir
    screen.getByText("Permitir Concluir").click();

    await waitFor(() => {
      expect(screen.getByTestId("pode-concluir").textContent).toBe("true");
    });
  });
});
