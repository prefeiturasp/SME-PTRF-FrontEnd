import React from "react";
import { render } from "@testing-library/react";

jest.mock("primereact/paginator", () => ({
  Paginator: ({ first, rows, totalRecords, onPageChange }) => (
    <div data-testid="paginator" data-first={first} data-rows={rows} data-total={totalRecords}>
      Paginator - Página {Math.floor(first / rows) + 1}
    </div>
  )
}));

jest.mock("../hooks/useDetalhesTiposCreditoContext", () => ({
  useDetalhesTiposCreditoContext: jest.fn()
}));

describe("Paginacao", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar paginação com dados", () => {
    const mockContext = {
      filter: { page: 1 },
      setFilter: jest.fn()
    };

    require("../hooks/useDetalhesTiposCreditoContext").useDetalhesTiposCreditoContext.mockReturnValue(mockContext);

    const { Paginacao } = require("../components/Paginacao");
    const { container } = render(<Paginacao isLoading={false} count={50} total={50} />);
    expect(container).toBeInTheDocument();
  });

  it("deve não renderizar paginação quando isLoading é true", () => {
    const mockContext = {
      filter: { page: 1 },
      setFilter: jest.fn()
    };

    require("../hooks/useDetalhesTiposCreditoContext").useDetalhesTiposCreditoContext.mockReturnValue(mockContext);

    const { Paginacao } = require("../components/Paginacao");
    const { container } = render(<Paginacao isLoading={true} count={50} total={50} />);
    expect(container.querySelector('[data-testid="paginator"]')).not.toBeInTheDocument();
  });

  it("deve não renderizar paginação quando total é zero", () => {
    const mockContext = {
      filter: { page: 1 },
      setFilter: jest.fn()
    };

    require("../hooks/useDetalhesTiposCreditoContext").useDetalhesTiposCreditoContext.mockReturnValue(mockContext);

    const { Paginacao } = require("../components/Paginacao");
    const { container } = render(<Paginacao isLoading={false} count={0} total={0} />);
    expect(container.querySelector('[data-testid="paginator"]')).not.toBeInTheDocument();
  });

  it("deve renderizar com diferentes números de registros", () => {
    const mockContext = {
      filter: { page: 1 },
      setFilter: jest.fn()
    };

    require("../hooks/useDetalhesTiposCreditoContext").useDetalhesTiposCreditoContext.mockReturnValue(mockContext);

    const { Paginacao } = require("../components/Paginacao");
    const { container } = render(<Paginacao isLoading={false} count={100} total={100} />);
    const paginator = container.querySelector('[data-testid="paginator"]');
    expect(paginator).toBeInTheDocument();
    expect(paginator.getAttribute('data-total')).toBe("100");
  });
});
