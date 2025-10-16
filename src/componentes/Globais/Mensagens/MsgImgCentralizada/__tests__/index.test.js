import React from "react";
import { render, screen } from "@testing-library/react";
import { MsgImgCentralizada } from "../index";

describe("MsgImgCentralizada", () => {
    it("renderiza o texto da mensagem", () => {
        render(<MsgImgCentralizada texto="Nenhum resultado encontrado" img="test.svg" />);
        expect(screen.getByText("Nenhum resultado encontrado")).toBeInTheDocument();
    });

    it("renderiza a imagem", () => {
        const { container } = render(<MsgImgCentralizada texto="Mensagem" img="imagem.svg" />);
        const img = container.querySelector("img");
        expect(img).toHaveAttribute("src", "imagem.svg");
    });

    it("renderiza com data-qa quando fornecido", () => {
        const { container } = render(<MsgImgCentralizada texto="Teste" img="test.svg" dataQa="teste-qa" />);
        const paragrafo = container.querySelector('[data-qa="p-msg-img-centralizada-teste-qa"]');
        expect(paragrafo).toBeInTheDocument();
    });

    it("renderiza sem data-qa quando não fornecido", () => {
        const { container } = render(<MsgImgCentralizada texto="Teste" img="test.svg" />);
        const paragrafo = container.querySelector('[data-qa="p-msg-img-centralizada-"]');
        expect(paragrafo).toBeInTheDocument();
    });

    it("renderiza com classes corretas", () => {
        const { container } = render(<MsgImgCentralizada texto="Mensagem" img="img.svg" />);
        expect(container.querySelector(".texto-404")).toBeInTheDocument();
        expect(container.querySelector(".container-404")).toBeInTheDocument();
    });
});

