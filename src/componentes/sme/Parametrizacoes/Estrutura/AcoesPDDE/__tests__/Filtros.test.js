import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Filtros } from "../Filtros";
import { programasPDDE } from "../__fixtures__/mockData";


describe("Filtros Componentes", () => {
    const mockSetFilter = jest.fn();
    const mockLimpaFiltros = jest.fn();
    const mockHandleSubmitFiltros = jest.fn();
    const programas = programasPDDE;
    const mockInitialFilter = { filtrar_por_nome: "", filtrar_por_programa: "" };

    const renderComponent = () => {
        return render(
            <Filtros
                stateFiltros={mockInitialFilter}
                initialStateFiltros={mockInitialFilter}
                handleSubmitFiltros={mockHandleSubmitFiltros}
                limpaFiltros={mockLimpaFiltros}
                programas={programas}
            />
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        renderComponent();
    });

    it("testa a renderização dos filtros", () => {

        const nomeInput = screen.getByLabelText(/Filtrar por nome da Ação PDDE/i);
        expect(nomeInput).toBeInTheDocument()

        const programasInput = screen.getByLabelText(/Filtrar por programa/i);
        expect(programasInput).toBeInTheDocument()
        const opcoesProgramas = programasInput.querySelectorAll("option");
        expect(opcoesProgramas).toHaveLength(5);


    });

    it("testa OnChange dos campos", () => {
        const nomeInput = screen.getByLabelText(/Filtrar por nome da Ação PDDE/i);
        fireEvent.change(nomeInput, { target: { value: "Acao" } });
        expect(nomeInput.value).toBe("Acao");

        const programasInput = screen.getByLabelText(/Filtrar por programa/i);
        fireEvent.change(programasInput, { target: { value: "2df33e5d-fbbf-4a4a-ab9a-d5fa49de4db2" } });
        expect(programasInput.value).toBe("2df33e5d-fbbf-4a4a-ab9a-d5fa49de4db2");


    });

    it("teste a chamada do filtro e limpeza de filtros", () => {
        const filtrarBtn = screen.getByRole("button", { name: "Filtrar"});
        fireEvent.click(filtrarBtn);
        expect(mockHandleSubmitFiltros).toHaveBeenCalledTimes(1)

        const limparBtn = screen.getByRole("button", { name: "Limpar"});
        fireEvent.click(limparBtn);
        expect(mockLimpaFiltros).toHaveBeenCalledTimes(1);
    });

});
