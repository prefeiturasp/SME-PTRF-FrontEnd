import { render, screen, fireEvent, configure } from "@testing-library/react";
import { PaginacaoVacancia } from "../PaginacaoVacancia";

configure({ testIdAttribute: 'data-qa' });

jest.mock("primereact/paginator", () => ({
  Paginator: ({
    first,
    totalRecords,
    rows,
    template,
    onPageChange,
    className,
  }) => (
    <div data-qa="paginator" className={className}>
        <span data-qa="first">{first}</span>
        <span data-qa="rows">{rows}</span>
        <span data-qa="total-records">{totalRecords}</span>
        <span data-qa="template">{template}</span>

        <button
            onClick={() =>
                onPageChange({
                    page: 2,
                    first: 2,
                })
            }
        >
            Próxima página
        </button>
    </div>
  ),
}));

describe("PaginacaoVacancia", () => {
    it("deve renderizar o paginator com os valores recebidos", () => {
        render(<PaginacaoVacancia count={5} firstPage={2} onPageChange={jest.fn()} />);

        expect(screen.getByTestId("paginacao-composicao-vacancia")).toBeInTheDocument();
        expect(screen.getByTestId("paginator")).toBeInTheDocument();
        expect(screen.getByTestId("first")).toHaveTextContent("2");
        expect(screen.getByTestId("rows")).toHaveTextContent("1");
        expect(screen.getByTestId("total-records")).toHaveTextContent("5");
        expect(screen.getByTestId("template")).toHaveTextContent("PrevPageLink NextPageLink");
    });

    it("deve chamar onPageChange com a página (1-indexed) e o índice inicial ao trocar de página", () => {
        const onPageChange = jest.fn();

        render(<PaginacaoVacancia count={5} firstPage={0} onPageChange={onPageChange} />);

        fireEvent.click(screen.getByRole("button", { name: /próxima página/i }));

        expect(onPageChange).toHaveBeenCalledTimes(1);
        expect(onPageChange).toHaveBeenCalledWith(3, 2);
    });

    it("deve renderizar corretamente quando não houver marcos", () => {
        render(<PaginacaoVacancia count={0} firstPage={0} onPageChange={jest.fn()} />);

        expect(screen.getByTestId("total-records")).toHaveTextContent("0");
        expect(screen.getByTestId("paginator")).toBeInTheDocument();
    });
});
