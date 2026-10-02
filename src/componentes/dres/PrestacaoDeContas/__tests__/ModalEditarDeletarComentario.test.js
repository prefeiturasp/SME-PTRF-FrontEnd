import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalEditarDeletarComentario } from "../ModalEditarDeletarComentario";

describe("ModalEditarDeletarComentario", () => {
    const comentario = { uuid: "c1", comentario: "Comentário de teste" };

    const props = {
        show: true,
        handleClose: jest.fn(),
        titulo: "Editar comentário",
        primeiroBotaoTexto: "Cancelar",
        primeiroBotaoCss: "outline-success",
        segundoBotaoCss: "success",
        segundoBotaoTexto: "Salvar",
        comentario,
        onChangeComentario: jest.fn(),
        setShowModalDeleteComentario: jest.fn(),
        onEditarComentario: jest.fn(),
        onVoltarParaAnalise: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar o modal quando show for true, com o título e o texto do comentário", () => {
        render(<ModalEditarDeletarComentario {...props} />);
        expect(screen.getByText("Editar comentário")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Comentário de teste")).toBeInTheDocument();
    });

    it("não deve renderizar o corpo do modal quando show for false", () => {
        render(<ModalEditarDeletarComentario {...props} show={false} />);
        expect(screen.queryByText("Editar comentário")).not.toBeInTheDocument();
    });

    it("deve chamar onChangeComentario com o novo valor e o comentário ao digitar na textarea", () => {
        render(<ModalEditarDeletarComentario {...props} />);
        fireEvent.change(screen.getByDisplayValue("Comentário de teste"), {
            target: { value: "Novo texto do comentário" },
        });
        expect(props.onChangeComentario).toHaveBeenCalledWith("Novo texto do comentário", comentario);
    });

    it("deve chamar setShowModalDeleteComentario(true) ao clicar em Apagar", () => {
        render(<ModalEditarDeletarComentario {...props} />);
        fireEvent.click(screen.getByText("Apagar"));
        expect(props.setShowModalDeleteComentario).toHaveBeenCalledWith(true);
    });

    it("deve chamar handleClose ao clicar em Cancelar", () => {
        render(<ModalEditarDeletarComentario {...props} />);
        fireEvent.click(screen.getByText("Cancelar"));
        expect(props.handleClose).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onEditarComentario ao clicar em Salvar", () => {
        render(<ModalEditarDeletarComentario {...props} />);
        fireEvent.click(screen.getByText("Salvar"));
        expect(props.onEditarComentario).toHaveBeenCalledTimes(1);
    });
});
