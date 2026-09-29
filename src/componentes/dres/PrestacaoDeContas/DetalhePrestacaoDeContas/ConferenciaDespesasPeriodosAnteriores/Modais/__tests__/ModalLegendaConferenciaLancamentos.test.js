import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalLegendaConferenciaLancamentos } from "../ModalLegendaConferenciaLancamentos";
import { getTagsConferenciaLancamento } from "../../../../../../../services/dres/PrestacaoDeContas.service";

jest.mock("../../../../../../../services/dres/PrestacaoDeContas.service", () => ({
    getTagsConferenciaLancamento: jest.fn(),
}));

describe("ModalLegendaConferenciaLancamentos", () => {
    const props = {
        show: true,
        onHide: jest.fn(),
        titulo: "Legenda de conferência",
        primeiroBotaoTexto: "Fechar",
        primeiroBotaoCss: "info",
        primeiroBotaoOnclick: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getTagsConferenciaLancamento.mockResolvedValue([]);
    });

    it("deve exibir o título enquanto os dados são carregados", () => {
        getTagsConferenciaLancamento.mockReturnValue(new Promise(() => {}));
        render(<ModalLegendaConferenciaLancamentos {...props} />);
        expect(screen.getByText("Legenda de conferência")).toBeInTheDocument();
    });

    it("deve exibir mensagem de 'Nenhuma informação encontrada' quando a lista vier vazia", async () => {
        getTagsConferenciaLancamento.mockResolvedValue([]);
        render(<ModalLegendaConferenciaLancamentos {...props} />);
        expect(await screen.findByText("Nenhuma informação encontrada")).toBeInTheDocument();
    });

    it("deve exibir as tags de conferência retornadas pelo serviço, incluindo o ícone de conferido automaticamente", async () => {
        getTagsConferenciaLancamento.mockResolvedValue([
            { id: 1, descricao: "Lançamento com pendência" },
            { id: 2, descricao: "Lançamento conferido" },
            { id: 3, descricao: "Lançamento conferido automaticamente" },
            { id: 4, descricao: "Lançamento não conferido" },
        ]);
        render(<ModalLegendaConferenciaLancamentos {...props} />);

        expect(await screen.findByText("Lançamento com pendência")).toBeInTheDocument();
        expect(screen.getByText("Lançamento conferido")).toBeInTheDocument();
        expect(screen.getByText("Lançamento conferido automaticamente")).toBeInTheDocument();
        expect(screen.getByText("Lançamento não conferido")).toBeInTheDocument();
    });

    it("não deve quebrar quando o serviço falha", async () => {
        getTagsConferenciaLancamento.mockRejectedValue(new Error("erro"));
        render(<ModalLegendaConferenciaLancamentos {...props} />);
        expect(await screen.findByText("Nenhuma informação encontrada")).toBeInTheDocument();
    });

    it("deve chamar primeiroBotaoOnclick ao clicar no botão", async () => {
        getTagsConferenciaLancamento.mockResolvedValue([]);
        render(<ModalLegendaConferenciaLancamentos {...props} />);
        await screen.findByText("Nenhuma informação encontrada");
        fireEvent.click(screen.getByText("Fechar"));
        expect(props.primeiroBotaoOnclick).toHaveBeenCalledTimes(1);
    });
});
