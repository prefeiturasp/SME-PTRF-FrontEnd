import React from "react";
import { render, screen } from "@testing-library/react";
import { Tag } from "../index";

describe("Tag", () => {
    it("renderiza o componente com label padrão", () => {
        const { container } = render(<Tag />);
        const tag = container.querySelector(".custom-tag");
        expect(tag).toBeInTheDocument();
    });

    it("renderiza o componente com label customizado", () => {
        render(<Tag label="Teste" />);
        expect(screen.getByText("Teste")).toBeInTheDocument();
    });

    it("renderiza com cor padrão default", () => {
        const { container } = render(<Tag label="Default" />);
        const tagDiv = container.querySelector(".custom-tag-default");
        expect(tagDiv).toBeInTheDocument();
    });

    it("renderiza com cor customizada", () => {
        const { container } = render(<Tag label="Customizado" color="primary" />);
        const tagDiv = container.querySelector(".custom-tag-primary");
        expect(tagDiv).toBeInTheDocument();
    });

    it("renderiza com diferentes cores", () => {
        const { container: c1 } = render(<Tag label="Vermelho" color="danger" />);
        expect(c1.querySelector(".custom-tag-danger")).toBeInTheDocument();

        const { container: c2 } = render(<Tag label="Verde" color="success" />);
        expect(c2.querySelector(".custom-tag-success")).toBeInTheDocument();

        const { container: c3 } = render(<Tag label="Azul" color="info" />);
        expect(c3.querySelector(".custom-tag-info")).toBeInTheDocument();
    });

    it("renderiza span com o texto da label", () => {
        render(<Tag label="Texto do Span" />);
        const span = screen.getByText("Texto do Span");
        expect(span.tagName).toBe("SPAN");
    });
});

