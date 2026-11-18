import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalAlteradoParticipantesHistorico } from "../ModalAlteradoParticipantesHistorico";

const MENSAGEM =
    "Os participantes da ata foram atualizados de acordo com o histórico de membros. Revise a ata antes de gerar o documento.";

const renderComponent = (overrides = {}) => {
    const props = {
        show: true,
        handleClose: jest.fn(),
        titulo: "Participantes alterados",
        texto: `<p>${MENSAGEM}</p>`,
        btGerarDesabilitado: false,
        textoBotaoVisualizar: "Visualizar ata",
        onClickGerarAta: jest.fn(),
        onClickVisualizarAta: jest.fn(),
        dataQa: "modal-alterado-participantes-historico",
        ...overrides,
    };
    const result = render(<ModalAlteradoParticipantesHistorico {...props} />);
    return { props, ...result };
};

describe("<ModalAlteradoParticipantesHistorico>", () => {
    describe("Renderização", () => {
        it("deve exibir o modal quando show for true", () => {
            renderComponent();
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });

        it("não deve exibir o modal quando show for false", () => {
            renderComponent({ show: false });
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });

        it("deve exibir o título informado", () => {
            renderComponent({ titulo: "Atenção" });
            expect(screen.getByText("Atenção")).toBeInTheDocument();
        });

        it("deve exibir a mensagem do backend renderizando o HTML do texto", () => {
            renderComponent();
            const mensagem = screen.getByText(MENSAGEM);
            expect(mensagem).toBeInTheDocument();
            expect(mensagem.tagName).toBe("P");
        });

        it("deve exibir os botões de gerar ata e de visualizar ata", () => {
            renderComponent();
            expect(screen.getByRole("button", { name: "Gerar ata" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Visualizar ata" })).toBeInTheDocument();
        });

        it("deve exibir o texto de prévia no botão de visualizar quando informado", () => {
            renderComponent({ textoBotaoVisualizar: "Visualizar prévia da ata" });
            expect(screen.getByRole("button", { name: "Visualizar prévia da ata" })).toBeInTheDocument();
            expect(screen.queryByRole("button", { name: "Visualizar ata" })).not.toBeInTheDocument();
        });

        it("deve aplicar os estilos dos botões", () => {
            renderComponent();
            expect(screen.getByRole("button", { name: "Gerar ata" })).toHaveClass("btn-outline-success");
            expect(screen.getByRole("button", { name: "Visualizar ata" })).toHaveClass("btn-success");
        });

        it("deve montar o data-qa dos botões a partir do dataQa informado", () => {
            renderComponent();
            expect(screen.getByRole("button", { name: "Gerar ata" })).toHaveAttribute(
                "data-qa",
                "modal-alterado-participantes-historico-btn-Gerar ata"
            );
            expect(screen.getByRole("button", { name: "Visualizar ata" })).toHaveAttribute(
                "data-qa",
                "modal-alterado-participantes-historico-btn-Visualizar ata"
            );
        });

        it("não deve exibir o botão de visualizar quando o texto não for informado", () => {
            renderComponent({ textoBotaoVisualizar: undefined });
            expect(screen.getByRole("button", { name: "Gerar ata" })).toBeInTheDocument();
            expect(screen.queryByRole("button", { name: /visualizar/i })).not.toBeInTheDocument();
        });

        it("não deve exibir o botão de visualizar quando a ação não for informada", () => {
            renderComponent({ onClickVisualizarAta: undefined });
            expect(screen.queryByRole("button", { name: "Visualizar ata" })).not.toBeInTheDocument();
        });
    });

    describe("Habilitação do botão gerar ata", () => {
        it("deve habilitar o botão gerar ata quando btGerarDesabilitado for false", () => {
            renderComponent({ btGerarDesabilitado: false });
            expect(screen.getByRole("button", { name: "Gerar ata" })).toBeEnabled();
        });

        it("deve desabilitar o botão gerar ata quando btGerarDesabilitado for true", () => {
            renderComponent({ btGerarDesabilitado: true });
            expect(screen.getByRole("button", { name: "Gerar ata" })).toBeDisabled();
        });

        it("deve manter o botão de visualizar habilitado mesmo com gerar ata desabilitado", () => {
            renderComponent({ btGerarDesabilitado: true });
            expect(screen.getByRole("button", { name: "Visualizar ata" })).toBeEnabled();
        });
    });

    describe("Ações", () => {
        it("deve chamar onClickGerarAta ao clicar em gerar ata", () => {
            const { props } = renderComponent();
            fireEvent.click(screen.getByRole("button", { name: "Gerar ata" }));
            expect(props.onClickGerarAta).toHaveBeenCalledTimes(1);
            expect(props.onClickVisualizarAta).not.toHaveBeenCalled();
        });

        it("não deve chamar onClickGerarAta ao clicar em gerar ata desabilitado", () => {
            const { props } = renderComponent({ btGerarDesabilitado: true });
            fireEvent.click(screen.getByRole("button", { name: "Gerar ata" }));
            expect(props.onClickGerarAta).not.toHaveBeenCalled();
        });

        it("deve chamar onClickVisualizarAta ao clicar em visualizar ata", () => {
            const { props } = renderComponent();
            fireEvent.click(screen.getByRole("button", { name: "Visualizar ata" }));
            expect(props.onClickVisualizarAta).toHaveBeenCalledTimes(1);
            expect(props.onClickGerarAta).not.toHaveBeenCalled();
        });

        it("deve chamar handleClose ao pressionar Escape", () => {
            const { props } = renderComponent();
            fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape", code: "Escape", keyCode: 27 });
            expect(props.handleClose).toHaveBeenCalledTimes(1);
        });

        it("não deve quebrar ao clicar em gerar ata sem onClickGerarAta informado", () => {
            renderComponent({ onClickGerarAta: undefined });
            expect(() => fireEvent.click(screen.getByRole("button", { name: "Gerar ata" }))).not.toThrow();
        });
    });
});
