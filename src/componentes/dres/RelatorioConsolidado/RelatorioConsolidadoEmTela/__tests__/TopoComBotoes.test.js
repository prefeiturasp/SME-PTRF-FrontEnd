import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { TopoComBotoes } from "../TopoComBotoes";

describe("TopoComBotoes (Em tela)", () => {
    const originalLocation = window.location;
    let assign;
    beforeEach(() => {
        assign = jest.fn();
        delete window.location;
        window.location = { assign };
    });
    afterEach(() => {
        window.location = originalLocation;
    });

    it("exibe prévia e referência", () => {
        render(<TopoComBotoes periodoNome="2024.1" ePrevia={true} referencia="Parcial 1" />);
        expect(screen.getByText("Período: 2024.1 (Prévia)")).toBeInTheDocument();
        expect(screen.getByText("Parcial 1")).toBeInTheDocument();
    });

    it("não exibe prévia quando publicado", () => {
        render(<TopoComBotoes periodoNome="2024.1" ePrevia={false} referencia="x" />);
        expect(screen.queryByText(/Prévia/)).not.toBeInTheDocument();
    });

    it("volta para a lista", () => {
        render(<TopoComBotoes periodoNome="2024.1" ePrevia={false} referencia="x" />);
        fireEvent.click(screen.getByRole("button", { name: "Voltar" }));
        expect(assign).toHaveBeenCalledWith("/dre-relatorio-consolidado");
    });
});
