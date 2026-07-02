import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ModalRejeitarEncerramento } from "../index";

let capturedProps = null;

jest.mock("../../../../../../Globais/ModalBootstrap", () => ({
    ModalMotivosRejeicaoEncerramentoConta: (props) => {
        capturedProps = props;
        return (
            <div data-testid="modal-motivos-rejeicao">
                {props.bodyText}
            </div>
        );
    },
}));

describe("ModalRejeitarEncerramento", () => {
    const motivosRejeicaoBase = [
        { uuid: "uuid-1", nome: "Motivo 1", selected: false },
        { uuid: "uuid-2", nome: "Motivo 2", selected: false },
    ];

    beforeEach(() => {
        capturedProps = null;
    });

    const baseProps = (overrides = {}) => ({
        show: true,
        handleClose: jest.fn(),
        titulo: "Rejeitar encerramento",
        motivosRejeicao: motivosRejeicaoBase.map((m) => ({ ...m })),
        primeiroBotaoTexto: "Cancelar",
        primeiroBotaoCss: "secondary",
        onRejeitarEncerramento: jest.fn(),
        segundoBotaoTexto: "Confirmar",
        segundoBotaoCss: "primary",
        ...overrides,
    });

    it("renderiza os motivos passados via props", () => {
        render(<ModalRejeitarEncerramento {...baseProps()} />);

        expect(screen.getByText("Motivo 1")).toBeInTheDocument();
        expect(screen.getByText("Motivo 2")).toBeInTheDocument();

        const checkboxes = screen.getAllByRole("checkbox");
        expect(checkboxes).toHaveLength(2);
        expect(checkboxes[0]).not.toBeChecked();
        expect(checkboxes[1]).not.toBeChecked();
    });

    it("toggle de checkbox inverte selected apenas do motivo correspondente", () => {
        render(<ModalRejeitarEncerramento {...baseProps()} />);

        const checkboxes = screen.getAllByRole("checkbox");

        fireEvent.click(checkboxes[0]);

        expect(checkboxes[0]).toBeChecked();
        expect(checkboxes[1]).not.toBeChecked();

        fireEvent.click(checkboxes[0]);
        expect(checkboxes[0]).not.toBeChecked();

        fireEvent.click(checkboxes[1]);
        expect(checkboxes[0]).not.toBeChecked();
        expect(checkboxes[1]).toBeChecked();
    });

    it("digitar no textarea atualiza outrosMotivosRejeicao", () => {
        render(<ModalRejeitarEncerramento {...baseProps()} />);

        const textarea = screen.getByLabelText ? null : document.querySelector('textarea[name="motivo-rejeicao"]');
        const ta = textarea || document.querySelector('textarea[name="motivo-rejeicao"]');

        fireEvent.change(ta, { target: { value: "Outro motivo qualquer" } });

        expect(ta.value).toBe("Outro motivo qualquer");
    });

    it("ao confirmar, chama onRejeitarEncerramento com motivosRejeicao e outrosMotivosRejeicao atualizados", () => {
        const onRejeitarEncerramento = jest.fn();
        render(
            <ModalRejeitarEncerramento
                {...baseProps({ onRejeitarEncerramento })}
            />
        );

        const checkboxes = screen.getAllByRole("checkbox");
        fireEvent.click(checkboxes[1]);

        const textarea = document.querySelector('textarea[name="motivo-rejeicao"]');
        fireEvent.change(textarea, { target: { value: "Texto extra" } });

        expect(capturedProps.segundoBotaoOnclick).toBeInstanceOf(Function);
        capturedProps.segundoBotaoOnclick();

        expect(onRejeitarEncerramento).toHaveBeenCalledTimes(1);
        const [motivosChamados, outrosChamados] = onRejeitarEncerramento.mock.calls[0];

        expect(outrosChamados).toBe("Texto extra");
        expect(motivosChamados).toEqual([
            { uuid: "uuid-1", nome: "Motivo 1", selected: false },
            { uuid: "uuid-2", nome: "Motivo 2", selected: true },
        ]);
    });

    it("não exibe span de erro quando errorModalRejeicao não é fornecido", () => {
        render(<ModalRejeitarEncerramento {...baseProps()} />);

        expect(document.querySelector(".span_erro")).not.toBeInTheDocument();
    });

    it("exibe span de erro quando errorModalRejeicao é fornecido", () => {
        render(
            <ModalRejeitarEncerramento
                {...baseProps({ errorModalRejeicao: "Selecione ao menos um motivo" })}
            />
        );

        expect(screen.getByText(/Selecione ao menos um motivo/)).toBeInTheDocument();
        expect(document.querySelector(".span_erro")).toBeInTheDocument();
    });

    it("repassa props básicos corretamente para o ModalMotivosRejeicaoEncerramentoConta", () => {
        const handleClose = jest.fn();
        render(
            <ModalRejeitarEncerramento
                {...baseProps({ handleClose, show: false })}
            />
        );

        expect(capturedProps.show).toBe(false);
        expect(capturedProps.onHide).toBe(handleClose);
        expect(capturedProps.titulo).toBe("Rejeitar encerramento");
        expect(capturedProps.primeiroBotaoOnclick).toBe(handleClose);
        expect(capturedProps.primeiroBotaoTexto).toBe("Cancelar");
        expect(capturedProps.primeiroBotaoCss).toBe("secondary");
        expect(capturedProps.segundoBotaoTexto).toBe("Confirmar");
        expect(capturedProps.segundoBotaoCss).toBe("primary");
    });
});
