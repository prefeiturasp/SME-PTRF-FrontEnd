import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import Tabela from "../Tabela";
import { programasPDDE } from "../__fixtures__/mockData";

describe("Tabela de Programas", () => {
    const mockHandleOpenModalForm = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        render(<Tabela data={programasPDDE} handleOpenModalForm={mockHandleOpenModalForm} />);
    });

    it("deve exibir o total e as colunas", () => {
        expect(screen.getByText((_, el) => el.textContent === `Exibindo ${programasPDDE.count} Programas`)).toBeInTheDocument();
        expect(screen.getAllByText("Programa").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Ações").length).toBeGreaterThan(0);
    });

    it("deve listar os programas", () => {
        programasPDDE.results.forEach((programa) => {
            expect(screen.getByText(programa.nome)).toBeInTheDocument();
        });
    });

    it("deve abrir a edição do programa ao clicar em editar", () => {
        const botoes = screen.getAllByRole("button");
        fireEvent.click(botoes[2]);

        expect(mockHandleOpenModalForm).toHaveBeenCalledWith(programasPDDE.results[2]);
    });
});
