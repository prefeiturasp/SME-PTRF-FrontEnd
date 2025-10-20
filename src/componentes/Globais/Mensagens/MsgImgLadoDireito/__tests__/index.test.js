import React from "react";
import { render, screen } from "@testing-library/react";
import { MsgImgLadoDireito } from "../index";

describe("MsgImgLadoDireito", () => {
    it("renderiza o texto da mensagem", () => {
        render(<MsgImgLadoDireito texto="Mensagem de teste" img="test.svg" />);
        expect(screen.getByText("Mensagem de teste")).toBeInTheDocument();
    });

    it("renderiza a imagem com src correto", () => {
        const { container } = render(<MsgImgLadoDireito texto="Texto" img="imagem.png" />);
        const img = container.querySelector("img");
        expect(img).toHaveAttribute("src", "imagem.png");
    });

    it("renderiza com classes corretas", () => {
        const { container } = render(<MsgImgLadoDireito texto="Mensagem" img="img.svg" />);
        expect(container.querySelector(".texto-404")).toBeInTheDocument();
        expect(container.querySelector(".container-404")).toBeInTheDocument();
    });

    it("renderiza layout em duas colunas", () => {
        const { container } = render(<MsgImgLadoDireito texto="Texto" img="img.svg" />);
        const colunas = container.querySelectorAll(".col-lg-6");
        expect(colunas.length).toBe(2);
    });

    it("renderiza imagem com classe img-fluid", () => {
        const { container } = render(<MsgImgLadoDireito texto="Texto" img="img.svg" />);
        const img = container.querySelector(".img-fluid");
        expect(img).toBeInTheDocument();
    });
});

