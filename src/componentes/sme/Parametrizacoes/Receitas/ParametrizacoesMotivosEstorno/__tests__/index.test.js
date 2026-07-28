import React from "react";
import { render, screen } from "@testing-library/react";
import { ParametrizacoesMotivosDeEstorno } from "../index";

jest.mock("../context/MotivosEstorno", () => ({
    MotivosEstornoProvider: ({ children }) => (
        <div data-testid="motivos-estorno-provider">{children}</div>
    ),
}));

jest.mock("../../../../../../paginas/PaginasContainer", () => ({
    PaginasContainer: ({ children }) => (
        <div data-testid="paginas-container">{children}</div>
    ),
}));

jest.mock("../../../componentes/AbasPorRecurso", () => ({
    AbasPorRecurso: () => (
        <div data-testid="abas-por-recurso">AbasPorRecurso</div>
    ),
}));

jest.mock("../components/TopoComBotoes", () => ({
    TopoComBotoes: () => (
        <div data-testid="topo-com-botoes">TopoComBotoes</div>
    ),
}));

jest.mock("../components/Filtro", () => ({
    Filtro: () => <div data-testid="filtro">Filtro</div>,
}));

jest.mock("../components/Lista", () => ({
    Lista: () => <div data-testid="lista">Lista</div>,
}));

describe("ParametrizacoesMotivosDeEstorno", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar o titulo da pagina", () => {
        render(<ParametrizacoesMotivosDeEstorno />);

        expect(
            screen.getByRole("heading", { name: "Motivos de estorno" }),
        ).toBeInTheDocument();
    });

    it("deve renderizar a estrutura principal da pagina", () => {
        render(<ParametrizacoesMotivosDeEstorno />);

        expect(screen.getByTestId("motivos-estorno-provider")).toBeInTheDocument();
        expect(screen.getByTestId("paginas-container")).toBeInTheDocument();
        expect(screen.getByTestId("abas-por-recurso")).toBeInTheDocument();
        expect(screen.getByTestId("topo-com-botoes")).toBeInTheDocument();
        expect(screen.getByTestId("filtro")).toBeInTheDocument();
        expect(screen.getByTestId("lista")).toBeInTheDocument();
    });
});
