import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Ordenacao } from "../Ordenacao";

jest.mock("../ModalOrdenar", () => ({
    ModalOrdenar: () => <div>Modal Ordenar</div>
}));

describe("Ordenacao", () => {
    let mockProps;

    beforeEach(() => {
        mockProps = {
            showModalOrdenar: false,
            setShowModalOrdenar: jest.fn(),
            camposOrdenacao: {},
            handleChangeOrdenacao: jest.fn(),
            onSubmitOrdenar: jest.fn()
        };
    });

    it("renderiza o botão de ordenação", () => {
        render(<Ordenacao {...mockProps} />);
        
        expect(screen.getByText("Ordenação")).toBeInTheDocument();
    });

    it("abre o modal ao clicar no botão", () => {
        render(<Ordenacao {...mockProps} />);
        
        const botao = screen.getByText("Ordenação");
        fireEvent.click(botao);
        
        expect(mockProps.setShowModalOrdenar).toHaveBeenCalledWith(true);
    });

    it("renderiza o componente ModalOrdenar", () => {
        render(<Ordenacao {...mockProps} />);
        
        expect(screen.getByText("Modal Ordenar")).toBeInTheDocument();
    });
});

