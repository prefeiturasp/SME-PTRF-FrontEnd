import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalErroPrestacaoDeContasPosterior } from "../ModalErroPrestacaoDeContasPosterior";

describe("ModalErroPrestacaoDeContasPosterior", () => {
    const props = {
        show: true,
        handleClose: jest.fn(),
        titulo: "Erro",
        texto: "Existe uma prestação de contas posterior.",
        primeiroBotaoTexto: "Fechar",
        primeiroBotaoCss: "success",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar o modal quando show for true", () => {
        render(<ModalErroPrestacaoDeContasPosterior {...props} />);
        expect(screen.getByText("Erro")).toBeInTheDocument();
        expect(screen.getByText("Existe uma prestação de contas posterior.")).toBeInTheDocument();
    });

    it("não deve renderizar o corpo do modal quando show for false", () => {
        render(<ModalErroPrestacaoDeContasPosterior {...props} show={false} />);
        expect(screen.queryByText("Erro")).not.toBeInTheDocument();
    });

    it("deve chamar handleClose ao clicar no botão Fechar", () => {
        render(<ModalErroPrestacaoDeContasPosterior {...props} />);
        fireEvent.click(screen.getByText("Fechar"));
        expect(props.handleClose).toHaveBeenCalledTimes(1);
    });
});
