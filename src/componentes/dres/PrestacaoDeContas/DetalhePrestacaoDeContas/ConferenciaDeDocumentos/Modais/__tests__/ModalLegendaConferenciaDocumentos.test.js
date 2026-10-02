import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ModalLegendaConferenciaDocumentos } from "../ModalLegendaConferenciaDocumentos";
import { getTagsConferenciaDocumento } from "../../../../../../../services/dres/PrestacaoDeContas.service";

jest.mock("../../../../../../../services/dres/PrestacaoDeContas.service", () => ({
    getTagsConferenciaDocumento: jest.fn(),
}));

describe("ModalLegendaConferenciaDocumentos", () => {
    const props = {
        show: true,
        onHide: jest.fn(),
        titulo: "Legenda",
        primeiroBotaoTexto: "Fechar",
        primeiroBotaoCss: "info",
        primeiroBotaoOnclick: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getTagsConferenciaDocumento.mockResolvedValue([]);
    });

    it("deve exibir o loading enquanto os dados são carregados", () => {
        getTagsConferenciaDocumento.mockReturnValue(new Promise(() => {}));
        render(<ModalLegendaConferenciaDocumentos {...props} />);
        expect(screen.getByText("Legenda")).toBeInTheDocument();
    });

    it("deve exibir mensagem de 'Nenhuma informação encontrada' quando a lista vier vazia", async () => {
        getTagsConferenciaDocumento.mockResolvedValue([]);
        render(<ModalLegendaConferenciaDocumentos {...props} />);
        expect(await screen.findByText("Nenhuma informação encontrada")).toBeInTheDocument();
    });

    it("deve exibir as tags de conferência retornadas pelo serviço", async () => {
        getTagsConferenciaDocumento.mockResolvedValue([
            { id: 1, descricao: "Documento com pendência" },
            { id: 2, descricao: "Documento conferido" },
            { id: 3, descricao: "Documento não conferido" },
        ]);
        render(<ModalLegendaConferenciaDocumentos {...props} />);

        expect(await screen.findByText("Documento com pendência")).toBeInTheDocument();
        expect(screen.getByText("Documento conferido")).toBeInTheDocument();
        expect(screen.getByText("Documento não conferido")).toBeInTheDocument();
    });

    it("não deve quebrar quando o serviço falha", async () => {
        getTagsConferenciaDocumento.mockRejectedValue(new Error("erro"));
        render(<ModalLegendaConferenciaDocumentos {...props} />);
        expect(await screen.findByText("Nenhuma informação encontrada")).toBeInTheDocument();
    });

    it("deve chamar primeiroBotaoOnclick ao clicar no botão", async () => {
        getTagsConferenciaDocumento.mockResolvedValue([]);
        render(<ModalLegendaConferenciaDocumentos {...props} />);
        await waitFor(() => screen.getByText("Nenhuma informação encontrada"));
        fireEvent.click(screen.getByText("Fechar"));
        expect(props.primeiroBotaoOnclick).toHaveBeenCalledTimes(1);
    });
});
