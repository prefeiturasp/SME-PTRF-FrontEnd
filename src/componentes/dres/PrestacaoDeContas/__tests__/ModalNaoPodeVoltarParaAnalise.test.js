import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalNaoPodeVoltarParaAnalise } from "../ModalNaoPodeVoltarParaAnalise";

describe("ModalNaoPodeVoltarParaAnalise", () => {
    const props = {
        show: true,
        handleClose: jest.fn(),
        texto: "Não é possível voltar para análise pois a prestação já foi publicada.",
        primeiroBotaoTexto: "Fechar",
        primeiroBotaoCss: "success",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar o título fixo e o texto quando show for true", () => {
        render(<ModalNaoPodeVoltarParaAnalise {...props} />);
        expect(screen.getByText("Prestação de Contas já publicada")).toBeInTheDocument();
        expect(screen.getByText("Não é possível voltar para análise pois a prestação já foi publicada.")).toBeInTheDocument();
    });

    it("não deve renderizar o corpo do modal quando show for false", () => {
        render(<ModalNaoPodeVoltarParaAnalise {...props} show={false} />);
        expect(screen.queryByText("Prestação de Contas já publicada")).not.toBeInTheDocument();
    });

    it("deve chamar handleClose ao clicar no botão Fechar", () => {
        render(<ModalNaoPodeVoltarParaAnalise {...props} />);
        fireEvent.click(screen.getByText("Fechar"));
        expect(props.handleClose).toHaveBeenCalledTimes(1);
    });
});
