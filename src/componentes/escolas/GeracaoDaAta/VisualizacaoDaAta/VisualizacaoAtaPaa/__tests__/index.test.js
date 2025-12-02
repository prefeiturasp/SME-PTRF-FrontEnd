import React from "react";
import { render, screen } from "@testing-library/react";
import { VisualizacaoAtaPaa } from "../index";
import { useVisualizacaoAtaPaa } from "../hooks/useVisualizacaoAtaPaa";

jest.mock("../hooks/useVisualizacaoAtaPaa", () => ({
    useVisualizacaoAtaPaa: jest.fn(),
}));

const createMockHookReturn = (overrides = {}) => ({
    dadosAta: {
        uuid: "ata-uuid",
        comentarios: "Comentário registrado",
        parecer_conselho: "APROVADA",
        justificativa: "",
    },
    tabelas: {
        pareceres: [{ id: "APROVADA" }],
    },
    listaPresentes: [],
    listaCompletaParticipantes: [],
    alturaDocumento: 0,
    referenciaDocumento: { current: null },
    prioridadesAgrupadas: null,
    isLoadingPrioridades: false,
    atividades: [],
    isLoadingAtividades: false,
    handleClickFecharAta: jest.fn(),
    handleClickEditarAta: jest.fn(),
    getNomeUnidadeEducacional: jest.fn().mockReturnValue("EMEI - EMILIO RIBAS"),
    getDiaPorExtenso: jest.fn().mockReturnValue("vinte e oito"),
    getMesPorExtenso: jest.fn().mockReturnValue("novembro"),
    getAnoPorExtenso: jest.fn().mockReturnValue("dois mil e vinte e cinco"),
    getLocalReuniao: jest.fn().mockReturnValue("REUNIÃO VIRTUAL"),
    getNomeUnidade: jest.fn().mockReturnValue("EMEI - EMILIO RIBAS"),
    getHoraInicio: jest.fn().mockReturnValue("treze horas"),
    getTipoReuniao: jest.fn().mockReturnValue("ordinária"),
    getTipoUnidadeComNome: jest.fn().mockReturnValue("CEI/EMEI/EMEF"),
    getPeriodoPaaFormatado: jest.fn().mockReturnValue("1º de maio de 2025 a 30 de abril de 2026"),
    formatarMesAno: jest.fn().mockReturnValue("-"),
    formatarData: jest.fn().mockReturnValue("-"),
    getNomeSecretario: jest.fn().mockReturnValue("Maria Souza"),
    ...overrides,
});

describe("VisualizacaoAtaPaa", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = (overrides) => {
        useVisualizacaoAtaPaa.mockReturnValue(createMockHookReturn(overrides));
        return render(<VisualizacaoAtaPaa />);
    };

    it("renderiza o texto principal com os valores dinâmicos esperados", () => {
        renderComponent();

        const paragraph = screen.getByText((_, element) => {
            return element.tagName === "P" && element.textContent.startsWith("Aos vinte e oito");
        });

        const expectedText =
            "Aos vinte e oito do mês de novembro de dois mil e vinte e cinco, no (a) REUNIÃO VIRTUAL, da Unidade Educacional EMEI - EMILIO RIBAS, às treze horas, realizou-se a reunião ordinária da Diretoria Executiva e Conselho Fiscal da Associação de Pais e Mestres do(a) CEI/EMEI/EMEF, com a participação dos membros do Conselho de Escola, em atendimento ao inciso XIII do artigo 118, da Lei nº 14.660/2007.";

        expect(paragraph).toBeInTheDocument();
        expect(paragraph.textContent).toBe(expectedText);
    });

    it("não utiliza negrito nos trechos dinâmicos do texto principal", () => {
        renderComponent();

        const paragraph = screen.getByText((_, element) => {
            return element.tagName === "P" && element.textContent.startsWith("Aos vinte e oito");
        });

        expect(paragraph.querySelector("strong")).toBeNull();
    });

    it("exibe mensagem de rejeição e justificativa quando o parecer é REJEITADA", () => {
        renderComponent({
            dadosAta: {
                uuid: "ata-uuid",
                comentarios: "",
                parecer_conselho: "REJEITADA",
                justificativa: "Desalinhado com os objetivos estratégicos.",
            },
            tabelas: {
                pareceres: [{ id: "REJEITADA" }],
            },
        });

        const paragraph = screen.getByText((_, element) => {
            return element.tagName === "P" && element.textContent.includes("Diante ao exposto, o Plano Anual de Atividades foi reprovado");
        });

        expect(paragraph).toBeInTheDocument();
        expect(paragraph.textContent).toContain("Diante ao exposto, o Plano Anual de Atividades foi reprovado");
        expect(paragraph.textContent).toContain("Desalinhado com os objetivos estratégicos.");
    });

    it("renderiza a lista de presentes quando existem participantes", () => {
        renderComponent({
            listaPresentes: [
                { uuid: "1", nome: "João Silva", cargo: "Professor" },
                { uuid: "2", nome: "Ana Costa", cargo: "Gestora" },
            ],
        });

        expect(screen.getByText("Lista de presentes")).toBeInTheDocument();
        expect(screen.getByText("João Silva")).toBeInTheDocument();
        expect(screen.getByText("Professor")).toBeInTheDocument();
        expect(screen.getByText("Ana Costa")).toBeInTheDocument();
        expect(screen.getByText("Gestora")).toBeInTheDocument();
    });

    it("exibe o nome do secretário no parágrafo de encerramento", () => {
        renderComponent({
            getNomeSecretario: jest.fn().mockReturnValue("Carlos Alberto"),
        });

        const closingParagraph = screen.getByText((content) =>
            content.includes("Carlos Alberto")
        );

        expect(closingParagraph).toBeInTheDocument();
        const secretaryName = screen.getByText("Carlos Alberto");
        const strongElement = secretaryName.closest("strong");
        expect(strongElement).not.toBeNull();
        expect(strongElement?.textContent).toBe("Carlos Alberto");
    });
});

