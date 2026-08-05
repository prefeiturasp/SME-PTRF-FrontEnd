import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Filtros } from "../components/Filtros";
import { AcertosLancamentosContext } from "../context/AcertosLancamentos";

const mockSetFilter = jest.fn();

jest.mock(
  "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext",
  () => ({
    useAbasPorRecursoContext: () => ({
      selectedRecurso: {
        uuid: "uuid-recurso",
      },
    }),
  }),
);

jest.mock("antd", () => {
  const React = require("react");

  const Option = ({ children, value }) => (
    <option value={value}>{children}</option>
  );

  const Select = ({ children, value, onChange, id }) => (
    <select
      data-testid={id}
      value={value}
      onChange={(e) => onChange(e.target.value ? [e.target.value] : [""])}
    >
      {children}
    </select>
  );

  Select.Option = Option;

  return { Select };
});

const renderComponent = (
  filter = {
    filtrar_por_nome: "",
    filtrar_por_categoria: [""],
    filtrar_por_ativo: "",
  },
  tabelas = {
    categorias: [
      {
        id: 1,
        nome: "Categoria 1",
      },
      {
        id: 2,
        nome: "Categoria 2",
      },
    ],
  },
) =>
  render(
    <AcertosLancamentosContext.Provider
      value={{
        filter,
        setFilter: mockSetFilter,
        tabelas,
      }}
    >
      <Filtros />
    </AcertosLancamentosContext.Provider>,
  );

describe("Filtros", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar todos os campos", () => {
    renderComponent();

    expect(screen.getByLabelText(/Filtrar por nome/i)).toBeInTheDocument();
    expect(screen.getByTestId("filtrar_por_categoria")).toBeInTheDocument();
    expect(screen.getByLabelText(/Filtrar por status/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Limpar/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Filtrar/i }),
    ).toBeInTheDocument();
  });

  it("não deve aplicar o filtro ao alterar o nome", () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Filtrar por nome/i), {
      target: {
        value: "Teste",
      },
    });

    expect(screen.getByLabelText(/Filtrar por nome/i)).toHaveValue("Teste");
    expect(mockSetFilter).not.toHaveBeenCalled();
  });

  it("não deve aplicar o filtro ao alterar o status", () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Filtrar por status/i), {
      target: {
        value: "True",
      },
    });

    expect(screen.getByLabelText(/Filtrar por status/i)).toHaveValue("True");
    expect(mockSetFilter).not.toHaveBeenCalled();
  });

  it("não deve aplicar o filtro ao alterar a categoria", () => {
    renderComponent();

    fireEvent.change(screen.getByTestId("filtrar_por_categoria"), {
      target: {
        value: "2",
      },
    });

    expect(mockSetFilter).not.toHaveBeenCalled();
  });

  it("deve aplicar os filtros ao clicar em Filtrar", () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Filtrar por nome/i), {
      target: {
        value: "Teste",
      },
    });

    fireEvent.change(screen.getByLabelText(/Filtrar por status/i), {
      target: {
        value: "True",
      },
    });

    fireEvent.change(screen.getByTestId("filtrar_por_categoria"), {
      target: {
        value: "2",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /Filtrar/i }));

    expect(mockSetFilter).toHaveBeenCalledWith({
      filtrar_por_nome: "Teste",
      filtrar_por_categoria: ["2"],
      filtrar_por_ativo: "True",
      page: 1,
      recurso_uuid: "uuid-recurso",
    });
  });

  it("deve limpar os filtros ao clicar em Limpar", () => {
    renderComponent({
      filtrar_por_nome: "Teste",
      filtrar_por_categoria: ["2"],
      filtrar_por_ativo: "True",
    });

    fireEvent.click(screen.getByRole("button", { name: /Limpar/i }));

    expect(mockSetFilter).toHaveBeenCalledWith({
      filtrar_por_nome: "",
      filtrar_por_categoria: [""],
      filtrar_por_ativo: "",
      page: 1,
      recurso_uuid: "uuid-recurso",
    });

    expect(screen.getByLabelText(/Filtrar por nome/i)).toHaveValue("");
    expect(screen.getByLabelText(/Filtrar por status/i)).toHaveValue("");
  });

  it("deve renderizar as categorias recebidas", () => {
    renderComponent();

    expect(screen.getByText("Categoria 1")).toBeInTheDocument();
    expect(screen.getByText("Categoria 2")).toBeInTheDocument();
  });

  it("não deve renderizar categorias quando a lista estiver vazia", () => {
    renderComponent(
      {
        filtrar_por_nome: "",
        filtrar_por_categoria: [""],
        filtrar_por_ativo: "",
      },
      {
        categorias: [],
      },
    );

    expect(screen.queryByText("Categoria 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Categoria 2")).not.toBeInTheDocument();
  });

  it("deve renderizar os valores vindos do contexto", () => {
    renderComponent({
      filtrar_por_nome: "Nome inicial",
      filtrar_por_categoria: ["2"],
      filtrar_por_ativo: "False",
    });

    expect(screen.getByLabelText(/Filtrar por nome/i)).toHaveValue(
      "Nome inicial",
    );

    expect(screen.getByLabelText(/Filtrar por status/i)).toHaveValue(
      "False",
    );
  });
});