import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ModalConfirmaInicioSuporte } from "../ModalConfirmaInicioSuporte";

let capturedProps = null;
jest.mock("../../ModalBootstrap", () => ({
    ModalBootstrap: (props) => {
        capturedProps = props;
        return <div data-testid="modal-bootstrap" />;
    },
}));

describe("ModalConfirmaInicioSuporte", () => {
    beforeEach(() => {
        capturedProps = null;
    });

    it("deve renderizar o ModalBootstrap", () => {
        render(
            <ModalConfirmaInicioSuporte
                show={true}
                handleClose={jest.fn()}
                handleNaoConfirmaSuporte={jest.fn()}
                handleConfirmaSuporte={jest.fn()}
                texto="Texto de teste"
            />
        );
        expect(screen.getByTestId("modal-bootstrap")).toBeInTheDocument();
    });

    it("deve repassar a prop show para o ModalBootstrap", () => {
        render(
            <ModalConfirmaInicioSuporte
                show={true}
                handleClose={jest.fn()}
                handleNaoConfirmaSuporte={jest.fn()}
                handleConfirmaSuporte={jest.fn()}
                texto="Texto de teste"
            />
        );
        expect(capturedProps.show).toBe(true);
    });

    it("deve repassar handleClose como onHide", () => {
        const handleClose = jest.fn();
        render(
            <ModalConfirmaInicioSuporte
                show={false}
                handleClose={handleClose}
                handleNaoConfirmaSuporte={jest.fn()}
                handleConfirmaSuporte={jest.fn()}
                texto="Texto de teste"
            />
        );
        expect(capturedProps.onHide).toBe(handleClose);
    });

    it("deve definir o título de confirmação de acesso de suporte", () => {
        render(
            <ModalConfirmaInicioSuporte
                show={false}
                handleClose={jest.fn()}
                handleNaoConfirmaSuporte={jest.fn()}
                handleConfirmaSuporte={jest.fn()}
                texto="Texto de teste"
            />
        );
        expect(capturedProps.titulo).toBe("Confirmação de acesso de suporte");
    });

    it("deve repassar o texto recebido como bodyText", () => {
        render(
            <ModalConfirmaInicioSuporte
                show={false}
                handleClose={jest.fn()}
                handleNaoConfirmaSuporte={jest.fn()}
                handleConfirmaSuporte={jest.fn()}
                texto="Deseja iniciar suporte?"
            />
        );
        expect(capturedProps.bodyText).toBe("Deseja iniciar suporte?");
    });

    it("deve configurar o primeiro botão como 'Não' com callback handleNaoConfirmaSuporte", () => {
        const handleNaoConfirmaSuporte = jest.fn();
        render(
            <ModalConfirmaInicioSuporte
                show={false}
                handleClose={jest.fn()}
                handleNaoConfirmaSuporte={handleNaoConfirmaSuporte}
                handleConfirmaSuporte={jest.fn()}
                texto="Texto de teste"
            />
        );
        expect(capturedProps.primeiroBotaoTexto).toBe("Não");
        expect(capturedProps.primeiroBotaoCss).toBe("outline-success");
        expect(capturedProps.primeiroBotaoOnclick).toBe(handleNaoConfirmaSuporte);
    });

    it("deve configurar o segundo botão como 'Sim' com callback handleConfirmaSuporte", () => {
        const handleConfirmaSuporte = jest.fn();
        render(
            <ModalConfirmaInicioSuporte
                show={false}
                handleClose={jest.fn()}
                handleNaoConfirmaSuporte={jest.fn()}
                handleConfirmaSuporte={handleConfirmaSuporte}
                texto="Texto de teste"
            />
        );
        expect(capturedProps.segundoBotaoTexto).toBe("Sim");
        expect(capturedProps.segundoBotaoCss).toBe("danger");
        expect(capturedProps.segundoBotaoOnclick).toBe(handleConfirmaSuporte);
    });
});
