import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TextoExplicativo } from "../TextoExplicativoDaPagina";
import { geTextoExplicativoSuporteUnidades } from "../../../../services/SuporteAsUnidades.service";

jest.mock("../../../../services/SuporteAsUnidades.service", () => ({
    geTextoExplicativoSuporteUnidades: jest.fn(),
}));

describe("TextoExplicativo", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        console.log.mockRestore();
    });

    it("deve buscar o texto explicativo utilizando a visao recebida", async () => {
        geTextoExplicativoSuporteUnidades.mockResolvedValue({ detail: "<p>Texto</p>" });

        render(<TextoExplicativo visao="UE" />);

        await waitFor(() =>
            expect(geTextoExplicativoSuporteUnidades).toHaveBeenCalledWith("UE")
        );
    });

    it("deve renderizar o texto explicativo retornado pelo serviço", async () => {
        geTextoExplicativoSuporteUnidades.mockResolvedValue({
            detail: "<p>Texto explicativo de teste</p>",
        });

        const { container } = render(<TextoExplicativo visao="DRE" />);

        await waitFor(() =>
            expect(container.querySelector("p")).toHaveTextContent("Texto explicativo de teste")
        );
    });

    it("deve renderizar vazio inicialmente antes da resolução da promise", () => {
        geTextoExplicativoSuporteUnidades.mockReturnValue(new Promise(() => {}));

        const { container } = render(<TextoExplicativo visao="UE" />);

        const conteudo = container.querySelector(".container-texto-explicativo > div");
        expect(conteudo).toBeEmptyDOMElement();
    });

    it("deve logar o erro no console quando a busca falhar", async () => {
        const erro = new Error("Falha ao buscar texto");
        geTextoExplicativoSuporteUnidades.mockRejectedValue(erro);

        render(<TextoExplicativo visao="UE" />);

        await waitFor(() => expect(console.log).toHaveBeenCalledWith(erro));
    });

    it("não deve quebrar a renderização quando a busca falhar", async () => {
        geTextoExplicativoSuporteUnidades.mockRejectedValue(new Error("Falha"));

        render(<TextoExplicativo visao="UE" />);

        await waitFor(() => expect(console.log).toHaveBeenCalled());
        expect(screen.queryByText("Texto")).not.toBeInTheDocument();
    });
});
