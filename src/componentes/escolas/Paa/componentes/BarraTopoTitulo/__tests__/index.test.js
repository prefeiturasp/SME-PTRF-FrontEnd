// BarraTopoTitulo.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BarraTopoTitulo from "../index";

const paaMock = {
  status: "EM_ELABORACAO",
  periodo_paa_objeto: { referencia: "Teste Referência" },
};

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

  it("renderiza o título vazio quando não há na prop", () => {
    render(
      <MemoryRouter>
        <BarraTopoTitulo paa={{}} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Plano Anual",
    );
  });

  it("renderiza o título com a data formatada da prop", () => {
    render(
      <MemoryRouter>
        <BarraTopoTitulo paa={paaMock} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Plano Anual Teste Referência",
    );
  });

  it("navega corretamente ao clicar no botão Voltar com origem definida", () => {
    render(
      <MemoryRouter>
        <BarraTopoTitulo origem="plano-aplicacao" paa={paaMock} />
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole("button", { name: /voltar ao plano de aplicação/i }),
    );
    expect(mockNavigate).toHaveBeenCalledWith(
      "/relatorios-componentes/plano-aplicacao",
    );
  });

  it("não renderiza botão Voltar quando origem não é informada", () => {
    render(
      <MemoryRouter>
        <BarraTopoTitulo paa={paaMock} />
      </MemoryRouter>,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
