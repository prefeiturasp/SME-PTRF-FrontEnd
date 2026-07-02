import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Paginacao } from "../components/Paginacao";
import { useContasDasAssociacoesContext } from "../hooks/useContasDasAssociacoesContext";

jest.mock("../hooks/useContasDasAssociacoesContext");

jest.mock("primereact/paginator", () => ({
  Paginator: ({ first, rows, totalRecords, onPageChange }) => (
    <button
      data-testid="paginator"
      data-first={first}
      data-rows={rows}
      data-total={totalRecords}
      onClick={() => onPageChange({ page: 2 })}
    >
      paginar
    </button>
  ),
}));

describe("Paginacao", () => {
  const setFilter = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useContasDasAssociacoesContext.mockReturnValue({
      setFilter,
      filter: { page: 2, page_size: 10 },
    });
  });

  it("renderiza paginator e altera página", () => {
    render(<Paginacao isLoading={false} total={35} />);

    const paginator = screen.getByTestId("paginator");
    expect(paginator).toHaveAttribute("data-first", "10");
    expect(paginator).toHaveAttribute("data-rows", "10");
    expect(paginator).toHaveAttribute("data-total", "35");

    fireEvent.click(paginator);

    const updater = setFilter.mock.calls[0][0];
    expect(updater({ page: 2, page_size: 10, status: "ATIVA" })).toEqual({
      page: 3,
      page_size: 10,
      status: "ATIVA",
    });
  });

  it("não renderiza durante loading", () => {
    render(<Paginacao isLoading total={35} />);

    expect(screen.queryByTestId("paginator")).not.toBeInTheDocument();
  });
});
