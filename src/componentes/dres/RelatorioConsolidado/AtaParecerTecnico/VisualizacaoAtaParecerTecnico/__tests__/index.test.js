import React from "react";
import {render, screen, waitFor, fireEvent} from "@testing-library/react";
import {useParams} from "react-router-dom";

import {VisualizacaoDaAtaParecerTecnico} from "../index";

import {
    getAtaParecerTecnico,
    getInfoContas,
    getDownloadAtaParecerTecnico,
} from "../../../../../../services/dres/AtasParecerTecnico.service";

import {
    getConsolidadoDrePorUuidAtaDeParecerTecnico,
} from "../../../../../../services/dres/RelatorioConsolidado.service";

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

jest.mock("../../../../../../utils/Loading", () => {
    return function Loading() {
        return <div data-testid="loading">Carregando...</div>;
    };
});

jest.mock("../TopoComBotoes", () => ({
    TopoComBotoes: ({
        retornaDadosAtaFormatado,
        retornaTituloCabecalhoAta,
        handleClickFecharAtaParecerTecnico,
        handleClickEditarAta,
        downloadAtaParecerTecnico,
        jaPublicado,
    }) => (
        <div data-testid="topo-com-botoes">
            <span data-testid="titulo-cabecalho">
                {retornaTituloCabecalhoAta()}
            </span>

            <span data-testid="numero-ata">
                {retornaDadosAtaFormatado("numero_ata")}
            </span>

            <span data-testid="numero-portaria">
                {retornaDadosAtaFormatado("numero_portaria")}
            </span>

            <span data-testid="data-portaria">
                {retornaDadosAtaFormatado("data_portaria")}
            </span>

            <span data-testid="nome-dre">
                {retornaDadosAtaFormatado("nome_dre")}
            </span>

            <span data-testid="hora-reuniao">
                {retornaDadosAtaFormatado("hora_reuniao")}
            </span>

            <span data-testid="ja-publicado">
                {String(jaPublicado)}
            </span>

            <button onClick={handleClickFecharAtaParecerTecnico}>
                Fechar
            </button>

            <button onClick={handleClickEditarAta}>
                Editar
            </button>

            <button onClick={downloadAtaParecerTecnico}>
                Download
            </button>
        </div>
    ),
}));

jest.mock("../TextoDinamicoSuperior", () => ({
    TextoDinamicoSuperior: ({
        retornaTituloCorpoAta,
        retornaDadosAtaFormatado,
        ehPrevia,
        ehRetificacao,
        motivoRetificacao,
    }) => (
        <div data-testid="texto-dinamico-superior">
            <span data-testid="titulo-corpo">
                {retornaTituloCorpoAta()}
            </span>

            <span data-testid="data-reuniao">
                {retornaDadosAtaFormatado("data_reuniao")}
            </span>

            <span data-testid="eh-previa">
                {String(ehPrevia())}
            </span>

            <span data-testid="eh-retificacao">
                {String(ehRetificacao)}
            </span>

            <span data-testid="motivo-retificacao">
                {motivoRetificacao}
            </span>
        </div>
    ),
}));

jest.mock("../TabelaAprovadas", () => ({
    TabelaAprovadas: ({infoContas, status, exibirUltimoItem}) => (
        <div data-testid={`tabela-${status}`}>
            <span>{JSON.stringify(infoContas)}</span>
            <span>{String(exibirUltimoItem)}</span>
        </div>
    ),
}));

jest.mock("../Assinaturas", () => ({
    Assinaturas: ({data_assinatura, presentes_na_ata}) => (
        <div data-testid="assinaturas">
            <span>{data_assinatura}</span>
            <span>{JSON.stringify(presentes_na_ata)}</span>
        </div>
    ),
}));

describe("VisualizacaoDaAtaParecerTecnico", () => {
    const dadosAta = {
        uuid: "uuid-ata",
        versao: "FINAL",
        numero_ata: "123",
        numero_portaria: "456",
        data_portaria: "2026-08-10",
        data_reuniao: "2026-08-19",
        hora_reuniao: "14:30",
        eh_retificacao: true,
        motivo_retificacao: "Correção de dados",
        portaria_publicada: "de __/__/____",
        comentarios: "Comentário da ata",
        presentes_na_ata: [
            {
                nome: "João da Silva",
            },
        ],
        dre: {
            uuid: "uuid-dre",
            nome: "DIRETORIA REGIONAL DE EDUCACAO POA",
        },
        periodo: {
            uuid: "uuid-periodo",
            data_inicio_realizacao_despesas: "2026-08-01",
            data_fim_realizacao_despesas: "2026-08-15",
        },
    };

    const infoContas = {
        aprovadas: [
            {
                uuid: "aprovada-1",
            },
        ],
        aprovadas_ressalva: [
            {
                uuid: "ressalva-1",
            },
        ],
        reprovadas: [
            {
                uuid: "reprovada-1",
            },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();

        useParams.mockReturnValue({
            uuid_ata: "uuid-ata",
            ja_publicado: "false",
        });

        getAtaParecerTecnico.mockResolvedValue(dadosAta);
        getInfoContas.mockResolvedValue(infoContas);
        getConsolidadoDrePorUuidAtaDeParecerTecnico.mockResolvedValue(false);
        getDownloadAtaParecerTecnico.mockResolvedValue();
    });

    it("deve exibir o loading enquanto os dados não foram carregados", () => {
        getAtaParecerTecnico.mockReturnValue(new Promise(() => {}));

        render(<VisualizacaoDaAtaParecerTecnico />);

        expect(screen.getByTestId("loading")).toBeInTheDocument();
    });

    it("deve buscar os dados da ata ao montar o componente", async () => {
        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(getAtaParecerTecnico).toHaveBeenCalledWith("uuid-ata");
        });
    });

    it("deve buscar o consolidado DRE pelo uuid da ata", async () => {
        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(
                getConsolidadoDrePorUuidAtaDeParecerTecnico
            ).toHaveBeenCalledWith("uuid-ata");
        });
    });

    it("deve buscar as informações das contas depois de carregar a ata", async () => {
        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(getInfoContas).toHaveBeenCalledWith(
                "uuid-dre",
                "uuid-periodo",
                "uuid-ata"
            );
        });
    });

    it("deve remover 'DIRETORIA REGIONAL DE EDUCACAO' do nome da DRE", async () => {
        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(screen.getByTestId("nome-dre")).toHaveTextContent("POA");
        });
    });

    it("deve exibir o título de visualização da ata", async () => {
        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(
                screen.getByTestId("titulo-cabecalho")
            ).toHaveTextContent("Visualização da ata");
        });
    });

    it("deve exibir o título correto para uma ata normal", async () => {
        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(
                screen.getByTestId("titulo-corpo")
            ).toHaveTextContent(
                "ATA DE PARECER TÉCNICO CONCLUSIVO"
            );
        });
    });

    it("deve identificar uma ata como prévia", async () => {
        getAtaParecerTecnico.mockResolvedValue({
            ...dadosAta,
            versao: "PREVIA",
        });

        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(screen.getByTestId("eh-previa"))
                .toHaveTextContent("true");

            expect(screen.getByTestId("titulo-cabecalho"))
                .toHaveTextContent("Visualização da prévia da ata");

            expect(screen.getByTestId("titulo-corpo"))
                .toHaveTextContent(
                    "PRÉVIA DA ATA DE PARECER TÉCNICO CONCLUSIVO"
                );
        });
    });

    it("deve passar corretamente as informações de retificação", async () => {
        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(screen.getByTestId("eh-retificacao"))
                .toHaveTextContent("true");

            expect(screen.getByTestId("motivo-retificacao"))
                .toHaveTextContent("Correção de dados");
        });
    });

    it("deve renderizar a tabela de contas aprovadas", async () => {
        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(
                screen.getByTestId("tabela-aprovadas")
            ).toBeInTheDocument();
        });

        expect(
            screen.getByTestId("tabela-aprovadas")
        ).toHaveTextContent("aprovada-1");

        expect(
            screen.getByTestId("tabela-aprovadas")
        ).toHaveTextContent("false");
    });

    it("deve renderizar a tabela de contas aprovadas com ressalva", async () => {
        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(
                screen.getByTestId("tabela-aprovadas_ressalva")
            ).toBeInTheDocument();
        });

        expect(
            screen.getByTestId("tabela-aprovadas_ressalva")
        ).toHaveTextContent("ressalva-1");

        expect(
            screen.getByTestId("tabela-aprovadas_ressalva")
        ).toHaveTextContent("false");
    });

    it("deve renderizar a tabela de contas reprovadas", async () => {
        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(
                screen.getByTestId("tabela-reprovadas")
            ).toBeInTheDocument();
        });

        expect(
            screen.getByTestId("tabela-reprovadas")
        ).toHaveTextContent("reprovada-1");

        expect(
            screen.getByTestId("tabela-reprovadas")
        ).toHaveTextContent("true");
    });

    it("deve renderizar os comentários quando existirem", async () => {
        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(screen.getByText("Comentários")).toBeInTheDocument();
        });

        expect(
            screen.getByText("Comentário da ata")
        ).toBeInTheDocument();
    });

    it("não deve renderizar comentários quando não existirem", async () => {
        getAtaParecerTecnico.mockResolvedValue({
            ...dadosAta,
            comentarios: "",
        });

        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(
                screen.getByTestId("topo-com-botoes")
            ).toBeInTheDocument();
        });

        expect(screen.queryByText("Comentários")).not.toBeInTheDocument();
    });

    it("deve renderizar as assinaturas quando houver presentes na ata", async () => {
        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(screen.getByTestId("assinaturas")).toBeInTheDocument();
        });

        expect(screen.getByTestId("assinaturas"))
            .toHaveTextContent("João da Silva");
    });


    it("deve exibir o número da ata com o ano da reunião", async () => {
        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(
                screen.getByTestId("numero-ata")
            ).toHaveTextContent("123/2026");
        });
    });

    it("deve exibir o número da portaria com o ano", async () => {
        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(
                screen.getByTestId("numero-portaria")
            ).toHaveTextContent("456/2026");
        });
    });

    it("deve exibir o placeholder quando o número da portaria não existir", async () => {
        getAtaParecerTecnico.mockResolvedValue({
            ...dadosAta,
            numero_portaria: null,
        });

        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(
                screen.getByTestId("numero-portaria")
            ).toHaveTextContent("_______");
        });
    });

    it("deve exibir o placeholder quando a data da portaria não existir", async () => {
        getAtaParecerTecnico.mockResolvedValue({
            ...dadosAta,
            data_portaria: null,
        });

        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(
                screen.getByTestId("data-portaria")
            ).toHaveTextContent("__________");
        });
    });

    it("deve formatar o horário da reunião", async () => {
        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(
                screen.getByTestId("hora-reuniao")
            ).toHaveTextContent("quatorze horas e trinta minutos");
        });
    });

    it("deve navegar para a edição da ata ao clicar em editar", async () => {
        const originalLocation = window.location;

        delete window.location;

        window.location = {
            ...originalLocation,
            assign: jest.fn(),
        };

        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(screen.getByText("Editar")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Editar"));

        expect(window.location.assign).toHaveBeenCalledWith(
            "/edicao-da-ata-parecer-tecnico/uuid-ata/"
        );

        window.location = originalLocation;
    });

    it("deve navegar para o consolidado DRE ao fechar a ata", async () => {
        const originalLocation = window.location;

        delete window.location;

        window.location = {
            ...originalLocation,
            assign: jest.fn(),
        };

        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(screen.getByText("Fechar")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Fechar"));

        expect(window.location.assign).toHaveBeenCalledWith(
            "/dre-relatorio-consolidado"
        );

        window.location = originalLocation;
    });

    it("deve fazer o download da ata", async () => {
        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(screen.getByText("Download")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Download"));

        await waitFor(() => {
            expect(
                getDownloadAtaParecerTecnico
            ).toHaveBeenCalledWith("uuid-ata");
        });
    });

    it("deve passar jaPublicado como true quando a rota possuir ja_publicado=true", async () => {
        useParams.mockReturnValue({
            uuid_ata: "uuid-ata",
            ja_publicado: "true",
        });

        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(
                screen.getByTestId("ja-publicado")
            ).toHaveTextContent("true");
        });
    });

    

    it("deve renderizar a ata sem as tabelas quando não houver dados de contas", async () => {
        getInfoContas.mockResolvedValue({});

        render(<VisualizacaoDaAtaParecerTecnico />);

        await waitFor(() => {
            expect(
                screen.getByTestId("topo-com-botoes")
            ).toBeInTheDocument();
        });

        expect(
            screen.queryByTestId("tabela-aprovadas")
        ).not.toBeInTheDocument();

        expect(
            screen.queryByTestId("tabela-aprovadas_ressalva")
        ).not.toBeInTheDocument();

        expect(
            screen.queryByTestId("tabela-reprovadas")
        ).not.toBeInTheDocument();
    });
});