import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Tabela from "../Tabela";

jest.mock("../../../../hooks/Globais/useDataTemplate", () => ({
    __esModule: true,
    default: () => (_, __, value) => value,
}));

jest.mock("../../../Globais/UI/Button", () => ({
    EditIconButton: ({ onClick }) => (
        <button data-testid="mock-edit-icon-button" onClick={onClick}>Editar</button>
    ),
}));

describe("Tabela (MandatosVacancia)", () => {
    const handleEditFormModal = jest.fn();

    const lista = [
        { uuid: "mandato-1", referencia_mandato: "2023 a 2025", data_inicial: "2023-01-01", data_final: "2025-12-31" },
        { uuid: "mandato-2", referencia_mandato: "2026 a 2028", data_inicial: "2026-01-01", data_final: "2028-12-31" },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar uma linha por mandato com referência e datas", () => {
        render(<Tabela lista={lista} handleEditFormModal={handleEditFormModal} />);

        expect(screen.getByText("2023 a 2025")).toBeInTheDocument();
        expect(screen.getByText("2026 a 2028")).toBeInTheDocument();
        expect(screen.getByText("2023-01-01")).toBeInTheDocument();
        expect(screen.getByText("2025-12-31")).toBeInTheDocument();
    });

    it("deve chamar handleEditFormModal com o registro correto ao clicar em editar", () => {
        render(<Tabela lista={lista} handleEditFormModal={handleEditFormModal} />);

        const botoesEditar = screen.getAllByTestId("mock-edit-icon-button");
        fireEvent.click(botoesEditar[1]);

        expect(handleEditFormModal).toHaveBeenCalledWith(lista[1]);
    });
});
