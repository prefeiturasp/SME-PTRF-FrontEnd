import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalDeleteAjusteSaldoPC } from "../ModalDeleteAjusteSaldoPC";

describe("ModalDeleteAjusteSaldoPC", () => {
    const props = {
        show: true,
        handleClose: jest.fn(),
        titulo: "Excluir ajuste de saldo",
        texto: "Deseja realmente excluir este ajuste de saldo?",
        primeiroBotaoTexto: "Cancelar",
        primeiroBotaoCss: "outline-success",
        segundoBotaoCss: "success",
        segundoBotaoTexto: "Excluir",
        onDeletarAjustePcTrue: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar o modal quando show for true", () => {
        render(<ModalDeleteAjusteSaldoPC {...props} />);
        expect(screen.getByText("Excluir ajuste de saldo")).toBeInTheDocument();
        expect(screen.getByText("Deseja realmente excluir este ajuste de saldo?")).toBeInTheDocument();
    });

    it("não deve renderizar o corpo do modal quando show for false", () => {
        render(<ModalDeleteAjusteSaldoPC {...props} show={false} />);
        expect(screen.queryByText("Excluir ajuste de saldo")).not.toBeInTheDocument();
    });

    it("deve chamar handleClose ao clicar no botão Cancelar", () => {
        render(<ModalDeleteAjusteSaldoPC {...props} />);
        fireEvent.click(screen.getByText("Cancelar"));
        expect(props.handleClose).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onDeletarAjustePcTrue ao clicar no botão Excluir", () => {
        render(<ModalDeleteAjusteSaldoPC {...props} />);
        fireEvent.click(screen.getByText("Excluir"));
        expect(props.onDeletarAjustePcTrue).toHaveBeenCalledTimes(1);
    });
});
