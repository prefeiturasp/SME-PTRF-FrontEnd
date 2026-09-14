import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Paginacao } from "../Paginacao";

jest.mock("primereact/paginator", () => ({
    Paginator: ({ first, totalRecords, rows, template, onPageChange }) => (
        <div data-testid="paginator">
            <span data-testid="first">{first}</span>
            <span data-testid="rows">{rows}</span>
            <span data-testid="total-records">{totalRecords}</span>
            <span data-testid="template">{template}</span>
            <button onClick={() => onPageChange({ page: 1, first: 10 })}>Próxima página</button>
        </div>
    ),
}));

describe("Paginacao (MandatosVacancia)", () => {
    const onPageChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar o paginador com os valores recebidos (10 registros por página)", () => {
        const { container } = render(<Paginacao count={25} firstPage={0} onPageChange={onPageChange} />);

        expect(container.querySelector('[data-qa="paginacao-mandato-vacancia"]')).toBeInTheDocument();
        expect(screen.getByTestId("first")).toHaveTextContent("0");
        expect(screen.getByTestId("rows")).toHaveTextContent("10");
        expect(screen.getByTestId("total-records")).toHaveTextContent("25");
        expect(screen.getByTestId("template")).toHaveTextContent("PrevPageLink PageLinks NextPageLink");
    });

    it("deve chamar onPageChange com a página (1-indexed) e o índice inicial ao trocar de página", () => {
        render(<Paginacao count={25} firstPage={0} onPageChange={onPageChange} />);

        fireEvent.click(screen.getByRole("button", { name: /próxima página/i }));

        expect(onPageChange).toHaveBeenCalledWith(2, 10);
    });

    it("não deve renderizar quando há uma página ou menos (count <= 10)", () => {
        const { container: c1 } = render(<Paginacao count={10} firstPage={0} onPageChange={onPageChange} />);
        expect(c1.querySelector('[data-qa="paginacao-mandato-vacancia"]')).not.toBeInTheDocument();

        const { container: c2 } = render(<Paginacao count={0} firstPage={0} onPageChange={onPageChange} />);
        expect(c2.querySelector('[data-qa="paginacao-mandato-vacancia"]')).not.toBeInTheDocument();
    });
});
