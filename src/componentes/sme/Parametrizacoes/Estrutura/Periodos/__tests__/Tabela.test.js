import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import Tabela from "../Tabela";

describe("Tabela", () => {
    const mockHandleOpenModalForm = jest.fn();
    const mockData = [
        {
            referencia: "2025.1",
            data_prevista_repasse: "2025-01-10",
            data_inicio_realizacao_despesas: "2025-01-15",
            data_fim_realizacao_despesas: "2025-06-30",
            data_inicio_prestacao_contas: "2025-07-01",
            data_fim_prestacao_contas: "2025-12-31",
            editavel: true,
        },
    ];

    const mockDataVisualizacao = [
        {
            referencia: "2025.1",
            data_prevista_repasse: "2025-01-10",
            data_inicio_realizacao_despesas: "2025-01-15",
            data_fim_realizacao_despesas: "2025-06-30",
            data_inicio_prestacao_contas: "2025-07-01",
            data_fim_prestacao_contas: "2025-12-31",
            editavel: false,
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar corretamente o número de períodos", () => {
        render(<Tabela rowsPerPage={5} data={mockData} count={mockData.length} handleOpenModalForm={mockHandleOpenModalForm} />);
        
        expect(screen.getByText((_, element) => element.textContent === `Exibindo ${mockData.length} períodos`)).toBeInTheDocument();
    });

    it("deve exibir os dados corretamente formatados", () => {
        render(<Tabela rowsPerPage={5} data={mockData} count={mockData.length} handleOpenModalForm={mockHandleOpenModalForm} />);

        const headerNames = [
            "Referência",
            "Data prevista do repasse",
            "Início realização de despesas",
            "Fim realização de despesas",
            "Início prestação de contas",
            "Fim prestação de contas",
            "Ações",
        ];

        headerNames.forEach(name => {
            expect(screen.getByRole('columnheader', { name })).toBeInTheDocument();
        });

        expect(screen.getByText("2025.1")).toBeInTheDocument();
    });

    it("deve chamar handleOpenModalForm ao clicar no botão de ação editar", () => {
        render(<Tabela rowsPerPage={5} data={mockData} count={mockData.length} handleOpenModalForm={mockHandleOpenModalForm} />);

        const actionButton = screen.getByRole("button", { name: /editar/i });
        fireEvent.click(actionButton);


        expect(mockHandleOpenModalForm).toHaveBeenCalledWith(mockData[0]);
    });

    it("deve chamar handleOpenModalForm ao clicar no botão de ação visualizar", () => {
        render(<Tabela rowsPerPage={5} data={mockDataVisualizacao} count={mockDataVisualizacao.length} handleOpenModalForm={mockHandleOpenModalForm} />);

        const actionButton = screen.getByRole("button", { name: /visualizar/i });
        fireEvent.click(actionButton);


        expect(mockHandleOpenModalForm).toHaveBeenCalledWith(mockDataVisualizacao[0]);
    });
});
