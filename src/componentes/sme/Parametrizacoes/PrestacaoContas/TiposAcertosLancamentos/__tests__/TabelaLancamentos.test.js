import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { TabelaLancamentos } from "../TabelaLancamentos";
import { getTabelaCategoria } from "../../../../../../services/sme/Parametrizacoes.service";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
  getTabelaCategoria: jest.fn(),
}));

jest.mock("primereact/datatable", () => ({
  DataTable: ({ children, paginator, rows }) => (
    <div data-testid="datatable">
      <span data-testid="paginator">{String(paginator)}</span>
      <span data-testid="rows">{rows}</span>
      {children}
    </div>
  ),
}));

jest.mock("primereact/column", () => ({
  Column: (props) => {
    const row = {
      nome: "Lançamento",
      categoria: 2,
      ativo: true,
    };

    return (
      <div data-testid={`column-${props.field}`}>
        {props.header}

        {props.body && (
          <span data-testid={`body-${props.field}`}>{props.body(row)}</span>
        )}
      </div>
    );
  },
}));

describe("TabelaLancamentos", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getTabelaCategoria.mockResolvedValue({
      categorias: [
        {
          id: 2,
          nome: "Receita",
        },
      ],
    });
  });

  const props = {
    todosLancamentos: [
      {
        nome: "Lançamento",
        categoria: 2,
        ativo: true,
      },
    ],
    rowsPerPage: 10,
    lancamentosTemplate: jest.fn(() => "Editar"),
  };

  it("deve carregar as categorias ao montar o componente", async () => {
    render(<TabelaLancamentos {...props} />);

    await waitFor(() => expect(getTabelaCategoria).toHaveBeenCalledTimes(1));
  });

  it("deve informar paginator=false quando não ultrapassa rowsPerPage", () => {
    render(<TabelaLancamentos {...props} />);

    expect(screen.getByTestId("paginator")).toHaveTextContent("false");
  });

  it("deve informar paginator=true quando houver mais registros que rowsPerPage", () => {
    render(
      <TabelaLancamentos
        {...props}
        rowsPerPage={1}
        todosLancamentos={[
          { nome: "A", categoria: 2, ativo: true },
          { nome: "B", categoria: 2, ativo: false },
        ]}
      />,
    );

    expect(screen.getByTestId("paginator")).toHaveTextContent("true");
  });

  it("deve renderizar o template de ativo", () => {
    render(<TabelaLancamentos {...props} />);

    expect(screen.getByTestId("body-ativo")).toHaveTextContent("Sim");
  });

  it("deve chamar o template de ações", () => {
    render(<TabelaLancamentos {...props} />);

    expect(props.lancamentosTemplate).toHaveBeenCalled();
  });

  it("deve renderizar a categoria retornada pelo serviço", async () => {
    render(<TabelaLancamentos {...props} />);

    await waitFor(() =>
      expect(screen.getByTestId("body-categoria")).toHaveTextContent("Receita"),
    );
  });

  it("deve retornar vazio quando a categoria não existir", async () => {
    getTabelaCategoria.mockResolvedValue({
      categorias: [],
    });

    render(<TabelaLancamentos {...props} />);

    await waitFor(() =>
      expect(screen.getByTestId("body-categoria")).toHaveTextContent(""),
    );
  });
});
