import React from "react";
import { render, screen } from "@testing-library/react";
import Loading from "../Loading"

describe("Loading Component", () => {
    it("deve renderizar o componente corretamente", () => {
        render(<Loading corGrafico="blue" corFonte="dark" marginTop={3} marginBottom={3} />);

        expect(screen.getByText("Carregando...")).toBeInTheDocument();
    });

    it("deve exibir a mensagem padrão quando a prop mensagem não é informada", () => {
        render(<Loading corGrafico="blue" corFonte="dark" marginTop={3} marginBottom={3} />);

        expect(screen.getByText("Carregando...")).toBeInTheDocument();
        expect(screen.queryByText("Aguardando...")).not.toBeInTheDocument();
    });

    it("deve exibir a mensagem personalizada quando a prop mensagem é informada", () => {
        render(<Loading corGrafico="blue" corFonte="dark" marginTop={3} marginBottom={3} mensagem="Aguardando..." />);

        expect(screen.getByText("Aguardando...")).toBeInTheDocument();
        expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
    });

    it("deve aplicar a cor da fonte na mensagem", () => {
        render(<Loading corGrafico="blue" corFonte="dark" marginTop={3} marginBottom={3} mensagem="Aguardando..." />);

        expect(screen.getByText("Aguardando...")).toHaveClass("ml-n3", "text-dark");
    });

    it("deve aplicar as margens e o style no container", () => {
        const { container } = render(
            <Loading corGrafico="blue" corFonte="dark" marginTop={2} marginBottom={4} style={{ height: "100px" }} />
        );

        const wrapper = container.firstChild;
        expect(wrapper).toHaveClass("d-flex", "justify-content-center", "mt-2", "mb-4");
        expect(wrapper).toHaveStyle({ height: "100px" });
    });
});
