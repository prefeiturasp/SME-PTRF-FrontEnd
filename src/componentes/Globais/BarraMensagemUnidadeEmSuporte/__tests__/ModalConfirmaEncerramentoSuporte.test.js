import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalConfirmaEncerramentoSuporte } from "../ModalConfirmaEncerramentoSuporte";

jest.mock("../../ModalBootstrap", () => ({
    ModalBootstrap: ({
        show,
        titulo,
        bodyText,
        primeiroBotaoTexto,
        primeiroBotaoCss,
        primeiroBotaoOnclick,
        segundoBotaoTexto,
        segundoBotaoCss,
        segundoBotaoOnclick,
    }) =>
        show ? (
            <div data-testid="modal-bootstrap">
                <span data-testid="titulo">{titulo}</span>
                <span data-testid="body-text" dangerouslySetInnerHTML={{ __html: bodyText }} />
                <button
                    data-testid="primeiro-botao"
                    className={primeiroBotaoCss}
                    onClick={primeiroBotaoOnclick}
                >
                    {primeiroBotaoTexto}
                </button>
                <button
                    data-testid="segundo-botao"
                    className={segundoBotaoCss}
                    onClick={segundoBotaoOnclick}
                >
                    {segundoBotaoTexto}
                </button>
            </div>
        ) : null,
}));

describe("ModalConfirmaEncerramentoSuporte", () => {
    const handleNao = jest.fn();
    const handleSim = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("não renderiza quando show é false", () => {
        render(
            <ModalConfirmaEncerramentoSuporte
                show={false}
                handleNaoConfirmaEncerramentoSuporte={handleNao}
                handleConfirmaEncerramentoSuporte={handleSim}
            />
        );

        expect(screen.queryByTestId("modal-bootstrap")).not.toBeInTheDocument();
    });

    it("renderiza quando show é true", () => {
        render(
            <ModalConfirmaEncerramentoSuporte
                show={true}
                handleNaoConfirmaEncerramentoSuporte={handleNao}
                handleConfirmaEncerramentoSuporte={handleSim}
            />
        );

        expect(screen.getByTestId("modal-bootstrap")).toBeInTheDocument();
    });

    it("exibe o título correto", () => {
        render(
            <ModalConfirmaEncerramentoSuporte
                show={true}
                handleNaoConfirmaEncerramentoSuporte={handleNao}
                handleConfirmaEncerramentoSuporte={handleSim}
            />
        );

        expect(screen.getByTestId("titulo")).toHaveTextContent(
            "Confirmação de encerramento de suporte"
        );
    });

    it("exibe o texto do corpo corretamente", () => {
        render(
            <ModalConfirmaEncerramentoSuporte
                show={true}
                handleNaoConfirmaEncerramentoSuporte={handleNao}
                handleConfirmaEncerramentoSuporte={handleSim}
            />
        );

        expect(screen.getByTestId("body-text").innerHTML).toContain(
            "Deseja encerrar o suporte a essa unidade?"
        );
        expect(screen.getByTestId("body-text").innerHTML).toContain(
            "Ao confirmar, você não visualizará mais essa unidade como suporte."
        );
    });

    it("exibe o botão Não com css outline-success", () => {
        render(
            <ModalConfirmaEncerramentoSuporte
                show={true}
                handleNaoConfirmaEncerramentoSuporte={handleNao}
                handleConfirmaEncerramentoSuporte={handleSim}
            />
        );

        const botaoNao = screen.getByTestId("primeiro-botao");
        expect(botaoNao).toHaveTextContent("Não");
        expect(botaoNao).toHaveClass("outline-success");
    });

    it("exibe o botão Sim com css danger", () => {
        render(
            <ModalConfirmaEncerramentoSuporte
                show={true}
                handleNaoConfirmaEncerramentoSuporte={handleNao}
                handleConfirmaEncerramentoSuporte={handleSim}
            />
        );

        const botaoSim = screen.getByTestId("segundo-botao");
        expect(botaoSim).toHaveTextContent("Sim");
        expect(botaoSim).toHaveClass("danger");
    });

    it("chama handleNaoConfirmaEncerramentoSuporte ao clicar em Não", () => {
        render(
            <ModalConfirmaEncerramentoSuporte
                show={true}
                handleNaoConfirmaEncerramentoSuporte={handleNao}
                handleConfirmaEncerramentoSuporte={handleSim}
            />
        );

        fireEvent.click(screen.getByTestId("primeiro-botao"));

        expect(handleNao).toHaveBeenCalledTimes(1);
        expect(handleSim).not.toHaveBeenCalled();
    });

    it("chama handleConfirmaEncerramentoSuporte ao clicar em Sim", () => {
        render(
            <ModalConfirmaEncerramentoSuporte
                show={true}
                handleNaoConfirmaEncerramentoSuporte={handleNao}
                handleConfirmaEncerramentoSuporte={handleSim}
            />
        );

        fireEvent.click(screen.getByTestId("segundo-botao"));

        expect(handleSim).toHaveBeenCalledTimes(1);
        expect(handleNao).not.toHaveBeenCalled();
    });
});
