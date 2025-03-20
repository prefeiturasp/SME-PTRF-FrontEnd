import { render, screen, fireEvent } from "@testing-library/react";
import { Filtros } from "../components/Filtros";
import { MotivosRejeicaoContext } from "../context/MotivosRejeicao";
import React from "react";

// Mock do contexto
const mockContextValue = {
    setFilter: jest.fn(),
    initialFilter: { nome: "" },
    setCurrentPage: jest.fn(),
    setFirstPage: jest.fn(),
};

describe("Filtros Component", () => {

    test("Deve renderizar corretamente o componente Filtros", () => {
        render(
            <MotivosRejeicaoContext.Provider value={mockContextValue}>
                <Filtros />
            </MotivosRejeicaoContext.Provider>
        );

        expect(screen.getByText("Pesquisar", {selector: '.btn-success'})).toBeInTheDocument();
        expect(screen.getByText("Limpar")).toBeInTheDocument();
        expect(screen.getByLabelText("Pesquisar")).toBeInTheDocument();
    });

    test("Deve alterar o valor do filtro ao digitar no campo de busca", () => {
        render(
            <MotivosRejeicaoContext.Provider value={mockContextValue}>
                <Filtros />
            </MotivosRejeicaoContext.Provider>
        );

        const inputFilter = screen.getByLabelText("Pesquisar");

        fireEvent.change(inputFilter, { target: { value: "Pagamento antecipado" } });

        expect(inputFilter.value).toBe("Pagamento antecipado");
    });

    test("Deve chamar o setFilter e resetar a página ao submeter o formulário", () => {
        render(
            <MotivosRejeicaoContext.Provider value={mockContextValue}>
                <Filtros />
            </MotivosRejeicaoContext.Provider>
        );

        const inputFilter = screen.getByLabelText("Pesquisar");
        const submitButton = screen.getByText("Pesquisar", { selector: '.btn-success'});

        fireEvent.change(inputFilter, { target: { value: "Pagamento antecipado" } });
        fireEvent.click(submitButton);

        expect(mockContextValue.setCurrentPage).toHaveBeenCalledWith(1);
        expect(mockContextValue.setFirstPage).toHaveBeenCalledWith(0);
        expect(mockContextValue.setFilter).toHaveBeenCalledWith({ nome: "Pagamento antecipado" });
    });

    test("Deve limpar o filtro e resetar as páginas ao clicar no botão Limpar", () => {
        render(
            <MotivosRejeicaoContext.Provider value={mockContextValue}>
                <Filtros />
            </MotivosRejeicaoContext.Provider>
        );

        const inputFilter = screen.getByLabelText("Pesquisar");
        const clearButton = screen.getByText("Limpar");

        fireEvent.change(inputFilter, { target: { value: "Pagamento antecipado" } });
        fireEvent.click(clearButton);

        expect(mockContextValue.setCurrentPage).toHaveBeenCalledWith(1);
        expect(mockContextValue.setFirstPage).toHaveBeenCalledWith(0);
        expect(mockContextValue.setFilter).toHaveBeenCalledWith({ nome: "" });
        expect(inputFilter.value).toBe("");
    });

    test("Deve renderizar o filtro com valor inicial correto", () => {
        render(
            <MotivosRejeicaoContext.Provider value={mockContextValue}>
                <Filtros />
            </MotivosRejeicaoContext.Provider>
        );

        const inputFilter = screen.getByLabelText("Pesquisar");

        expect(inputFilter.value).toBe("");
    });
});
