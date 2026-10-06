import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalNaoRecebida } from "../ModalNaoRecebida";

describe("ModalNaoRecebida", () => {
    const props = {
        show: true,
        handleClose: jest.fn(),
        titulo: "Prestação de contas não recebida",
        texto: "Deseja reabrir a prestação de contas?",
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
        render(<ModalNaoRecebida {...props} />);
        expect(screen.getByText("Prestação de contas não recebida")).toBeInTheDocument();
        expect(screen.getByText("Deseja reabrir a prestação de contas?")).toBeInTheDocument();
    });

    it("não deve renderizar o corpo do modal quando show for false", () => {
        render(<ModalNaoRecebida {...props} show={false} />);
        expect(screen.queryByText("Prestação de contas não recebida")).not.toBeInTheDocument();
    });

    it("deve chamar handleClose ao clicar no botão Cancelar", () => {
        render(<ModalNaoRecebida {...props} />);
        fireEvent.click(screen.getByText("Cancelar"));
        expect(props.handleClose).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onReabrirTrue ao clicar no botão Reabrir", () => {
        render(<ModalNaoRecebida {...props} />);
        fireEvent.click(screen.getByText("Reabrir"));
        expect(props.onReabrirTrue).toHaveBeenCalledTimes(1);
    });
});
