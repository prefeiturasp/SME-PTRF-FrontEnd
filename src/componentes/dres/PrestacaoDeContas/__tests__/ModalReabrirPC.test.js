import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalReabrirPc } from "../ModalReabrirPC";

describe("ModalReabrirPc", () => {
    const props = {
        show: true,
        handleClose: jest.fn(),
        titulo: "Reabrir prestação de contas",
        texto: "Deseja realmente reabrir esta prestação de contas?",
        primeiroBotaoTexto: "Cancelar",
        primeiroBotaoCss: "outline-success",
        segundoBotaoCss: "success",
        segundoBotaoTexto: "Reabrir",
        onReabrirTrue: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar o modal quando show for true", () => {
        render(<ModalReabrirPc {...props} />);
        expect(screen.getByText("Reabrir prestação de contas")).toBeInTheDocument();
        expect(screen.getByText("Deseja realmente reabrir esta prestação de contas?")).toBeInTheDocument();
    });

    it("não deve renderizar o corpo do modal quando show for false", () => {
        render(<ModalReabrirPc {...props} show={false} />);
        expect(screen.queryByText("Reabrir prestação de contas")).not.toBeInTheDocument();
    });

    it("deve chamar handleClose ao clicar no botão Cancelar", () => {
        render(<ModalReabrirPc {...props} />);
        fireEvent.click(screen.getByText("Cancelar"));
        expect(props.handleClose).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onReabrirTrue ao clicar no botão Reabrir", () => {
        render(<ModalReabrirPc {...props} />);
        fireEvent.click(screen.getByText("Reabrir"));
        expect(props.onReabrirTrue).toHaveBeenCalledTimes(1);
    });
});
