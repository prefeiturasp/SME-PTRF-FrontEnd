import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalErroDeletarCadastroDespesa } from "../ModalErroDeletarCadastroDespesa";

jest.mock("../../../../Globais/ModalBootstrap", () => ({
    ModalBootstrap: ({ show, onHide, titulo, bodyText, primeiroBotaoOnclick, primeiroBotaoTexto, primeiroBotaoCss, dataQa }) => (
        <div data-testid="modal-bootstrap" data-qa={dataQa} style={{ display: show ? "block" : "none" }}>
            <h1>{titulo}</h1>
            <p>{bodyText}</p>
            <button onClick={primeiroBotaoOnclick} className={primeiroBotaoCss}>
                {primeiroBotaoTexto}
            </button>
        </div>
    ),
}));

describe("ModalErroDeletarCadastroDespesa", () => {
    const defaultProps = {
        show: true,
        handleClose: jest.fn(),
        titulo: "Erro ao deletar",
        texto: "Não é possível excluir esta despesa pois ela está vinculada a uma prestação de contas.",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renderiza o modal com as props corretas", () => {
        render(<ModalErroDeletarCadastroDespesa {...defaultProps} />);

        expect(screen.getByTestId("modal-bootstrap")).toBeInTheDocument();
        expect(screen.getByTestId("modal-bootstrap")).toHaveAttribute("data-qa", "modal-erro-deletar-cadastro-despesa");
    });

    it("exibe o título correto", () => {
        render(<ModalErroDeletarCadastroDespesa {...defaultProps} />);

        expect(screen.getByText("Erro ao deletar")).toBeInTheDocument();
    });

    it("exibe o texto do corpo do modal", () => {
        render(<ModalErroDeletarCadastroDespesa {...defaultProps} />);

        expect(screen.getByText("Não é possível excluir esta despesa pois ela está vinculada a uma prestação de contas.")).toBeInTheDocument();
    });

    it("chama handleClose ao clicar no botão Fechar", () => {
        render(<ModalErroDeletarCadastroDespesa {...defaultProps} />);

        const botaoFechar = screen.getByText("Fechar");
        fireEvent.click(botaoFechar);

        expect(defaultProps.handleClose).toHaveBeenCalledTimes(1);
    });

    it("exibe o modal quando show é true", () => {
        render(<ModalErroDeletarCadastroDespesa {...defaultProps} show={true} />);

        const modal = screen.getByTestId("modal-bootstrap");
        expect(modal).toHaveStyle({ display: "block" });
    });

    it("oculta o modal quando show é false", () => {
        render(<ModalErroDeletarCadastroDespesa {...defaultProps} show={false} />);

        const modal = screen.getByTestId("modal-bootstrap");
        expect(modal).toHaveStyle({ display: "none" });
    });
});

