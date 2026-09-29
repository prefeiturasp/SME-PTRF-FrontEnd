import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalLegendaInformacao } from "../ModalLegendaInformacao";
import { getTagInformacao } from "../../../../../../../services/escolas/Despesas.service";

jest.mock("../../../../../../../services/escolas/Despesas.service", () => ({
    getTagInformacao: jest.fn(),
}));

describe("ModalLegendaInformacao", () => {
    const props = {
        show: true,
        onHide: jest.fn(),
        titulo: "Legenda de informação",
        primeiroBotaoTexto: "Fechar",
        primeiroBotaoCss: "info",
        primeiroBotaoOnclick: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getTagInformacao.mockResolvedValue([]);
    });

    it("deve exibir o título enquanto os dados são carregados", () => {
        getTagInformacao.mockReturnValue(new Promise(() => {}));
        render(<ModalLegendaInformacao {...props} />);
        expect(screen.getByText("Legenda de informação")).toBeInTheDocument();
    });

    it("deve exibir mensagem de 'Nenhuma informação encontrada' quando a lista vier vazia", async () => {
        getTagInformacao.mockResolvedValue([]);
        render(<ModalLegendaInformacao {...props} />);
        expect(await screen.findByText("Nenhuma informação encontrada")).toBeInTheDocument();
    });

    it("deve exibir as tags de informação retornadas pelo serviço", async () => {
        getTagInformacao.mockResolvedValue([
            { id: 1, nome: "Tag 1", descricao: "Descrição da tag 1" },
            { id: 6, nome: "Tag 6", descricao: "Descrição da tag 6" },
        ]);
        render(<ModalLegendaInformacao {...props} />);

        expect(await screen.findByText("Tag 1")).toBeInTheDocument();
        expect(screen.getByText("Descrição da tag 1")).toBeInTheDocument();
        expect(screen.getByText("Tag 6")).toBeInTheDocument();
        expect(screen.getByText("Descrição da tag 6")).toBeInTheDocument();
    });

    it("não deve quebrar quando o serviço falha", async () => {
        getTagInformacao.mockRejectedValue(new Error("erro"));
        render(<ModalLegendaInformacao {...props} />);
        expect(await screen.findByText("Nenhuma informação encontrada")).toBeInTheDocument();
    });

    it("deve chamar primeiroBotaoOnclick ao clicar no botão", async () => {
        getTagInformacao.mockResolvedValue([]);
        render(<ModalLegendaInformacao {...props} />);
        await screen.findByText("Nenhuma informação encontrada");
        fireEvent.click(screen.getByText("Fechar"));
        expect(props.primeiroBotaoOnclick).toHaveBeenCalledTimes(1);
    });
});
