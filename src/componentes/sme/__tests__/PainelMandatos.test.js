import React from "react";
import { render, screen } from "@testing-library/react";
import { PainelMandatos } from "../PainelMandatos";
import { visoesService } from "../../../services/visoes.service";

jest.mock("../../../services/visoes.service", () => ({
    visoesService: { featureFlagAtiva: jest.fn() },
}));

jest.mock("../Mandatos", () => ({
    Mandatos: () => <div data-testid="mandatos-v1" />,
}));

jest.mock("../MandatosVacancia", () => ({
    MandatosVacancia: () => <div data-testid="mandatos-v2" />,
}));

describe("PainelMandatos", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar MandatosVacancia (v2) quando a flag estiver ativa", () => {
        visoesService.featureFlagAtiva.mockReturnValue(true);

        render(<PainelMandatos />);

        expect(screen.getByTestId("mandatos-v2")).toBeInTheDocument();
        expect(screen.queryByTestId("mandatos-v1")).not.toBeInTheDocument();
        expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith("historico-de-membros-v2");
    });

    it("deve renderizar Mandatos (v1) quando a flag estiver inativa", () => {
        visoesService.featureFlagAtiva.mockReturnValue(false);

        render(<PainelMandatos />);

        expect(screen.getByTestId("mandatos-v1")).toBeInTheDocument();
        expect(screen.queryByTestId("mandatos-v2")).not.toBeInTheDocument();
    });
});
