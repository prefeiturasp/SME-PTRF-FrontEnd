import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Filtros } from "../Filtros";
import { categoriasPDDE } from "../__fixtures__/mockData";


describe("Filtros Componentes", () => {
    const mockSetFilter = jest.fn();
    const mockLimpaFiltros = jest.fn();
    const mockHandleSubmitFiltros = jest.fn();
    const categorias = categoriasPDDE;
    const mockInitialFilter = { filtrar_por_nome: "", filtrar_por_categoria: "" };

    const renderComponent = () => {
        return render(
            <Filtros
                stateFiltros={mockInitialFilter}
                initialStateFiltros={mockInitialFilter}
                handleSubmitFiltros={mockHandleSubmitFiltros}
                limpaFiltros={mockLimpaFiltros}
                categorias={categorias}
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

        const categoriasInput = screen.getByLabelText(/Filtrar por programa/i);
        expect(categoriasInput).toBeInTheDocument()
        const opcoesCategorias = categoriasInput.querySelectorAll("option");
        expect(opcoesCategorias).toHaveLength(5);


    });

    it("testa OnChange dos campos", () => {
        const nomeInput = screen.getByLabelText(/Filtrar por nome da Ação PDDE/i);
        fireEvent.change(nomeInput, { target: { value: "Acao" } });
        expect(nomeInput.value).toBe("Acao");

        const categoriasInput = screen.getByLabelText(/Filtrar por programa/i);
        fireEvent.change(categoriasInput, { target: { value: "2df33e5d-fbbf-4a4a-ab9a-d5fa49de4db2" } });
        expect(categoriasInput.value).toBe("2df33e5d-fbbf-4a4a-ab9a-d5fa49de4db2");


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
