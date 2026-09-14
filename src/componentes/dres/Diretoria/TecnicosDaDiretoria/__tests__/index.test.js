import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TecnicosDaDiretoria } from "../index";

jest.mock("../../../../Globais/MenuInterno", () => ({
    MenuInterno: () => <div>MenuInterno</div>,
}));

jest.mock("../CadastroTecnicosDre", () => ({
    CadastroTecnicosDre: ({ dadosDaDre }) => (
        <div data-testid="cadastro-tecnicos-dre">{dadosDaDre.nome}</div>
    ),
}));

jest.mock("../../../../../services/dres/Unidades.service", () => ({
    getUnidade: jest.fn(),
}));

jest.mock("../../../../../utils/Loading", () => () => <div>Loading...</div>);

const { getUnidade } = require("../../../../../services/dres/Unidades.service");

describe("TecnicosDaDiretoria", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("exibe loading enquanto busca a diretoria", () => {
        getUnidade.mockReturnValue(new Promise(() => {}));
        render(<TecnicosDaDiretoria />);
        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    it("não renderiza nada quando não há dados da diretoria após o carregamento", async () => {
        getUnidade.mockResolvedValue(null);
        render(<TecnicosDaDiretoria />);

        await waitFor(() => {
            expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
        });

        expect(screen.queryByText("MenuInterno")).not.toBeInTheDocument();
    });

    it("renderiza os dados da diretoria após o carregamento", async () => {
        getUnidade.mockResolvedValue({ uuid: "dre-1", nome: "DRE Teste" });
        render(<TecnicosDaDiretoria />);

        expect(
            await screen.findByText(/Técnicos da diretoria DRE Teste/i)
        ).toBeInTheDocument();
        expect(screen.getByText("MenuInterno")).toBeInTheDocument();
        expect(screen.getByTestId("cadastro-tecnicos-dre")).toHaveTextContent("DRE Teste");
    });
});
