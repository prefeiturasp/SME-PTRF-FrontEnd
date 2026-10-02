import { render, screen } from "@testing-library/react";

import { CargosTimeline } from "../CargosTimeline";

describe("CargosTimeline", () => {
    it("renderiza o título da seção e um rótulo por cargo", () => {
        const cargos = [
            { cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA", cargo_associacao_label: "Presidente" },
            { cargo_associacao: "TESOUREIRO", cargo_associacao_label: "Tesoureiro" },
        ];

        render(<CargosTimeline cargos={cargos} secao="Diretoria executiva" />);

        expect(screen.getByText("Diretoria executiva")).toBeInTheDocument();
        expect(screen.getByText("Presidente")).toBeInTheDocument();
        expect(screen.getByText("Tesoureiro")).toBeInTheDocument();
    });

    it("usa o rótulo do cargo como title (tooltip) do elemento", () => {
        const cargos = [{ cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA", cargo_associacao_label: "Presidente" }];

        render(<CargosTimeline cargos={cargos} secao="Diretoria executiva" />);

        expect(screen.getByTitle("Presidente")).toHaveClass("timeline-rotulo-cargo");
    });

    it("renderiza apenas o título da seção quando não há cargos", () => {
        render(<CargosTimeline cargos={[]} secao="Conselho Fiscal" />);

        expect(screen.getByText("Conselho Fiscal")).toBeInTheDocument();
        expect(document.querySelectorAll(".timeline-rotulo-cargo")).toHaveLength(0);
    });
});
