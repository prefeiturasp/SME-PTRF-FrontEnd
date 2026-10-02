import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalNotificarComentarios } from "../ModalNotificarComentarios";

describe("ModalNotificarComentarios", () => {
    const props = {
        show: true,
        handleClose: jest.fn(),
        titulo: "Notificar comentários",
        texto: "Deseja notificar os comentários realizados?",
        primeiroBotaoTexto: "Notificar",
        primeiroBotaoCss: "success",
        segundoBotaoCss: "outline-success",
        segundoBotaoTexto: "Cancelar",
        notificarComentarios: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar o modal quando show for true", () => {
        render(<ModalNotificarComentarios {...props} />);
        expect(screen.getByText("Notificar comentários")).toBeInTheDocument();
        expect(screen.getByText("Deseja notificar os comentários realizados?")).toBeInTheDocument();
    });

    it("não deve renderizar o corpo do modal quando show for false", () => {
        render(<ModalNotificarComentarios {...props} show={false} />);
        expect(screen.queryByText("Notificar comentários")).not.toBeInTheDocument();
    });

    it("deve chamar notificarComentarios ao clicar no botão Notificar", () => {
        render(<ModalNotificarComentarios {...props} />);
        fireEvent.click(screen.getByText("Notificar"));
        expect(props.notificarComentarios).toHaveBeenCalledTimes(1);
    });

    it("deve chamar handleClose ao clicar no botão Cancelar", () => {
        render(<ModalNotificarComentarios {...props} />);
        fireEvent.click(screen.getByText("Cancelar"));
        expect(props.handleClose).toHaveBeenCalledTimes(1);
    });
});
