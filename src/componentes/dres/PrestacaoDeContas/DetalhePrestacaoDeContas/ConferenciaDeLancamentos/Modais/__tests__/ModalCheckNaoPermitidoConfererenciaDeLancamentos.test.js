import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalCheckNaoPermitidoConfererenciaDeLancamentos } from "../ModalCheckNaoPermitidoConfererenciaDeLancamentos";

describe("ModalCheckNaoPermitidoConfererenciaDeLancamentos", () => {
    const props = {
        show: true,
        handleClose: jest.fn(),
        titulo: "Conferência não permitida",
        texto: "Não é possível realizar a conferência deste lançamento.",
        primeiroBotaoTexto: "Fechar",
        primeiroBotaoCss: "success",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar o modal quando show for true", () => {
        render(<ModalCheckNaoPermitidoConfererenciaDeLancamentos {...props} />);
        expect(screen.getByText("Conferência não permitida")).toBeInTheDocument();
        expect(screen.getByText("Não é possível realizar a conferência deste lançamento.")).toBeInTheDocument();
    });

    it("não deve renderizar o corpo do modal quando show for false", () => {
        render(<ModalCheckNaoPermitidoConfererenciaDeLancamentos {...props} show={false} />);
        expect(screen.queryByText("Conferência não permitida")).not.toBeInTheDocument();
    });

    it("deve chamar handleClose ao clicar no botão Fechar", () => {
        render(<ModalCheckNaoPermitidoConfererenciaDeLancamentos {...props} />);
        fireEvent.click(screen.getByText("Fechar"));
        expect(props.handleClose).toHaveBeenCalledTimes(1);
    });
});
