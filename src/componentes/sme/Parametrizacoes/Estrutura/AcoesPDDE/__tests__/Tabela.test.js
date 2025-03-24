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
        expect(screen.getByText("Ações PDDE")).toBeInTheDocument();
        expect(screen.getByText("Categoria")).toBeInTheDocument();
        expect(screen.getByText("Aceita capital?")).toBeInTheDocument();
        expect(screen.getByText("Aceita custeio?")).toBeInTheDocument();
        expect(screen.getByText("Aceita livre aplicação?")).toBeInTheDocument();
        expect(screen.getByText("Ações")).toBeInTheDocument();
    });

    it("deve chamar handleOpenModalForm ao clicar no botão de ação editar", () => {
        render(<Tabela rowsPerPage={5} data={mockData} handleOpenModalForm={mockHandleOpenModalForm} />);

        const actionButton = screen.getAllByRole("button", { selector: '.btn-editar-membro' });
        fireEvent.click(actionButton[0]);

        expect(mockHandleOpenModalForm).toHaveBeenCalledWith(mockData.results[0]);
    });
});
