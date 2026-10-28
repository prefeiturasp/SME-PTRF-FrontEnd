import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import {useParams} from "react-router-dom";

import {VisualizacaoDaAtaParecerTecnico} from "../index";
import {
    getAtaParecerTecnico,
    getInfoContas,
} from "../../../../../../services/dres/AtasParecerTecnico.service";
import {getConsolidadoDrePorUuidAtaDeParecerTecnico} from "../../../../../../services/dres/RelatorioConsolidado.service";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
}));

jest.mock("../../../../../../services/dres/AtasParecerTecnico.service", () => ({
    getAtaParecerTecnico: jest.fn(),
    getInfoContas: jest.fn(),
    getDownloadAtaParecerTecnico: jest.fn(),
}));

jest.mock("../../../../../../services/dres/RelatorioConsolidado.service", () => ({
    getConsolidadoDrePorUuidAtaDeParecerTecnico: jest.fn(),
}));

jest.mock("../../../../../../utils/Loading", () => () => <div data-testid="loading">Carregando...</div>);

let mockFormatador = null;

jest.mock("../TopoComBotoes", () => ({
    TopoComBotoes: ({retornaDadosAtaFormatado}) => {
        mockFormatador = retornaDadosAtaFormatado;
        return <div data-testid="topo" />;
    },
}));
jest.mock("../TextoDinamicoSuperior", () => ({
    TextoDinamicoSuperior: () => <div data-testid="texto" />,
}));
jest.mock("../TabelaAprovadas", () => ({
    TabelaAprovadas: ({status}) => <div data-testid={`tabela-${status}`} />,
}));
jest.mock("../Assinaturas", () => ({
    Assinaturas: () => <div data-testid="assinaturas" />,
}));

describe("VisualizacaoDaAtaParecerTecnico - complementar", () => {
    const base = {
        uuid: "uuid-ata",
        versao: "FINAL",
        dre: {uuid: "dre-1", nome: "Butantã"},
        periodo: {uuid: "per-1"},
    };

    const renderiza = async (dados, info = {}) => {
        getAtaParecerTecnico.mockResolvedValue(dados);
        getInfoContas.mockResolvedValue(info);
        render(<VisualizacaoDaAtaParecerTecnico />);
        await waitFor(() => expect(screen.getByTestId("topo")).toBeInTheDocument());
    };

    beforeEach(() => {
        mockFormatador = null;
        useParams.mockReturnValue({uuid_ata: "uuid-ata", ja_publicado: "false"});
        getConsolidadoDrePorUuidAtaDeParecerTecnico.mockResolvedValue(false);
    });

    it("retorna placeholder quando não há data da reunião", async () => {
        await renderiza({...base, hora_reuniao: "10:15"});
        expect(mockFormatador("data_reuniao")).toBe("___ dias do mês de ___ de ___");
    });

    it("usa 'No primeiro dia' quando o dia é 1", async () => {
        await renderiza({...base, hora_reuniao: "10:15", data_reuniao: "2026-08-01"});
        expect(mockFormatador("data_reuniao")).toMatch(/^No primeiro dia do mês de agosto/);
    });

    it("usa 'Aos ... dias' para dias diferentes de 1", async () => {
        await renderiza({...base, hora_reuniao: "10:15", data_reuniao: "2026-08-19"});
        expect(mockFormatador("data_reuniao")).toMatch(/^Aos .* dias do mês de agosto/);
    });

    it("formata hora no singular (01:01)", async () => {
        await renderiza({...base, hora_reuniao: "01:01"});
        expect(mockFormatador("hora_reuniao")).toBe("uma hora e um minuto");
    });

    it("formata hora no singular quando 00 e minuto zero", async () => {
        await renderiza({...base, hora_reuniao: "00:00"});
        expect(mockFormatador("hora_reuniao")).toMatch(/hora$/);
    });

    it("formata hora com minutos no plural e minuto zero omitido", async () => {
        await renderiza({...base, hora_reuniao: "02:30"});
        expect(mockFormatador("hora_reuniao")).toBe("duas horas e trinta minutos");
    });

    it("formata hora cheia no plural sem minutos", async () => {
        await renderiza({...base, hora_reuniao: "14:00"});
        expect(mockFormatador("hora_reuniao")).toBe("quatorze horas");
    });

    it("formata datas de realização de despesas quando existem", async () => {
        await renderiza({
            ...base,
            periodo: {uuid: "per-1", data_inicio_realizacao_despesas: "2026-08-01", data_fim_realizacao_despesas: "2026-08-15"},
        });
        expect(mockFormatador("periodo.data_inicio_realizacao_despesas")).toMatch(/^\d{2}\/08\/2026$/);
        expect(mockFormatador("periodo.data_fim_realizacao_despesas")).toMatch(/^\d{2}\/08\/2026$/);
    });

    it("retorna string vazia quando datas de realização de despesas são nulas", async () => {
        await renderiza({
            ...base,
            periodo: {uuid: "per-1", data_inicio_realizacao_despesas: null, data_fim_realizacao_despesas: null},
        });
        expect(mockFormatador("periodo.data_inicio_realizacao_despesas")).toBe("");
        expect(mockFormatador("periodo.data_fim_realizacao_despesas")).toBe("");
    });

    it("retorna portaria_publicada e undefined para campo desconhecido", async () => {
        await renderiza({...base, portaria_publicada: "de 01/01/2026"});
        expect(mockFormatador("portaria_publicada")).toBe("de 01/01/2026");
        expect(mockFormatador("campo_inexistente")).toBeUndefined();
    });

    it("retorna vazio para numero_ata sem número/ano e placeholders de portaria", async () => {
        await renderiza({...base});
        expect(mockFormatador("numero_ata")).toBe("");
        expect(mockFormatador("numero_portaria")).toBe("_______");
        expect(mockFormatador("data_portaria")).toBe("__________");
    });

    it("mantém nome da DRE sem prefixo em maiúsculas", async () => {
        await renderiza({...base});
        expect(mockFormatador("nome_dre")).toBe("BUTANTÃ");
    });

    it("não renderiza tabelas, comentários nem assinaturas quando ausentes e exibe a prévia", async () => {
        await renderiza({...base, versao: "PREVIA"}, {});
        expect(screen.queryByTestId("tabela-aprovadas")).not.toBeInTheDocument();
        expect(screen.queryByTestId("tabela-aprovadas_ressalva")).not.toBeInTheDocument();
        expect(screen.queryByTestId("tabela-reprovadas")).not.toBeInTheDocument();
        expect(screen.queryByTestId("assinaturas")).not.toBeInTheDocument();
        expect(screen.queryByText("Comentários")).not.toBeInTheDocument();
    });

    it("não consulta consolidado nem contas sem uuid_ata/dados", async () => {
        useParams.mockReturnValue({uuid_ata: undefined, ja_publicado: "false"});
        getAtaParecerTecnico.mockResolvedValue({});
        render(<VisualizacaoDaAtaParecerTecnico />);
        await waitFor(() => expect(getAtaParecerTecnico).toHaveBeenCalled());
        expect(getConsolidadoDrePorUuidAtaDeParecerTecnico).not.toHaveBeenCalled();
        expect(getInfoContas).not.toHaveBeenCalled();
        expect(screen.getByTestId("loading")).toBeInTheDocument();
    });
});
