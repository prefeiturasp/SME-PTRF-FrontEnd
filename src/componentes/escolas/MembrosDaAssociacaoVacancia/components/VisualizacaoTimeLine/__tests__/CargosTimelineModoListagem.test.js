import { render, screen } from "@testing-library/react";

import { CargosTimelineModoListagem } from "../CargosTimelineModoListagem";

describe("CargosTimelineModoListagem", () => {
    beforeEach(() => {
        // Row/Col do antd registram um observer baseado em window.matchMedia no mount
        window.matchMedia = jest.fn().mockImplementation(() => ({
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn(),
        }));
    });

    it("renderiza o título da seção e o nome do ocupante de cada cargo", () => {
        const cargos = [
            { cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA", cargo_associacao_label: "Presidente", nomeOuVago: "Maria Silva" },
            { cargo_associacao: "TESOUREIRO", cargo_associacao_label: "Tesoureiro", nomeOuVago: "Vago" },
        ];

        render(<CargosTimelineModoListagem cargos={cargos} secao="Diretoria executiva" />);

        expect(screen.getByText("Diretoria executiva")).toBeInTheDocument();
        expect(screen.getByText("Presidente")).toBeInTheDocument();
        expect(screen.getByText("Maria Silva")).toBeInTheDocument();
        expect(screen.getByText("Tesoureiro")).toBeInTheDocument();
        expect(screen.getByText("Vago")).toBeInTheDocument();
    });

    it("destaca 'Vago' com a classe text-muted/font-weight-bold e um nome real apenas com font-weight-bold", () => {
        const cargos = [
            { cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA", cargo_associacao_label: "Presidente", nomeOuVago: "Maria Silva" },
            { cargo_associacao: "TESOUREIRO", cargo_associacao_label: "Tesoureiro", nomeOuVago: "Vago" },
        ];

        render(<CargosTimelineModoListagem cargos={cargos} secao="Diretoria executiva" />);

        expect(screen.getByText("Maria Silva")).toHaveClass("font-weight-bold");
        expect(screen.getByText("Maria Silva")).not.toHaveClass("text-muted");
        expect(screen.getByText("Vago")).toHaveClass("text-muted", "font-weight-bold");
    });

    it("renderiza apenas o título da seção quando não há cargos", () => {
        render(<CargosTimelineModoListagem cargos={[]} secao="Conselho Fiscal" />);

        expect(screen.getByText("Conselho Fiscal")).toBeInTheDocument();
        expect(document.querySelectorAll(".linha-composicao-data")).toHaveLength(0);
    });
});
