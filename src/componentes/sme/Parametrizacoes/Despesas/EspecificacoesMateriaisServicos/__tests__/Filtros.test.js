import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Filtros } from "../components/Filtros";
import { MateriaisServicosContext } from "../context/MateriaisServicos";
import { useGetTabelas } from "../hooks/useGetTabelas";
import { dadosTabelas } from "../__fixtures__/mockData";

jest.mock("../hooks/useGetTabelas", () => ({
    useGetTabelas: jest.fn()
}));

describe("Filtros Componentes", () => {
    const mockSetFilter = jest.fn();
    const mockSetCurrentPage = jest.fn();
    const mockSetFirstPage = jest.fn();
    const mockInitialFilter = {
        descricao: "",
        aplicacao_recurso: "",
        tipo_custeio: "",
        ativa: ""
    };

    const renderComponent = () => {
        return render(
            <MateriaisServicosContext.Provider value={{
                setFilter: mockSetFilter,
                setCurrentPage: mockSetCurrentPage,
                setFirstPage: mockSetFirstPage,
                initialFilter: mockInitialFilter
            }}>
                <Filtros />
            </MateriaisServicosContext.Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useGetTabelas.mockReturnValue({ data: dadosTabelas });
    });

    test("testa a renderização dos filtros", () => {
        renderComponent();
        expect(screen.getByLabelText(/Filtrar por descrição/i)).toBeInTheDocument();

        const descricaoInput = screen.getByLabelText(/Filtrar por descrição/i);
        expect(descricaoInput).toBeInTheDocument()

        const tiposCusteioInput = screen.getByLabelText(/Filtrar por tipo de custeio/i);
        expect(tiposCusteioInput).toBeInTheDocument()
        const opcoesCusteio = tiposCusteioInput.querySelectorAll("option");
        expect(opcoesCusteio).toHaveLength(4);

        const aplicacaoRecursosInput = screen.getByLabelText(/Filtrar por tipo de aplicação/i);
        expect(aplicacaoRecursosInput).toBeInTheDocument()
        const opcoesAplicacao = aplicacaoRecursosInput.querySelectorAll("option");
        expect(opcoesAplicacao).toHaveLength(3);

        const statusInput = screen.getByLabelText(/Está ativa?/i);
        expect(statusInput).toBeInTheDocument()
        const opcoesStatus = statusInput.querySelectorAll("option");
        expect(opcoesStatus).toHaveLength(3);
    });

    test("testa OnChange dos campos", () => {
        renderComponent();
        const descricaoInput = screen.getByLabelText(/Filtrar por descrição/i);
        fireEvent.change(descricaoInput, { target: { value: "Teste" } });
        expect(descricaoInput.value).toBe("Teste");

        const tiposCusteioInput = screen.getByLabelText(/Filtrar por tipo de custeio/i);
        fireEvent.change(tiposCusteioInput, { target: { value: "1" } });
        expect(tiposCusteioInput.value).toBe("1");

        const aplicacaoRecursosInput = screen.getByLabelText(/Filtrar por tipo de aplicação/i);
        fireEvent.change(aplicacaoRecursosInput, { target: { value: "CUSTEIO" } });
        expect(aplicacaoRecursosInput.value).toBe("CUSTEIO");

        const statusInput = screen.getByLabelText("Está ativa?");
        fireEvent.change(statusInput, { target: { value: "1" } });
        expect(statusInput.value).toBe("1");
    });

    test("teste a chamada do filtro e limpeza de filtros", () => {
        renderComponent();
        const filtrarBtn = screen.getByRole("button", { name: "Filtrar"});
        fireEvent.click(filtrarBtn);

        expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
        expect(mockSetFirstPage).toHaveBeenCalledWith(0);
        expect(mockSetFilter).toHaveBeenCalledWith(mockInitialFilter);

        const limparBtn = screen.getByRole("button", { name: "Limpar"});
        fireEvent.click(limparBtn);

        expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
        expect(mockSetFirstPage).toHaveBeenCalledWith(0);
        expect(mockSetFilter).toHaveBeenCalledWith(mockInitialFilter);
    });

});
