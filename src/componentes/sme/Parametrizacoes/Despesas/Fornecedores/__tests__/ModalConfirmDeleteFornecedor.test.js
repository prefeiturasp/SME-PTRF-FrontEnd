import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalConfirmDeleteFornecedor } from "../ModalConfirmDeleteFornecedor";

jest.mock("../../../../../Globais/ModalBootstrap", () => ({
    ModalBootstrap: ({ show, titulo, bodyText, primeiroBotaoOnclick, primeiroBotaoTexto, segundoBotaoOnclick, segundoBotaoTexto }) => (
        <div data-testid="modal-bootstrap-mock" style={{ display: show ? "block" : "none" }}>
            <h1>{titulo}</h1>
            <p>{bodyText}</p>
            <button data-testid="primeiro-botao" onClick={primeiroBotaoOnclick}>
                {primeiroBotaoTexto}
            </button>
            {segundoBotaoTexto && (
                <button data-testid="segundo-botao" onClick={segundoBotaoOnclick}>
                    {segundoBotaoTexto}
                </button>
            )}
        </div>
    ),
}));
describe("Componente ModalConfirmDeleteFornecedor", () => {
    const mockHandleClose = jest.fn();
    const mockOnDeleteTrue = jest.fn();
    const defaultProps = {
        show: true,
        handleClose: mockHandleClose,
        onDeleteFornecedorTrue: mockOnDeleteTrue,
        titulo: "Confirmar Exclusão",
        texto: "Você tem certeza que deseja excluir este item?",
        primeiroBotaoTexto: "Cancelar",
        primeiroBotaoCss: "btn-outline-danger",
        segundoBotaoTexto: "Excluir",
        segundoBotaoCss: "btn-danger",
    };
    test("renderiza a modal contendo os seguintes textos", () => {
        render(<ModalConfirmDeleteFornecedor {...defaultProps} />);
        
        const modal = screen.getByTestId("modal-bootstrap-mock");
        expect(modal).toBeVisible();
        expect(screen.getByText("Confirmar Exclusão")).toBeInTheDocument();
        expect(screen.getByText("Você tem certeza que deseja excluir este item?")).toBeInTheDocument();
        expect(screen.getByText("Cancelar")).toBeInTheDocument();
        expect(screen.getByText("Excluir")).toBeInTheDocument();
    });
    test("testa chamada de 'handleClose' quando o botao é clicado", () => {
        render(<ModalConfirmDeleteFornecedor {...defaultProps} />);
        
        const closeButton = screen.getByTestId("primeiro-botao");
        fireEvent.click(closeButton);
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });
    test("testa chamada de 'onDeleteTrue' quando o botão for clicado", () => {
        render(<ModalConfirmDeleteFornecedor {...defaultProps} />);
        
        const deleteTrueButton = screen.getByTestId("segundo-botao");
        fireEvent.click(deleteTrueButton);
        expect(mockOnDeleteTrue).toHaveBeenCalled();
    });
    test("Oculta a Modal quando 'show' é false", () => {
        render(<ModalConfirmDeleteFornecedor {...defaultProps} show={false} />);
        
        const modal = screen.getByTestId("modal-bootstrap-mock");
        expect(modal).not.toBeVisible();
    });
});