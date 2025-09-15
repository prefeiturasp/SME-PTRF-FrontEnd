import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import Tabela from "../Tabela";
import { acoesPDDE } from "../__fixtures__/mockData";

describe("Tabela", () => {
    const mockHandleOpenModalForm = jest.fn();
    const mockData = acoesPDDE;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar corretamente o número de ações pdde", () => {
        render(<Tabela rowsPerPage={5} data={mockData} handleOpenModalForm={mockHandleOpenModalForm} />);
        
        expect(screen.getByText((_, element) => element.textContent === `Exibindo ${mockData.results.length} Ações`)).toBeInTheDocument();
    });

    it("deve exibir os dados corretamente formatados", () => {
        render(<Tabela rowsPerPage={5} data={mockData} handleOpenModalForm={mockHandleOpenModalForm} />);
        expect(screen.getAllByText("Ação PDDE").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Programa").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Aceita capital?").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Aceita custeio?").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Aceita livre aplicação?").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Ações").length).toBeGreaterThan(0);
    });

    it("deve chamar handleOpenModalForm ao clicar no botão de ação editar", () => {
        render(<Tabela rowsPerPage={5} data={mockData} handleOpenModalForm={mockHandleOpenModalForm} />);

        const actionButton = screen.getAllByRole("button", { selector: '.btn-editar-membro' });
        fireEvent.click(actionButton[0]);

        expect(mockHandleOpenModalForm).toHaveBeenCalledWith(mockData.results[0]);
    });
});
