import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { TopoComBotoes } from "../TopoComBotoes";

describe("TopoComBotoes (Dados das UEs)", () => {
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

    it("exibe período e conta", () => {
        render(<TopoComBotoes periodoNome="2024.1" contaNome="Cheque" periodo_uuid="p" conta_uuid="c" jaPublicado="false" />);
        expect(screen.getByText("Período 2024.1 | Conta Cheque")).toBeInTheDocument();
    });

    it("navega para a síntese ao clicar em voltar", () => {
        render(<TopoComBotoes periodoNome="2024.1" contaNome="Cheque" periodo_uuid="p1" conta_uuid="c1" jaPublicado="true" />);
        fireEvent.click(screen.getByRole("button", { name: /Voltar para síntese/i }));
        expect(assign).toHaveBeenCalledWith("/dre-relatorio-consolidado-apuracao/p1/c1/true");
    });
});
