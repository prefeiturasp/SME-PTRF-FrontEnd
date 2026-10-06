import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalJustificadaApagada } from "../ModalJustificadaApagada";

describe("ModalJustificadaApagada", () => {
    const props = {
        show: true,
        handleClose: jest.fn(),
        titulo: "Justificativa apagada",
        texto: "A justificativa foi apagada com sucesso.",
        primeiroBotaoTexto: "Desfazer",
        primeiroBotaoCss: "success",
        primeiroBotaoOnclick: jest.fn(),
        segundoBotaoCss: "outline-success",
        segundoBotaoTexto: "Fechar",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar o modal quando show for true", () => {
        render(<ModalJustificadaApagada {...props} />);
        expect(screen.getByText("Justificativa apagada")).toBeInTheDocument();
        expect(screen.getByText("A justificativa foi apagada com sucesso.")).toBeInTheDocument();
    });

    it("não deve renderizar o corpo do modal quando show for false", () => {
        render(<ModalJustificadaApagada {...props} show={false} />);
        expect(screen.queryByText("Justificativa apagada")).not.toBeInTheDocument();
    });

    it("deve chamar primeiroBotaoOnclick ao clicar no botão Desfazer", () => {
        render(<ModalJustificadaApagada {...props} />);
        fireEvent.click(screen.getByText("Desfazer"));
        expect(props.primeiroBotaoOnclick).toHaveBeenCalledTimes(1);
    });

    it("deve chamar handleClose ao clicar no botão Fechar", () => {
        render(<ModalJustificadaApagada {...props} />);
        fireEvent.click(screen.getByText("Fechar"));
        expect(props.handleClose).toHaveBeenCalledTimes(1);
    });
});
