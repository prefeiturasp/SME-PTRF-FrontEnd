import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Paginacao } from "../Paginacao";



describe("Paginacao", () => {
    const mockSetCurrentPage = jest.fn();
    const mockSetFirstPage = jest.fn();
    const acoes = {
        results: [
            {id: 1}
        ],
        count: 21
    };

    const renderComponent = () => {
        return render(
            <Paginacao
                acoes={acoes}
                setCurrentPage={mockSetCurrentPage}
                firstPage={1}
                setFirstPage={mockSetFirstPage}
                isLoading={false}
            />
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        renderComponent();
    });

    it("testa a renderização da paginação", () => {

        fireEvent.click(screen.getByRole("button", {name: "2"}));
        expect(mockSetCurrentPage).toHaveBeenCalledWith(2);

    });
});
