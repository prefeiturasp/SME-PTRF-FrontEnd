import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Filtros } from "../Filtros";

jest.mock("antd", () => {
  const React = require("react");

  const Option = ({ children, value }) => (
    <option value={value}>{children}</option>
  );

  const Select = ({ children, value, onChange, id }) => (
    <select
      data-testid={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {children}
    </select>
  );

  Select.Option = Option;

  return { Select };
});

describe("Filtros", () => {
  const defaultProps = {
    stateFiltros: {
      filtrar_por_nome: "",
      filtrar_por_categoria: "",
      filtrar_por_ativo: "",
    },
    handleChangeFiltros: jest.fn(),
    handleSubmitFiltros: jest.fn(),
    limpaFiltros: jest.fn(),
    categoriaTabela: [
      {
        id: 1,
        nome: "Categoria 1",
      },
      {
        id: 2,
        nome: "Categoria 2",
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar todos os campos", () => {
    render(<Filtros {...defaultProps} />);

    expect(screen.getByLabelText(/Filtrar por nome/i)).toBeInTheDocument();
    expect(screen.getByTestId("filtrar_por_categoria")).toBeInTheDocument();
    expect(screen.getByLabelText(/Filtrar por status/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Limpar/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Filtrar/i }),
    ).toBeInTheDocument();
  });

  it("deve chamar handleChangeFiltros ao alterar o nome", () => {
    render(<Filtros {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/Filtrar por nome/i), {
      target: {
        name: "filtrar_por_nome",
        value: "Teste",
      },
    });

    expect(defaultProps.handleChangeFiltros).toHaveBeenCalledWith(
      "filtrar_por_nome",
      "Teste",
    );
  });

  it("deve chamar handleChangeFiltros ao alterar o status", () => {
    render(<Filtros {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/Filtrar por status/i), {
      target: {
        name: "filtrar_por_ativo",
        value: "True",
      },
    });

    expect(defaultProps.handleChangeFiltros).toHaveBeenCalledWith(
      "filtrar_por_ativo",
      "True",
    );
  });

  it("deve chamar handleChangeFiltros ao alterar a categoria", () => {
    render(<Filtros {...defaultProps} />);

    fireEvent.change(screen.getByTestId("filtrar_por_categoria"), {
      target: {
        value: "2",
      },
    });

    expect(defaultProps.handleChangeFiltros).toHaveBeenCalledWith(
      "filtrar_por_categoria",
      "2",
    );
  });

  it("deve chamar limpaFiltros ao clicar em Limpar", () => {
    render(<Filtros {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /Limpar/i }));

    expect(defaultProps.limpaFiltros).toHaveBeenCalledTimes(1);
  });

  it("deve chamar handleSubmitFiltros ao clicar em Filtrar", () => {
    render(<Filtros {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /Filtrar/i }));

    expect(defaultProps.handleSubmitFiltros).toHaveBeenCalledTimes(1);
  });

  it("deve renderizar as categorias recebidas", () => {
    render(<Filtros {...defaultProps} />);

    expect(screen.getByText("Categoria 1")).toBeInTheDocument();
    expect(screen.getByText("Categoria 2")).toBeInTheDocument();
  });

  it("não deve renderizar categorias quando categoriaTabela estiver vazia", () => {
    render(<Filtros {...defaultProps} categoriaTabela={[]} />);

    expect(screen.queryByText("Categoria 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Categoria 2")).not.toBeInTheDocument();
  });
});
