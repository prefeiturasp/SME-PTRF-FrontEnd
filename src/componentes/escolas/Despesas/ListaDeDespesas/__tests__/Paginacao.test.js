import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Paginacao } from "../Paginacao";

jest.mock("react-ultimate-pagination-bootstrap-4", () => ({
    __esModule: true,
    default: ({ currentPage, totalPages, onChange }) => (
        <div data-testid="ultimate-pagination">
            <span>Current Page: {currentPage}</span>
            <span>Total Pages: {totalPages}</span>
            <button onClick={() => onChange(2)}>Go to page 2</button>
            <button onClick={() => onChange(3)}>Go to page 3</button>
        </div>
    )
}));

describe("Paginacao", () => {
    let mockProps;

    beforeEach(() => {
        mockProps = {
            paginacaoPaginasTotal: 5,
            buscaDespesasPaginacao: jest.fn(),
            forcarPrimeiraPagina: "",
            buscaUtilizandoOrdenacao: false,
            buscaDespesasOrdenacaoPaginacao: jest.fn()
        };
    });

    it("renderiza o componente de paginação", () => {
        render(<Paginacao {...mockProps} />);
        
        expect(screen.getByTestId("ultimate-pagination")).toBeInTheDocument();
        expect(screen.getByText("Current Page: 1")).toBeInTheDocument();
        expect(screen.getByText("Total Pages: 5")).toBeInTheDocument();
    });

    it("chama buscaDespesasPaginacao ao mudar de página sem ordenação", () => {
        render(<Paginacao {...mockProps} />);
        
        const btn = screen.getByText("Go to page 2");
        fireEvent.click(btn);
        
        expect(mockProps.buscaDespesasPaginacao).toHaveBeenCalledWith(2);
        expect(mockProps.buscaDespesasOrdenacaoPaginacao).not.toHaveBeenCalled();
    });

    it("chama buscaDespesasOrdenacaoPaginacao ao mudar de página com ordenação", () => {
        mockProps.buscaUtilizandoOrdenacao = true;
        render(<Paginacao {...mockProps} />);
        
        const btn = screen.getByText("Go to page 3");
        fireEvent.click(btn);
        
        expect(mockProps.buscaDespesasOrdenacaoPaginacao).toHaveBeenCalledWith(3);
        expect(mockProps.buscaDespesasPaginacao).not.toHaveBeenCalled();
    });

    it("reseta para página 1 quando forcarPrimeiraPagina muda", () => {
        const { rerender } = render(<Paginacao {...mockProps} />);
        
        fireEvent.click(screen.getByText("Go to page 2"));
        expect(screen.getByText("Current Page: 2")).toBeInTheDocument();
        
        mockProps.forcarPrimeiraPagina = "novo-uuid";
        rerender(<Paginacao {...mockProps} />);
        
        expect(screen.getByText("Current Page: 1")).toBeInTheDocument();
    });
});

