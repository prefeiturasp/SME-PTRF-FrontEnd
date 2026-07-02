import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ModalConfirmarEncerramento } from "../index";

let capturedProps = null;

jest.mock("../../../../../../Globais/ModalBootstrap", () => ({
    ModalBootstrap: (props) => {
        capturedProps = props;
        return <div data-testid="modal-bootstrap" />;
    },
}));

describe("ModalConfirmarEncerramento", () => {
    beforeEach(() => {
        capturedProps = null;
    });

    it("repassa corretamente todos os props para o ModalBootstrap", () => {
        const handleClose = jest.fn();
        const onConfirmarEncerramento = jest.fn();

        const props = {
            show: true,
            handleClose,
            titulo: "Confirmar encerramento",
            texto: "Deseja confirmar o encerramento da conta?",
            primeiroBotaoTexto: "Cancelar",
            primeiroBotaoCss: "secondary",
            onConfirmarEncerramento,
            segundoBotaoTexto: "Confirmar",
            segundoBotaoCss: "primary",
        };

        render(<ModalConfirmarEncerramento {...props} />);

        expect(screen.getByTestId("modal-bootstrap")).toBeInTheDocument();
        expect(capturedProps).not.toBeNull();
        expect(capturedProps.show).toBe(true);
        expect(capturedProps.onHide).toBe(handleClose);
        expect(capturedProps.titulo).toBe("Confirmar encerramento");
        expect(capturedProps.bodyText).toBe(
            "Deseja confirmar o encerramento da conta?"
        );
        expect(capturedProps.primeiroBotaoOnclick).toBe(handleClose);
        expect(capturedProps.primeiroBotaoTexto).toBe("Cancelar");
        expect(capturedProps.primeiroBotaoCss).toBe("secondary");
        expect(capturedProps.segundoBotaoOnclick).toBe(onConfirmarEncerramento);
        expect(capturedProps.segundoBotaoTexto).toBe("Confirmar");
        expect(capturedProps.segundoBotaoCss).toBe("primary");
    });

    it("repassa show=false quando informado", () => {
        const props = {
            show: false,
            handleClose: jest.fn(),
            titulo: "Titulo",
            texto: "Texto",
            primeiroBotaoTexto: "Cancelar",
            primeiroBotaoCss: "secondary",
            onConfirmarEncerramento: jest.fn(),
            segundoBotaoTexto: "Confirmar",
            segundoBotaoCss: "primary",
        };

        render(<ModalConfirmarEncerramento {...props} />);

        expect(capturedProps.show).toBe(false);
    });
});
