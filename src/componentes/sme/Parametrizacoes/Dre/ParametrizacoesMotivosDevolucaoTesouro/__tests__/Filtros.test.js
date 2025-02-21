import { render, screen, fireEvent } from "@testing-library/react";
import { Filtros } from "../components/Filtros"; // Supondo que o componente esteja no mesmo diretório
import { MotivosDevolucaoTesouroContext } from "../context/MotivosDevolucaoTesouro";
import { mockData } from "../__fixtures__/mockData"; // Mock com dados de exemplo
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
            <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
                <Filtros />
            </MotivosDevolucaoTesouroContext.Provider>
        );

        expect(screen.getByText("Filtrar")).toBeInTheDocument();
        expect(screen.getByText("Limpar")).toBeInTheDocument();
        expect(screen.getByLabelText("Filtrar por motivo de devolução ao tesouro")).toBeInTheDocument();
    });

    test("Deve alterar o valor do filtro ao digitar no campo de busca", () => {
        render(
            <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
                <Filtros />
            </MotivosDevolucaoTesouroContext.Provider>
        );

        const inputFilter = screen.getByLabelText("Filtrar por motivo de devolução ao tesouro");

        fireEvent.change(inputFilter, { target: { value: "Pagamento antecipado" } });

        expect(inputFilter.value).toBe("Pagamento antecipado");
    });

    test("Deve chamar o setFilter e resetar a página ao submeter o formulário", () => {
        render(
            <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
                <Filtros />
            </MotivosDevolucaoTesouroContext.Provider>
        );

        const inputFilter = screen.getByLabelText("Filtrar por motivo de devolução ao tesouro");
        const submitButton = screen.getByText("Filtrar");

        fireEvent.change(inputFilter, { target: { value: "Pagamento antecipado" } });
        fireEvent.click(submitButton);

        expect(mockContextValue.setCurrentPage).toHaveBeenCalledWith(1);
        expect(mockContextValue.setFirstPage).toHaveBeenCalledWith(0);
        expect(mockContextValue.setFilter).toHaveBeenCalledWith({ nome: "Pagamento antecipado" });
    });

    test("Deve limpar o filtro e resetar as páginas ao clicar no botão Limpar", () => {
        render(
            <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
                <Filtros />
            </MotivosDevolucaoTesouroContext.Provider>
        );

        const inputFilter = screen.getByLabelText("Filtrar por motivo de devolução ao tesouro");
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
            <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
                <Filtros />
            </MotivosDevolucaoTesouroContext.Provider>
        );

        const inputFilter = screen.getByLabelText("Filtrar por motivo de devolução ao tesouro");

        expect(inputFilter.value).toBe("");
    });
});
