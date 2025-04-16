import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Filtros } from "../components/Filtros";
import {MandatosContext} from "../context/Mandatos";


describe("Filtros Componentes", () => {
    const mockSetFilter = jest.fn();
    const mockSetCurrentPage = jest.fn();
    const mockSetFirstPage = jest.fn();
    const mockInitialFilter = {
        referencia: ""
    };

    const renderComponent = () => {
        return render(
            <MandatosContext.Provider value={{
                setFilter: mockSetFilter,
                setCurrentPage: mockSetCurrentPage,
                setFirstPage: mockSetFirstPage,
                initialFilter: mockInitialFilter
            }}>
                <Filtros />
            </MandatosContext.Provider>
        );
    };

    test("testa a renderização dos filtros", () => {
        renderComponent();
        const descricaoInput = screen.getByLabelText(/Pesquisar/i);
        expect(descricaoInput).toBeInTheDocument()

    });

    test("testa OnChange dos campos", () => {
        renderComponent();
        const descricaoInput = screen.getByLabelText(/Pesquisar/i);
        fireEvent.change(descricaoInput, { target: { value: "Teste" } });
        expect(descricaoInput.value).toBe("Teste");
    });

    test("teste a chamada do filtro e limpeza de filtros", () => {
        renderComponent();
        const filtrarBtn = screen.getByRole("button", { name: "Pesquisar"});
        fireEvent.click(filtrarBtn);

        expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
        expect(mockSetFirstPage).toHaveBeenCalledWith(0);
        expect(mockSetFilter).toHaveBeenCalledWith(mockInitialFilter);

        const limparBtn = screen.getByRole("button", { name: "Limpar"});
        fireEvent.click(limparBtn);

        expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
        expect(mockSetFirstPage).toHaveBeenCalledWith(0);
        expect(mockSetFilter).toHaveBeenCalledWith(mockInitialFilter);
    });

});
