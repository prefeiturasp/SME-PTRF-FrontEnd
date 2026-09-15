import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";

import {Paginacao} from "../components/Paginacao";
import {useGetRepasses} from "../hooks/useGetRepasses";
import {RepassesContext} from "../context/Repasse";

jest.mock("../hooks/useGetRepasses", () => ({
    useGetRepasses: jest.fn(),
}));

jest.mock("primereact/paginator", () => ({
    Paginator: ({first, rows, totalRecords, onPageChange}) => (
        <div data-testid="paginator">
            <span data-testid="first">{first}</span>
            <span data-testid="rows">{rows}</span>
            <span data-testid="total-records">{totalRecords}</span>
            <button
                type="button"
                onClick={() =>
                    onPageChange({
                        page: 1,
                        first: 10,
                    })
                }
            >
                Próxima página
            </button>
        </div>
    ),
}));

describe("Paginacao", () => {
    const mockSetCurrentPage = jest.fn();
    const mockSetFirstPage = jest.fn();

    const renderComponent = ({
        isLoading = false,
        data = {
            count: 25,
            results: [{uuid: "repasse-1"}],
        },
        firstPage = 0,
    } = {}) => {
        useGetRepasses.mockReturnValue({
            isLoading,
            data,
        });

        return render(
            <RepassesContext.Provider
                value={{
                    setCurrentPage: mockSetCurrentPage,
                    firstPage,
                    setFirstPage: mockSetFirstPage,
                }}
            >
                <Paginacao />
            </RepassesContext.Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("renderização", () => {
        it("deve exibir a paginação quando houver resultados", () => {
            renderComponent();

            expect(screen.getByTestId("paginator")).toBeInTheDocument();
        });

        it("não deve exibir a paginação enquanto estiver carregando", () => {
            renderComponent({
                isLoading: true,
            });

            expect(
                screen.queryByTestId("paginator")
            ).not.toBeInTheDocument();
        });

        it("não deve exibir a paginação quando não houver resultados", () => {
            renderComponent({
                data: {
                    count: 0,
                    results: [],
                },
            });

            expect(
                screen.queryByTestId("paginator")
            ).not.toBeInTheDocument();
        });

        it("não deve exibir a paginação quando results não existir", () => {
            renderComponent({
                data: {
                    count: 0,
                },
            });

            expect(
                screen.queryByTestId("paginator")
            ).not.toBeInTheDocument();
        });
    });

    describe("configuração da paginação", () => {
        it("deve utilizar a primeira página informada pelo contexto", () => {
            renderComponent({
                firstPage: 20,
            });

            expect(screen.getByTestId("first")).toHaveTextContent("20");
        });

        it("deve configurar 10 registros por página", () => {
            renderComponent();

            expect(screen.getByTestId("rows")).toHaveTextContent("10");
        });

        it("deve utilizar a quantidade total de registros", () => {
            renderComponent({
                data: {
                    count: 37,
                    results: [{uuid: "repasse-1"}],
                },
            });

            expect(screen.getByTestId("total-records")).toHaveTextContent("37");
        });
    });

    describe("mudança de página", () => {
        it("deve atualizar a página atual ao mudar de página", () => {
            renderComponent();

            fireEvent.click(
                screen.getByRole("button", {name: "Próxima página"})
            );

            expect(mockSetCurrentPage).toHaveBeenCalledWith(2);
        });

        it("deve atualizar a posição da primeira página ao mudar de página", () => {
            renderComponent();

            fireEvent.click(
                screen.getByRole("button", {name: "Próxima página"})
            );

            expect(mockSetFirstPage).toHaveBeenCalledWith(10);
        });
    });
});