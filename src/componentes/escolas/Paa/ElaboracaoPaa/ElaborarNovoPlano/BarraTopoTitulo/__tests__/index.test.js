// BarraTopoTitulo.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BarraTopoTitulo from "../index";

// mock do useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("BarraTopoTitulo", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renderiza o título vazio quando não há DADOS_PAA no localStorage", () => {
    render(
      <MemoryRouter>
        <BarraTopoTitulo />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Plano Anual"
    );
  });

  it("renderiza o título com a data formatada do localStorage", () => {
    localStorage.setItem(
      "DADOS_PAA",
      JSON.stringify({
        periodo_paa_objeto: { data_inicial: "2025-01-15" },
      })
    );

    render(
      <MemoryRouter>
        <BarraTopoTitulo />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Plano Anual 01/2025"
    );
  });

  it("atualiza o título quando o localStorage é alterado via evento storage", () => {
    render(
      <MemoryRouter>
        <BarraTopoTitulo />
      </MemoryRouter>
    );

    // dispara evento de storage
    localStorage.setItem(
      "DADOS_PAA",
      JSON.stringify({
        periodo_paa_objeto: { data_inicial: "2026-05-01" },
      })
    );
    fireEvent(
      window,
      new StorageEvent("storage", {
        key: "DADOS_PAA",
        newValue: JSON.stringify({
          periodo_paa_objeto: { data_inicial: "2026-05-01" },
        }),
      })
    );

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Plano Anual 05/2026"
    );
  });

  it("navega para /paa ao clicar no botão Voltar", () => {
    render(
      <MemoryRouter>
        <BarraTopoTitulo />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /voltar/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/paa");
  });
});
