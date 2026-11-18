import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Paginacao } from "../Paginacao";

describe("Paginacao de Programas", () => {
    const mockSetCurrentPage = jest.fn();
    const mockSetFirstPage = jest.fn();
    const programas = { results: [{id: 1}], count: 45 };

    beforeEach(() => jest.clearAllMocks());

    it("deve trocar de página", () => {
        render(
            <Paginacao programas={programas} rowsPerPage={20} setCurrentPage={mockSetCurrentPage}
                       firstPage={0} setFirstPage={mockSetFirstPage} isLoading={false}/>
        );

        fireEvent.click(screen.getByText("2"));
        expect(mockSetCurrentPage).toHaveBeenCalledWith(2);
        expect(mockSetFirstPage).toHaveBeenCalledWith(20);
    });

    it("não deve renderizar sem resultados ou carregando", () => {
        const { container, rerender } = render(
            <Paginacao programas={{results: [], count: 0}} rowsPerPage={20} setCurrentPage={mockSetCurrentPage}
                       firstPage={0} setFirstPage={mockSetFirstPage} isLoading={false}/>
        );
        expect(container).toBeEmptyDOMElement();

        rerender(
            <Paginacao programas={programas} rowsPerPage={20} setCurrentPage={mockSetCurrentPage}
                       firstPage={0} setFirstPage={mockSetFirstPage} isLoading={true}/>
        );
        expect(container).toBeEmptyDOMElement();
    });
});
