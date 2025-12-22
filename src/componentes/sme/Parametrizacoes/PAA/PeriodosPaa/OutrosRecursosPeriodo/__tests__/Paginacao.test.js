import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Paginacao } from "../Paginacao";
import { useGetOutrosRecursos } from "../hooks/useGet";
import { OutrosRecursosPeriodosPaaContext } from "../context/index";

jest.mock("../hooks/useGet", () => ({
  useGetOutrosRecursos: jest.fn(),
}));

jest.mock("antd", () => ({
  Spin: ({ spinning, children }) => (
    <div data-testid="spin" data-spinning={spinning}>
      {children}
    </div>
  ),
}));

jest.mock("primereact/paginator", () => ({
  Paginator: ({ onPageChange }) => (
    <button
      data-testid="paginator"
      onClick={() =>
        onPageChange({
          page: 1,
          first: 10,
        })
      }
    >
      paginator
    </button>
  ),
}));

const setCurrentPage = jest.fn();
const setFirstPage = jest.fn();

const renderWithContext = ({
  count = 0,
  isLoading = false,
  rowsPerPage = 10,
} = {}) => {
  return {
    setCurrentPage,
    setFirstPage,
    ...render(
      <OutrosRecursosPeriodosPaaContext.Provider
        value={{
          setCurrentPage,
          setFirstPage,
          firstPage: 0,
          rowsPerPage,
        }}
      >
        <Paginacao />
      </OutrosRecursosPeriodosPaaContext.Provider>
    ),
  };
};

describe("Paginacao", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("não renderiza nada quando rowsPerPage >= count", () => {
    useGetOutrosRecursos.mockReturnValue({
      isLoading: false,
      data: { count: 10, results: [] },
    });

    const { container } = renderWithContext();

    expect(container).toBeEmptyDOMElement();
  });

  it("renderiza Paginator quando rowsPerPage < count", () => {
    useGetOutrosRecursos.mockReturnValue({
      isLoading: false,
      data: { count: 50 },
    });

    renderWithContext();

    expect(screen.getByTestId("paginator")).toBeInTheDocument();
  });

  it("passa corretamente o estado de loading para o Spin", () => {
    useGetOutrosRecursos.mockReturnValue({
      isLoading: true,
      data: { count: 50 },
    });

    renderWithContext();

    expect(screen.getByTestId("spin")).toHaveAttribute(
      "data-spinning",
      "true"
    );
  });

  it("ao trocar a página chama setCurrentPage e setFirstPage corretamente", () => {
    useGetOutrosRecursos.mockReturnValue({
      isLoading: false,
      data: { count: 50 },
    });

    renderWithContext();

    fireEvent.click(screen.getByTestId("paginator"));

    expect(setCurrentPage).toHaveBeenCalledWith(2); // page + 1
    expect(setFirstPage).toHaveBeenCalledWith(10);
  });
});
