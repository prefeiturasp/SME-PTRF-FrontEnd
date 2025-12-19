import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { HabilitarOutrosRecursos, HabilitarOutrosRecursosComponent } from "../index";
import { useGetOutrosRecursos } from "../hooks/useGet";

jest.mock("../hooks/useGet", () => ({
  useGetOutrosRecursos: jest.fn(),
}));

jest.mock("../Filtros", () => ({
  Filtros: () => <div data-testid="filtros" />,
}));

jest.mock("../Paginacao", () => ({
  Paginacao: () => <div data-testid="paginacao" />,
}));

jest.mock("../RecursoItem", () => ({
  RecursoItem: ({ recurso }) => (
    <div data-testid="recurso-item">{recurso.nome}</div>
  ),
}));

jest.mock("../context/index", () => ({
  OutrosRecursosPeriodosPaaProvider: ({ children }) => (
    <div data-testid="provider">{children}</div>
  ),
}));

describe("HabilitarOutrosRecursosComponent", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("não renderiza nada quando periodoUuid não é informado", () => {
    useGetOutrosRecursos.mockReturnValue({ data: null });

    const { container } = render(
      <HabilitarOutrosRecursosComponent />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renderiza título, filtros, texto e paginação quando periodoUuid existe", () => {
    useGetOutrosRecursos.mockReturnValue({
      data: { results: [] },
    });

    render(
      <HabilitarOutrosRecursosComponent periodoUuid="periodo-123" />
    );

    expect(
      screen.getByText("Habilitar Outros Recursos")
    ).toBeInTheDocument();

    expect(screen.getByTestId("filtros")).toBeInTheDocument();

    expect(
      screen.getByText(
        /para cada recurso habilitado, vincule ues ou importe uma lista/i
      )
    ).toBeInTheDocument();

    expect(screen.getByTestId("paginacao")).toBeInTheDocument();
  });

  it("renderiza a lista de RecursoItem conforme os dados retornados", () => {
    useGetOutrosRecursos.mockReturnValue({
      data: {
        results: [
          { nome: "Recurso A" },
          { nome: "Recurso B" },
        ],
      },
    });

    render(
      <HabilitarOutrosRecursosComponent periodoUuid="periodo-123" />
    );

    const itens = screen.getAllByTestId("recurso-item");
    expect(itens).toHaveLength(2);
    expect(itens[0]).toHaveTextContent("Recurso A");
    expect(itens[1]).toHaveTextContent("Recurso B");
  });

  it("não renderiza RecursoItem quando results está vazio", () => {
    useGetOutrosRecursos.mockReturnValue({
      data: { results: [] },
    });

    render(
      <HabilitarOutrosRecursosComponent periodoUuid="periodo-123" />
    );

    expect(
      screen.queryByTestId("recurso-item")
    ).not.toBeInTheDocument();
  });
});

describe("HabilitarOutrosRecursos (wrapper com Provider)", () => {
  it("renderiza o provider envolvendo o componente", () => {
    useGetOutrosRecursos.mockReturnValue({
      data: { results: [] },
    });

    render(<HabilitarOutrosRecursos periodoUuid="periodo-123" />);

    expect(screen.getByTestId("provider")).toBeInTheDocument();
  });
});
