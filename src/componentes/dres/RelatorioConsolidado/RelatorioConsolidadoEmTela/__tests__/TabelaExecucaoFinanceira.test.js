import React from "react";
import { render, screen } from "@testing-library/react";
import { TabelaExecucaoFinanceira } from "../TabelaExecucaoFinanceira";
import { useRecursoSelecionadoContext } from "../../../../../context/RecursoSelecionado";

jest.mock("../../../../../context/RecursoSelecionado", () => ({
    useRecursoSelecionadoContext: jest.fn(),
}));

const sufixos = ["custeio", "capital", "livre", "total"];
const prefixos = [
    "saldo_reprogramado_periodo_anterior", "repasses_previstos_sme", "repasses_no_periodo",
    "receitas_rendimento_no_periodo", "receitas_devolucao_no_periodo", "demais_creditos_no_periodo",
    "receitas_totais_no_periodo", "despesas_no_periodo", "saldo_reprogramado_proximo_periodo",
];
const cheia = () => {
    const o = { devolucoes_ao_tesouro_no_periodo_total: 7 };
    prefixos.forEach((p) => sufixos.forEach((s) => (o[`${p}_${s}`] = 5)));
    return o;
};

const montar = (props = {}) =>
    render(
        <TabelaExecucaoFinanceira
            execucaoFinanceira={cheia()}
            valorTemplate={(v) => `R${v}`}
            haDiferencaPrevisaoExecucaoRepasse={() => false}
            tipoConta="Cheque"
            exibe_devolucao_ao_tesouro={false}
            {...props}
        />
    );

describe("TabelaExecucaoFinanceira", () => {
    beforeEach(() => {
        useRecursoSelecionadoContext.mockReturnValue({ recursoSelecionado: { existe_saldo_reprogramado: false } });
    });

    it("renderiza título e valores", () => {
        montar();
        expect(screen.getByText("Execução Financeira - Conta Cheque")).toBeInTheDocument();
        expect(screen.getAllByText("R5")).toHaveLength(36);
        expect(screen.getByText("Saldo do período anterior")).toBeInTheDocument();
        expect(screen.getByText("Saldo do próximo período")).toBeInTheDocument();
        expect(screen.queryByText("Devolução para o tesouro")).not.toBeInTheDocument();
    });

    it("usa rótulos de saldo reprogramado", () => {
        useRecursoSelecionadoContext.mockReturnValue({ recursoSelecionado: { existe_saldo_reprogramado: true } });
        montar();
        expect(screen.getByText("Saldo reprogramado do período anterior")).toBeInTheDocument();
        expect(screen.getByText("Saldo reprogramado do próximo período")).toBeInTheDocument();
    });

    it("funciona sem recurso selecionado", () => {
        useRecursoSelecionadoContext.mockReturnValue({ recursoSelecionado: null });
        montar();
        expect(screen.getByText("Saldo do período anterior")).toBeInTheDocument();
    });

    it("exibe traço para valores vazios", () => {
        montar({ execucaoFinanceira: { repasses_previstos_sme_custeio: 0 } });
        expect(screen.queryByText("R5")).not.toBeInTheDocument();
        expect(screen.getAllByText("-").length).toBeGreaterThanOrEqual(36);
    });

    it("exibe devolução ao tesouro", () => {
        montar({ exibe_devolucao_ao_tesouro: true });
        expect(screen.getByText("Devolução para o tesouro")).toBeInTheDocument();
        expect(screen.getByText("R7")).toBeInTheDocument();
    });

    it("traço no total de devolução ao tesouro quando ausente", () => {
        const e = cheia();
        delete e.devolucoes_ao_tesouro_no_periodo_total;
        montar({ execucaoFinanceira: e, exibe_devolucao_ao_tesouro: true });
        expect(screen.queryByText("R7")).not.toBeInTheDocument();
    });

    it("aplica classe de aviso quando há diferença", () => {
        const { container } = montar({ haDiferencaPrevisaoExecucaoRepasse: () => true });
        expect(container.querySelectorAll(".texto-aviso-associacoes-em-analise")).toHaveLength(2);
    });

    it("não renderiza tabela com execução vazia ou falsa", () => {
        const { container, rerender } = montar({ execucaoFinanceira: {} });
        expect(container.querySelector("table")).toBeNull();
        rerender(
            <TabelaExecucaoFinanceira execucaoFinanceira={false} valorTemplate={() => ""} haDiferencaPrevisaoExecucaoRepasse={() => false} tipoConta="X" />
        );
        expect(container.querySelector("table")).toBeNull();
    });
});
