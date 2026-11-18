import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Filtros } from "../Filtros";

describe("Filtros de Programas", () => {
    const mockHandleSubmitFiltros = jest.fn();
    const mockLimpaFiltros = jest.fn();
    const initialStateFiltros = { filtrar_por_nome: "" };

    beforeEach(() => {
        jest.clearAllMocks();
        render(
            <Filtros
                stateFiltros={initialStateFiltros}
                initialStateFiltros={initialStateFiltros}
                handleSubmitFiltros={mockHandleSubmitFiltros}
                limpaFiltros={mockLimpaFiltros}
            />
        );
    });

    it("deve renderizar apenas o filtro por nome do programa", () => {
        expect(screen.getByLabelText("Filtrar por nome do programa")).toBeInTheDocument();
        expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    });

    it("deve filtrar pelo nome digitado", () => {
        fireEvent.change(screen.getByLabelText("Filtrar por nome do programa"), { target: { value: "Quali" } });
        fireEvent.click(screen.getByRole("button", { name: "Filtrar" }));

        expect(mockHandleSubmitFiltros).toHaveBeenCalledWith({ filtrar_por_nome: "Quali" });
    });

    it("deve limpar o filtro", () => {
        const input = screen.getByLabelText("Filtrar por nome do programa");
        fireEvent.change(input, { target: { value: "Quali" } });
        fireEvent.click(screen.getByRole("button", { name: "Limpar" }));

        expect(mockLimpaFiltros).toHaveBeenCalledTimes(1);
        expect(input.value).toBe("");
    });
});
