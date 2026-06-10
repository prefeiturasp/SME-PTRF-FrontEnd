import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TabelaPrioridades } from "../index";

jest.mock("../../../../../../../utils/money", () => ({
  formatMoneyBRL: (val) => `R$ ${val}`,
}));

describe("Componente TabelaPrioridades", () => {
    const tituloPadrao = "Minhas Prioridades";
    const totalPadrao = 5000;

    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it("deve retornar null (não renderizar nada) se a lista de prioridades for nula", () => {
        const { container } = render(
            <TabelaPrioridades titulo={tituloPadrao} prioridades={null} total={totalPadrao} />
        );

        expect(container.firstChild).toBeNull();
    });

    it("deve retornar null (não renderizar nada) se a lista de prioridades for vazia", () => {
        const { container } = render(
            <TabelaPrioridades titulo={tituloPadrao} prioridades={[]} total={totalPadrao} />
        );

        expect(container.firstChild).toBeNull();
    });

    it("deve renderizar o nome da ação associada se for recurso PTRF", () => {
        const prioridades = [
            {
                uuid: "1",
                acao_associacao_objeto: { nome: "Ação PTRF Especial" },
            },
        ];

        render(<TabelaPrioridades titulo={tituloPadrao} prioridades={prioridades} total={totalPadrao} />);

        expect(screen.getByText("Ação PTRF Especial")).toBeInTheDocument();
    });

    it("deve renderizar programa e ação concatenados para PDDE quando ambos existirem", () => {
        const prioridades = [
            {
                uuid: "2",
                recurso: "PDDE",
                programa_pdde_objeto: { nome: "Prog Alfa" },
                acao_pdde_objeto: { nome: "Ação Beta" },
            },
        ];

        render(<TabelaPrioridades titulo={tituloPadrao} prioridades={prioridades} total={totalPadrao} />);

        expect(screen.getByText("Prog Alfa - Ação Beta")).toBeInTheDocument();
    });

    it("deve renderizar apenas o programa para PDDE quando não houver ação", () => {
        const prioridades = [
            {
                uuid: "3",
                recurso_tipo: "PDDE",
                programa_pdde_objeto: { nome: "Apenas Programa PDDE" },
                acao_pdde_objeto: null,
            },
        ];

        render(<TabelaPrioridades titulo={tituloPadrao} prioridades={prioridades} total={totalPadrao} />);

        expect(screen.getByText("Apenas Programa PDDE")).toBeInTheDocument();
    });

    it("deve renderizar apenas a ação para PDDE quando não houver programa", () => {
        const prioridades = [
            {
                uuid: "4",
                recurso: "PDDE",
                programa_pdde_objeto: null,
                acao_pdde_objeto: { nome: "Apenas Ação PDDE" },
            },
        ];

        render(<TabelaPrioridades titulo={tituloPadrao} prioridades={prioridades} total={totalPadrao} />);

        expect(screen.getByText("Apenas Ação PDDE")).toBeInTheDocument();
    });

    it("deve renderizar o nome do outro recurso quando for OUTRO_RECURSO", () => {
        const prioridades = [
            {
                uuid: "5",
                recurso: "OUTRO_RECURSO",
                outro_recurso_objeto: { nome: "Fundo Municipal" },
            },
        ];

        render(<TabelaPrioridades titulo={tituloPadrao} prioridades={prioridades} total={totalPadrao} />);

        expect(screen.getByText("Fundo Municipal")).toBeInTheDocument();
    });

    it("deve renderizar 'Recursos Próprios' quando o recurso ou tipo for RECURSO_PROPRIO", () => {
        const prioridades = [
            {
                uuid: "6",
                recurso_tipo: "RECURSO_PROPRIO",
            },
        ];

        render(<TabelaPrioridades titulo={tituloPadrao} prioridades={prioridades} total={totalPadrao} />);

        expect(screen.getByText("Recursos Próprios")).toBeInTheDocument();
    });

    it("deve renderizar '-' quando o recurso não der match com nenhuma regra", () => {
        const prioridades = [
            {
                uuid: "7",
                recurso: "RECURSO_DESCONHECIDO",
            },
        ];

        render(<TabelaPrioridades titulo={tituloPadrao} prioridades={prioridades} total={totalPadrao} />);

        const celulas = screen.getAllByRole("cell");
        const houverTracos = celulas.some((celula) => celula.textContent === "-");
        expect(houverTracos).toBe(true);
    });

    it("deve renderizar '-' para campos de aplicação, despesa, especificação e valor quando forem nulos", () => {
        const prioridades = [
            {
                uuid: "8",
                recurso: "RECURSO_PROPRIO",
                tipo_aplicacao_objeto: null,
                tipo_despesa_custeio_objeto: null,
                especificacao_material_objeto: null,
                valor_total: null,
            },
        ];

        render(<TabelaPrioridades titulo={tituloPadrao} prioridades={prioridades} total={totalPadrao} />);

        const celulasComTraco = screen.getAllByRole("cell").filter(cell => cell.textContent === "-");
        
        expect(celulasComTraco.length).toBe(4);
    });

    it("deve renderizar o título, cabeçalho e a linha de totalizador corretamente", () => {
        const prioridades = [
            {
                uuid: "9",
                recurso: "RECURSO_PROPRIO",
                tipo_aplicacao_objeto: { value: "Capital" },
                tipo_despesa_custeio_objeto: { nome: "Equipamentos" },
                especificacao_material_objeto: { nome: "Notebooks" },
                valor_total: 2500,
            },
        ];

        render(<TabelaPrioridades titulo="Tabela de Teste" prioridades={prioridades} total={2500} />);

        expect(screen.getByRole("heading", { level: 4, name: "Tabela de Teste" })).toBeInTheDocument();

        expect(screen.getByRole("columnheader", { name: "Recursos" })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Tipo de aplicação" })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Tipo de despesa" })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Especificação do bem, material ou serviço" })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Valor Total" })).toBeInTheDocument();

        expect(screen.getByText("Recursos Próprios")).toBeInTheDocument();
        expect(screen.getByText("Capital")).toBeInTheDocument();
        expect(screen.getByText("Equipamentos")).toBeInTheDocument();
        expect(screen.getByText("Notebooks")).toBeInTheDocument();

        expect(screen.getByRole("cell", { name: "TOTAL" })).toBeInTheDocument();
    });

    it("deve usar o index do map como key caso o objeto de prioridade não possua uuid", () => {
        const prioridades = [
            {
                recurso: "RECURSO_PROPRIO",
                valor_total: 1000,
            },
        ];

        render(<TabelaPrioridades titulo={tituloPadrao} prioridades={prioridades} total={totalPadrao} />);
        expect(screen.getByText("R$ 1000")).toBeInTheDocument();
    });
});