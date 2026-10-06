import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalRestaurarJustificativa } from "../ModalRestaurarJustificativa";

describe("ModalRestaurarJustificativa", () => {
    const props = {
        show: true,
        handleClose: jest.fn(),
        titulo: "Restaurar justificativa",
        texto: "Deseja restaurar a justificativa original?",
        primeiroBotaoTexto: "Restaurar",
        primeiroBotaoCss: "success",
        primeiroBotaoOnclick: jest.fn(),
        segundoBotaoCss: "outline-success",
        segundoBotaoTexto: "Cancelar",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar o modal quando show for true", () => {
        render(<ModalRestaurarJustificativa {...props} />);
        expect(screen.getByText("Restaurar justificativa")).toBeInTheDocument();
        expect(screen.getByText("Deseja restaurar a justificativa original?")).toBeInTheDocument();
    });

    it("não deve renderizar o corpo do modal quando show for false", () => {
        render(<ModalRestaurarJustificativa {...props} show={false} />);
        expect(screen.queryByText("Restaurar justificativa")).not.toBeInTheDocument();
    });

    it("deve chamar primeiroBotaoOnclick ao clicar no botão Restaurar", () => {
        render(<ModalRestaurarJustificativa {...props} />);
        fireEvent.click(screen.getByText("Restaurar"));
        expect(props.primeiroBotaoOnclick).toHaveBeenCalledTimes(1);
    });

    it("deve chamar handleClose ao clicar no botão Cancelar", () => {
        render(<ModalRestaurarJustificativa {...props} />);
        fireEvent.click(screen.getByText("Cancelar"));
        expect(props.handleClose).toHaveBeenCalledTimes(1);
    });
});
