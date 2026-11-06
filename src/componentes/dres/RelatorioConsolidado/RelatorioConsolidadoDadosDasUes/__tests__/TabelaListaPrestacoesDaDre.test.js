import React from "react";
import { render, screen } from "@testing-library/react";
import { TabelaListaPrestacoesDaDre } from "../TabelaListaPrestacoesDaDre";

const valores = {
    saldo_reprogramado_periodo_anterior_capital: 1,
    saldo_reprogramado_periodo_anterior_custeio: 2,
    saldo_reprogramado_periodo_anterior_livre: 3,
    repasses_no_periodo_capital: 4,
    repasses_no_periodo_custeio: 5,
    repasses_no_periodo_livre: 6,
    receitas_rendimento_no_periodo_capital: 7,
    receitas_rendimento_no_periodo_custeio: 8,
    receitas_rendimento_no_periodo_livre: 9,
    receitas_devolucao_no_periodo_capital: 10,
    receitas_devolucao_no_periodo_custeio: 11,
    receitas_devolucao_no_periodo_livre: 12,
    demais_creditos_no_periodo_capital: 13,
    demais_creditos_no_periodo_custeio: 14,
    demais_creditos_no_periodo_livre: 15,
    despesas_no_periodo_capital: 16,
    despesas_no_periodo_custeio: 17,
    saldo_reprogramado_proximo_periodo_capital: 18,
    saldo_reprogramado_proximo_periodo_custeio: 19,
    saldo_reprogramado_proximo_periodo_livre: 20,
    devolucoes_ao_tesouro_no_periodo_total: 21,
};

const linha = (status, codigo = "1", nome = "UE") => ({
    unidade: { codigo_eol: codigo, nome },
    status_prestacao_contas: status,
    valores,
});

describe("TabelaListaPrestacoesDaDre", () => {
    it("não renderiza nada com lista vazia, nula ou indefinida", () => {
        const valorTemplate = jest.fn();
        const { container, rerender } = render(<TabelaListaPrestacoesDaDre listaPrestacoes={[]} valorTemplate={valorTemplate} />);
        expect(container.querySelector(".card")).toBeNull();
        rerender(<TabelaListaPrestacoesDaDre listaPrestacoes={null} valorTemplate={valorTemplate} />);
        expect(container.querySelector(".card")).toBeNull();
        rerender(<TabelaListaPrestacoesDaDre valorTemplate={valorTemplate} />);
        expect(container.querySelector(".card")).toBeNull();
    });

    it("renderiza cabeçalhos, unidade e tipos de recurso", () => {
        render(<TabelaListaPrestacoesDaDre listaPrestacoes={[linha("APROVADA", "123", "EMEF Teste")]} valorTemplate={(v) => `v${v}`} />);
        ["Unidade educacional", "Reprogramado", "Repasse", "Rendimento", "Devolução à conta PTRF", "Demais créditos", "Despesa realizada", "Saldo", "Devolução ao tesouro", "Situação da Prestação de Contas"].forEach((h) =>
            expect(screen.getAllByText(h).length).toBeGreaterThan(0)
        );
        expect(screen.getByText("123 - EMEF Teste")).toBeInTheDocument();
        expect(screen.getByText("Capital")).toBeInTheDocument();
        expect(screen.getByText("Custeio")).toBeInTheDocument();
        expect(screen.getByText("RLA")).toBeInTheDocument();
        expect(screen.getByText("Aprovada")).toBeInTheDocument();
    });

    it("usa valorTemplate para todos os valores quando apresentada", () => {
        const valorTemplate = jest.fn((v) => `v${v}`);
        render(<TabelaListaPrestacoesDaDre listaPrestacoes={[linha("APROVADA")]} valorTemplate={valorTemplate} />);
        for (let i = 1; i <= 21; i++) {
            expect(screen.getByText(`v${i}`)).toBeInTheDocument();
        }
        expect(valorTemplate).toHaveBeenCalled();
    });

    it("não chama valorTemplate quando NAO_APRESENTADA", () => {
        const valorTemplate = jest.fn((v) => `v${v}`);
        render(<TabelaListaPrestacoesDaDre listaPrestacoes={[linha("NAO_APRESENTADA")]} valorTemplate={valorTemplate} />);
        expect(valorTemplate).not.toHaveBeenCalled();
        expect(screen.getByText("Não apresentada")).toBeInTheDocument();
    });

    it.each([
        ["NAO_RECEBIDA", "Não recebida"],
        ["RECEBIDA", "Recebida"],
        ["DEVOLVIDA", "Devolvida para acerto"],
        ["EM_ANALISE", "Em análise"],
        ["APROVADA", "Aprovada"],
        ["APROVADA_RESSALVA", "Aprovada com ressalva"],
        ["REPROVADA", "Rejeitada"],
        ["NAO_APRESENTADA", "Não apresentada"],
        ["OUTRO", "SEM STATUS"],
    ])("mapeia status %s para %s", (status, texto) => {
        const { container } = render(<TabelaListaPrestacoesDaDre listaPrestacoes={[linha(status)]} valorTemplate={() => "x"} />);
        expect(screen.getByText(texto)).toBeInTheDocument();
        expect(container.querySelector(`.span-status-${status}`)).toBeInTheDocument();
    });

    it("não exibe status quando ausente", () => {
        const l = linha(undefined);
        render(<TabelaListaPrestacoesDaDre listaPrestacoes={[l]} valorTemplate={() => "x"} />);
        expect(screen.queryByText("SEM STATUS")).not.toBeInTheDocument();
    });
});
