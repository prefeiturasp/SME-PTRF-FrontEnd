import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalDeletarDespesa } from "../ModalDeletarDespesa";

jest.mock("../../../../Globais/ModalBootstrap", () => ({
    ModalBootstrap: ({ show, titulo, bodyText, primeiroBotaoOnclick, primeiroBotaoTexto, primeiroBotaoCss, segundoBotaoOnclick, segundoBotaoCss, segundoBotaoTexto }) => (
        <div data-testid="modal-bootstrap" style={{ display: show ? "block" : "none" }}>
            <h1>{titulo}</h1>
            <p>{bodyText}</p>
            <button onClick={primeiroBotaoOnclick} className={primeiroBotaoCss}>{primeiroBotaoTexto}</button>
            <button onClick={segundoBotaoOnclick} className={segundoBotaoCss}>{segundoBotaoTexto}</button>
        </div>
    ),
}));

describe("ModalDeletarDespesa", () => {
    const defaultProps = {
        show: true,
        handleClose: jest.fn(),
        titulo: "Excluir despesa",
        texto: "Tem certeza que deseja excluir esta despesa?",
        onDeletarDespesas: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renderiza o modal com título e texto corretos", () => {
        render(<ModalDeletarDespesa {...defaultProps} />);

        expect(screen.getByTestId("modal-bootstrap")).toBeInTheDocument();
        expect(screen.getByText("Excluir despesa")).toBeInTheDocument();
        expect(screen.getByText("Tem certeza que deseja excluir esta despesa?")).toBeInTheDocument();
    });

    it("chama onDeletarDespesas ao clicar em 'Sim'", () => {
        render(<ModalDeletarDespesa {...defaultProps} />);

        const botaoSim = screen.getByText("Sim");
        fireEvent.click(botaoSim);

        expect(defaultProps.onDeletarDespesas).toHaveBeenCalledTimes(1);
    });

    it("chama handleClose ao clicar em 'Não'", () => {
        render(<ModalDeletarDespesa {...defaultProps} />);

        const botaoNao = screen.getByText("Não");
        fireEvent.click(botaoNao);

        expect(defaultProps.handleClose).toHaveBeenCalledTimes(1);
    });

    it("exibe o modal quando show é true", () => {
        render(<ModalDeletarDespesa {...defaultProps} show={true} />);

        const modal = screen.getByTestId("modal-bootstrap");
        expect(modal).toHaveStyle({ display: "block" });
    });

    it("oculta o modal quando show é false", () => {
        render(<ModalDeletarDespesa {...defaultProps} show={false} />);

        const modal = screen.getByTestId("modal-bootstrap");
        expect(modal).toHaveStyle({ display: "none" });
    });
});


