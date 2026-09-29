import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalJustificarNaoRealizacao } from "../ModalJustificarNaoRealizacao";

describe("ModalJustificarNaoRealizacao", () => {
    const props = {
        show: true,
        onHide: jest.fn(),
        titulo: "Justificar não realização",
        bodyText: "Informe a justificativa para a não realização.",
        primeiroBotaoTexto: "Cancelar",
        primeiroBotaoCss: "outline-success",
        primeiroBotaoOnClick: jest.fn(),
        segundoBotaoCss: "success",
        segundoBotaoTexto: "Confirmar",
        segundoBotaoOnclick: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar o modal quando show for true", () => {
        render(<ModalJustificarNaoRealizacao {...props} />);
        expect(screen.getByText("Justificar não realização")).toBeInTheDocument();
        expect(screen.getByText("Informe a justificativa para a não realização.")).toBeInTheDocument();
    });

    it("não deve renderizar o corpo do modal quando show for false", () => {
        render(<ModalJustificarNaoRealizacao {...props} show={false} />);
        expect(screen.queryByText("Justificar não realização")).not.toBeInTheDocument();
    });

    it("deve chamar primeiroBotaoOnClick ao clicar no botão Cancelar", () => {
        render(<ModalJustificarNaoRealizacao {...props} />);
        fireEvent.click(screen.getByText("Cancelar"));
        expect(props.primeiroBotaoOnClick).toHaveBeenCalledTimes(1);
    });

    it("deve chamar segundoBotaoOnclick ao clicar no botão Confirmar quando presente", () => {
        render(<ModalJustificarNaoRealizacao {...props} />);
        fireEvent.click(screen.getByText("Confirmar"));
        expect(props.segundoBotaoOnclick).toHaveBeenCalledTimes(1);
    });

    it("não deve renderizar o segundo botão quando segundoBotaoOnclick ou segundoBotaoTexto não forem informados", () => {
        render(<ModalJustificarNaoRealizacao {...props} segundoBotaoOnclick={undefined} />);
        expect(screen.queryByText("Confirmar")).not.toBeInTheDocument();
    });
});
