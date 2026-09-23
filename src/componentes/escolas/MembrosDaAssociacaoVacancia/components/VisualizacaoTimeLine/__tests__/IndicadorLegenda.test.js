import { render, screen } from "@testing-library/react";

import { IndicadorLegenda } from "../IndicadorLegenda";

describe("IndicadorLegenda", () => {
    it("exibe as três legendas com seus indicadores de cor", () => {
        render(<IndicadorLegenda />);

        expect(screen.getByText("Vigente")).toBeInTheDocument();
        expect(screen.getByText("Encerrado")).toBeInTheDocument();
        expect(screen.getByText("Vago")).toBeInTheDocument();

        expect(document.querySelector(".quadrado-legenda.seg-vigente")).toBeInTheDocument();
        expect(document.querySelector(".quadrado-legenda.seg-encerrado")).toBeInTheDocument();
        expect(document.querySelector(".quadrado-legenda.seg-vago")).toBeInTheDocument();
    });
});
