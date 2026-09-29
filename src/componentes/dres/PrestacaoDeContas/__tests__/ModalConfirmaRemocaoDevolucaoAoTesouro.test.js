import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalConfirmaRemocaoDevolucaoAoTesouro } from "../ModalConfirmaRemocaoDevolucaoAoTesouro";

describe("ModalConfirmaRemocaoDevolucaoAoTesouro", () => {
    const props = {
        show: true,
        handleClose: jest.fn(),
        titulo: "Remover devolução ao tesouro",
        texto: "Deseja realmente remover esta devolução ao tesouro?",
        primeiroBotaoTexto: "Cancelar",
        primeiroBotaoCss: "outline-success",
        segundoBotaoCss: "success",
        segundoBotaoTexto: "Confirmar",
        onConfirmaTrue: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar o modal quando show for true", () => {
        render(<ModalConfirmaRemocaoDevolucaoAoTesouro {...props} />);
        expect(screen.getByText("Remover devolução ao tesouro")).toBeInTheDocument();
        expect(screen.getByText("Deseja realmente remover esta devolução ao tesouro?")).toBeInTheDocument();
    });

    it("não deve renderizar o corpo do modal quando show for false", () => {
        render(<ModalConfirmaRemocaoDevolucaoAoTesouro {...props} show={false} />);
        expect(screen.queryByText("Remover devolução ao tesouro")).not.toBeInTheDocument();
    });

    it("deve chamar handleClose ao clicar no botão Cancelar", () => {
        render(<ModalConfirmaRemocaoDevolucaoAoTesouro {...props} />);
        fireEvent.click(screen.getByText("Cancelar"));
        expect(props.handleClose).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onConfirmaTrue ao clicar no botão Confirmar", () => {
        render(<ModalConfirmaRemocaoDevolucaoAoTesouro {...props} />);
        fireEvent.click(screen.getByText("Confirmar"));
        expect(props.onConfirmaTrue).toHaveBeenCalledTimes(1);
    });
});
