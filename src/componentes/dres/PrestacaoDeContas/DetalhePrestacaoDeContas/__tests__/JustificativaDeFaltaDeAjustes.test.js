import React from "react";
import { render, screen } from "@testing-library/react";
import JustificativaDeFaltaDeAjustes from "../JustificativaDeFaltaDeAjustes";

describe("JustificativaDeFaltaDeAjustes", () => {
    it("deve renderizar a justificativa quando prestacaoDeContas.justificativa_pendencia_realizacao estiver preenchida", () => {
        render(
            <JustificativaDeFaltaDeAjustes
                prestacaoDeContas={{ justificativa_pendencia_realizacao: "Não foi possível realizar os ajustes por motivo X." }}
            />
        );
        expect(screen.getByText("Justificativa de falta de ajustes da Associação:")).toBeInTheDocument();
        expect(screen.getByText("Não foi possível realizar os ajustes por motivo X.")).toBeInTheDocument();
    });

    it("não deve renderizar nada quando não houver justificativa", () => {
        const { container } = render(
            <JustificativaDeFaltaDeAjustes prestacaoDeContas={{}} />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it("não deve renderizar nada quando prestacaoDeContas não for informado", () => {
        const { container } = render(<JustificativaDeFaltaDeAjustes prestacaoDeContas={null} />);
        expect(container).toBeEmptyDOMElement();
    });
});
