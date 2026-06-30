import { render, screen, fireEvent, configure } from "@testing-library/react";
import { Paginacao } from "../Paginacao";
import { MembrosDaAssociacaoContext } from "../../context/MembrosDaAssociacao";

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
                    first: 20,
                })
            }
        >
            Próxima página
        </button>
    </div>
  ),
}));

const renderComponent = ({
    count = 15,
    firstPage = 0,
    setCurrentPage = jest.fn(),
    setFirstPage = jest.fn(),
} = {}) => {
    render(
        <MembrosDaAssociacaoContext.Provider
            value={{
                firstPage,
                setCurrentPage,
                setFirstPage,
            }}
        >
        <Paginacao count={count} />
        </MembrosDaAssociacaoContext.Provider>
    );

    return {
        setCurrentPage,
        setFirstPage,
    };
};

describe("Paginacao", () => {
    it("deve renderizar o paginator com os valores recebidos", () => {
        renderComponent({
            count: 32,
            firstPage: 10,
        });

        expect(
            screen.getByTestId("paginacao-composicao")
        ).toBeInTheDocument();

        expect(screen.getByTestId("paginator")).toBeInTheDocument();
        expect(screen.getByTestId("first")).toHaveTextContent("10");
        expect(screen.getByTestId("rows")).toHaveTextContent("1");
        expect(screen.getByTestId("total-records")).toHaveTextContent("32");
        expect(screen.getByTestId("template")).toHaveTextContent(
            "PrevPageLink NextPageLink"
        );
    });

    it("deve utilizar o firstPage vindo do contexto", () => {
        renderComponent({
            firstPage: 25,
        });

        expect(screen.getByTestId("first")).toHaveTextContent("25");
    });

    it("deve atualizar a página e o índice inicial ao trocar de página", () => {
        const { setCurrentPage, setFirstPage } = renderComponent();

        fireEvent.click(
            screen.getByRole("button", {
                name: /próxima página/i,
            })
        );

        expect(setCurrentPage).toHaveBeenCalledTimes(1);
        expect(setCurrentPage).toHaveBeenCalledWith(3);

        expect(setFirstPage).toHaveBeenCalledTimes(1);
        expect(setFirstPage).toHaveBeenCalledWith(20);
    });

    it("deve renderizar corretamente quando não houver registros", () => {
        renderComponent({
            count: 0,
        });

        expect(screen.getByTestId("total-records")).toHaveTextContent("0");
        expect(screen.getByTestId("paginator")).toBeInTheDocument();
    });
});