import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalVoltarParaAnalise } from "../ModalVoltarParaAnalise";

describe("ModalVoltarParaAnalise", () => {
    const props = {
        show: true,
        handleClose: jest.fn(),
        titulo: "Voltar para análise",
        texto: "Deseja realmente voltar esta prestação de contas para análise?",
        primeiroBotaoTexto: "Cancelar",
        primeiroBotaoCss: "outline-success",
        segundoBotaoCss: "success",
        segundoBotaoTexto: "Confirmar",
        onVoltarParaAnalise: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar o modal quando show for true", () => {
        render(<ModalVoltarParaAnalise {...props} />);
        expect(screen.getByText("Voltar para análise")).toBeInTheDocument();
        expect(screen.getByText("Deseja realmente voltar esta prestação de contas para análise?")).toBeInTheDocument();
    });

    it("não deve renderizar o corpo do modal quando show for false", () => {
        render(<ModalVoltarParaAnalise {...props} show={false} />);
        expect(screen.queryByText("Voltar para análise")).not.toBeInTheDocument();
    });

    it("deve chamar handleClose ao clicar no botão Cancelar", () => {
        render(<ModalVoltarParaAnalise {...props} />);
        fireEvent.click(screen.getByText("Cancelar"));
        expect(props.handleClose).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onVoltarParaAnalise ao clicar no botão Confirmar", () => {
        render(<ModalVoltarParaAnalise {...props} />);
        fireEvent.click(screen.getByText("Confirmar"));
        expect(props.onVoltarParaAnalise).toHaveBeenCalledTimes(1);
    });
});
