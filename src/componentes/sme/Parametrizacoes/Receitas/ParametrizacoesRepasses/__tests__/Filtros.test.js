import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Filtros } from "../components/Filtros";
import { RepassesContext } from "../context/Repasse";
import { useGetTabelasRepasse } from "../hooks/useGetTabelasRepasse";
import { mockTabela } from "../__fixtures__/mockData";

jest.mock("../hooks/useGetTabelasRepasse", () => ({
    useGetTabelasRepasse: jest.fn()
}));

describe("Filtros Componentes", () => {
    const mockSetFilter = jest.fn();
    const mockSetCurrentPage = jest.fn();
    const mockSetFirstPage = jest.fn();
    const mockInitialFilter = {
        search: '',
        periodo: '',
        conta: '',
        acao: '',
        status: ''
    };

    const renderComponent = () => {
        return render(
            <RepassesContext.Provider value={{
                setFilter: mockSetFilter,
                setCurrentPage: mockSetCurrentPage,
                setFirstPage: mockSetFirstPage,
                initialFilter: mockInitialFilter
            }}>
                <Filtros />
            </RepassesContext.Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useGetTabelasRepasse.mockReturnValue({ data: mockTabela });
    });

    it("testa a renderização dos filtros", () => {
        renderComponent();

        const descricaoInput = screen.getByLabelText(/Filtrar por associação/i);
        expect(descricaoInput).toBeInTheDocument()

        const periodoInput = screen.getByLabelText(/Filtrar por período/i);
        expect(periodoInput).toBeInTheDocument()
        const opcoesPeriodo = periodoInput.querySelectorAll("option");
        expect(opcoesPeriodo).toHaveLength(5);

        const contaInput = screen.getByLabelText(/Filtrar por conta/i);
        expect(contaInput).toBeInTheDocument()
        const opcoesConta = contaInput.querySelectorAll("option");
        expect(opcoesConta).toHaveLength(10);

        const acaoInput = screen.getByLabelText(/Filtrar por ação/i);
        expect(acaoInput).toBeInTheDocument()
        const opcoesAcao = acaoInput.querySelectorAll("option");
        expect(opcoesAcao).toHaveLength(6);

        const statusInput = screen.getByLabelText(/Filtrar por status/i);
        expect(statusInput).toBeInTheDocument()
        const opcoesStatus = statusInput.querySelectorAll("option");
        expect(opcoesStatus).toHaveLength(3);

    });

    it("testa OnChange dos campos", () => {
        renderComponent();
        const descricaoInput = screen.getByLabelText(/Filtrar por período/i);
        fireEvent.change(descricaoInput, { target: { value: "d9bc43e3-cfd5-4969-bada-af78d96e8faf" } });
        expect(descricaoInput.value).toBe("d9bc43e3-cfd5-4969-bada-af78d96e8faf");

        const tiposCusteioInput = screen.getByLabelText(/Filtrar por conta/i);
        fireEvent.change(tiposCusteioInput, { target: { value: "581af94a-d8dd-466d-9738-2be24655c221" } });
        expect(tiposCusteioInput.value).toBe("581af94a-d8dd-466d-9738-2be24655c221");

        const aplicacaoRecursosInput = screen.getByLabelText(/Filtrar por ação/i);
        fireEvent.change(aplicacaoRecursosInput, { target: { value: "bdcbc8ce-7bab-48b3-959a-f866c6644579" } });
        expect(aplicacaoRecursosInput.value).toBe("bdcbc8ce-7bab-48b3-959a-f866c6644579");

    });

    it("teste a chamada do filtro e limpeza de filtros", () => {
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
