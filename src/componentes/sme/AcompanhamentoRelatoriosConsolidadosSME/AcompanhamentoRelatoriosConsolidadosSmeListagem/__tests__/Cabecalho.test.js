import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Cabecalho } from "../Cabecalho";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../../../../utils/ValidacoesAdicionaisFormularios", () => ({
  exibeDataPT_BR: (date) => `DATA(${date})`,
}));

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, ...props }) => (
    <span data-testid="fontawesome-icon" {...props}>
      ICON-{icon?.iconName || "arrow"}
    </span>
  ),
}));

describe("Cabecalho", () => {
  const mockHandleChangePeriodos = jest.fn();

  const periodosMock = [
    {
      uuid: "p1",
      referencia: "Ref 1",
      data_inicio_realizacao_despesas: "2025-01-01",
      data_fim_realizacao_despesas: "2025-01-31",
    },
    {
      uuid: "p2",
      referencia: "Ref 2",
      data_inicio_realizacao_despesas: null,
      data_fim_realizacao_despesas: null,
    },
  ];

  beforeEach(() => jest.clearAllMocks());

  it("deve renderizar o select com todas as opções formatadas", () => {
    render(
      <MemoryRouter>
        <Cabecalho
          periodos={periodosMock}
          periodoEscolhido="p1"
          handleChangePeriodos={mockHandleChangePeriodos}
        />
      </MemoryRouter>
    );

    const select = screen.getByLabelText("Período:");
    expect(select).toBeInTheDocument();

    expect(
      screen.getByText("Ref 1 - DATA(2025-01-01) até DATA(2025-01-31)")
    ).toBeInTheDocument();

    expect(screen.getByText("Ref 2 - - até -")).toBeInTheDocument();
  });

  it("deve chamar handleChangePeriodos ao alterar período", () => {
    render(
      <MemoryRouter>
        <Cabecalho
          periodos={periodosMock}
          periodoEscolhido="p1"
          handleChangePeriodos={mockHandleChangePeriodos}
        />
      </MemoryRouter>
    );

    const select = screen.getByLabelText("Período:");
    fireEvent.change(select, { target: { value: "p2" } });

    expect(mockHandleChangePeriodos).toHaveBeenCalledWith("p2");
  });

  it("deve renderizar link de voltar com ícone", () => {
    render(
      <MemoryRouter>
        <Cabecalho
          periodos={periodosMock}
          periodoEscolhido="p1"
          handleChangePeriodos={mockHandleChangePeriodos}
        />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", {
      name: /Voltar para painel principal/i,
    });
    expect(link).toHaveAttribute(
      "href",
      "/analises-relatorios-consolidados-dre"
    );

    expect(screen.getByTestId("fontawesome-icon")).toBeInTheDocument();
  });

  it("deve renderizar título fixo", () => {
    render(
      <MemoryRouter>
        <Cabecalho
          periodos={periodosMock}
          periodoEscolhido="p1"
          handleChangePeriodos={mockHandleChangePeriodos}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Todos os relatórios")).toBeInTheDocument();
  });
});