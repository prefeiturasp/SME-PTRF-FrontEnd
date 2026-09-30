import React from "react";
import { render, screen, within } from "@testing-library/react";
import { TabelaExecucaoFinanceira } from "../TabelaExecucaoFinanceira";
import { useRecursoSelecionadoContext } from "../../../../../context/RecursoSelecionado";

jest.mock("../../../../../context/RecursoSelecionado", () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));

describe("TabelaExecucaoFinanceira Component", () => {
  const mockExecucaoFinanceira = {
    saldo_reprogramado_periodo_anterior_custeio: 100,
    saldo_reprogramado_periodo_anterior_capital: 0,
    saldo_reprogramado_periodo_anterior_livre: 50,
    saldo_reprogramado_periodo_anterior_total: 150,
    repasses_previstos_sme_custeio: 1000,
    repasses_previstos_sme_capital: 500,
    repasses_previstos_sme_livre: 0,
    repasses_previstos_sme_total: 1500,
    repasses_no_periodo_custeio: 900,
    repasses_no_periodo_capital: 500,
    repasses_no_periodo_livre: 0,
    repasses_no_periodo_total: 1400,
    receitas_rendimento_no_periodo_total: 10,
    receitas_devolucao_no_periodo_total: 20,
    demais_creditos_no_periodo_total: 30,
    receitas_totais_no_periodo_total: 1460,
    despesas_no_periodo_total: 1000,
    saldo_reprogramado_proximo_periodo_total: 610,
    devolucoes_ao_tesouro_no_periodo_total: 75,
  };

  const mockContexto = (existeSaldoReprogramado = false) => {
    useRecursoSelecionadoContext.mockReturnValue({
      recursoSelecionado: { existe_saldo_reprogramado: existeSaldoReprogramado },
    });
  };

  const renderComponente = (props = {}) => {
    const propsPadrao = {
      execucaoFinanceira: mockExecucaoFinanceira,
      valorTemplate: jest.fn((valor) => `R$ ${valor}`),
      comparaValores: jest.fn(() => false),
      exibe_devolucao_ao_tesouro: false,
      ...props,
    };

    render(<TabelaExecucaoFinanceira {...propsPadrao} />);

    return propsPadrao;
  };

  const obtemCelulasDaLinha = (titulo) =>
    within(screen.getByText(titulo).closest("tr"))
      .getAllByRole("cell")
      .map((celula) => celula.textContent.trim());

  beforeEach(() => {
    jest.clearAllMocks();
    mockContexto();
  });

  describe("Condições de exibição", () => {
    it("deve renderizar o título mesmo sem dados de execução financeira", () => {
      renderComponente({ execucaoFinanceira: false });

      expect(screen.getByText("Execução Financeira")).toBeInTheDocument();
      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });

    it("não deve renderizar a tabela quando a execução financeira for um objeto vazio", () => {
      renderComponente({ execucaoFinanceira: {} });

      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });

    it("deve renderizar a tabela com os cabeçalhos quando houver dados", () => {
      renderComponente();

      ["Tipo de recurso", "Custeio", "Capital", "Livre Aplicação", "Total (R$)"].forEach(
        (cabecalho) => {
          expect(screen.getByRole("columnheader", { name: cabecalho })).toBeInTheDocument();
        }
      );
    });
  });

  describe("Valores das linhas", () => {
    it("deve formatar os valores preenchidos e exibir '-' para os vazios ou zerados", () => {
      renderComponente();

      expect(obtemCelulasDaLinha("Saldo do período anterior")).toEqual([
        "Saldo do período anterior",
        "R$ 100",
        "-",
        "R$ 50",
        "R$ 150",
      ]);
      expect(obtemCelulasDaLinha("Rendimentos de Aplicação Financeira")).toEqual([
        "Rendimentos de Aplicação Financeira",
        "-",
        "-",
        "-",
        "R$ 10",
      ]);
    });

    it("deve renderizar as linhas fixas de receitas e despesas", () => {
      renderComponente();

      expect(obtemCelulasDaLinha("Devolução à conta PTRF")[4]).toBe("R$ 20");
      expect(obtemCelulasDaLinha("Demais créditos")[4]).toBe("R$ 30");
      expect(obtemCelulasDaLinha("Valor total")[4]).toBe("R$ 1460");
      expect(obtemCelulasDaLinha("Despesa realizada")[4]).toBe("R$ 1000");
      expect(obtemCelulasDaLinha("Saldo do próximo período")[4]).toBe("R$ 610");
    });
  });

  describe("Saldo reprogramado", () => {
    it("deve usar os títulos de saldo reprogramado quando o recurso tiver saldo reprogramado", () => {
      mockContexto(true);

      renderComponente();

      expect(
        screen.getByText("Saldo reprogramado do período anterior")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Saldo reprogramado do próximo período")
      ).toBeInTheDocument();
    });

    it("deve usar os títulos de saldo simples quando o recurso não tiver saldo reprogramado", () => {
      renderComponente();

      expect(screen.getByText("Saldo do período anterior")).toBeInTheDocument();
      expect(screen.getByText("Saldo do próximo período")).toBeInTheDocument();
    });
  });

  describe("Comparação entre previsto e transferido", () => {
    it("não deve exibir as linhas de previsto e transferido quando não houver diferença", () => {
      renderComponente();

      expect(
        screen.queryByText("Previsto Secretaria Municipal de Educação")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Transferido pela Diretoria Regional de Ensino no período")
      ).not.toBeInTheDocument();
    });

    it("deve exibir as linhas de previsto e transferido quando houver diferença", () => {
      renderComponente({ comparaValores: () => true });

      expect(obtemCelulasDaLinha("Previsto Secretaria Municipal de Educação")).toEqual([
        "Previsto Secretaria Municipal de Educação",
        "R$ 1000",
        "R$ 500",
        "-",
        "R$ 1500",
      ]);
      expect(
        obtemCelulasDaLinha("Transferido pela Diretoria Regional de Ensino no período")
      ).toEqual([
        "Transferido pela Diretoria Regional de Ensino no período",
        "R$ 900",
        "R$ 500",
        "-",
        "R$ 1400",
      ]);
    });
  });

  describe("Devolução para o tesouro", () => {
    it("não deve exibir a linha quando exibe_devolucao_ao_tesouro for falso", () => {
      renderComponente();

      expect(screen.queryByText("Devolução para o tesouro")).not.toBeInTheDocument();
    });

    it("deve exibir a linha apenas com o total quando exibe_devolucao_ao_tesouro for verdadeiro", () => {
      renderComponente({ exibe_devolucao_ao_tesouro: true });

      expect(obtemCelulasDaLinha("Devolução para o tesouro")).toEqual([
        "Devolução para o tesouro",
        "-",
        "-",
        "-",
        "R$ 75",
      ]);
    });
  });
});
