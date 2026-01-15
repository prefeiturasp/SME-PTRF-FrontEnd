import React from "react";
import { render, screen } from "@testing-library/react";
import SessaoOutrosRecursos from "../SessaoOutrosRecursos";

jest.mock(
  "../../../../ElaborarNovoPlano/ReceitasPrevistas/hooks/useGetReceitasPrevistasOutrosRecursosPeriodo",
  () => ({
    useGetTodos: jest.fn(),
  })
);

jest.mock("../../components/RelatorioTabelaGrupo", () => ({
  RelatorioTabelaGrupo: ({ title, dataSource }) => (
    <div>
      <h1>{title}</h1>
      <pre data-testid="data">{JSON.stringify(dataSource)}</pre>
    </div>
  ),
}));

jest.mock("../utils", () => ({
  planoOrcamentarioUtils: {
    numero: (v) => Number(v) || 0,
    valoresCategorias: {
      empty: () => ({ custeio: 0, capital: 0, livre: 0 }),
      normalize: (v) => v,
      normalizeDespesas: (v) => v,
      saldo: (r, d) => ({
        custeio: (r.custeio || 0) - (d.custeio || 0),
        capital: (r.capital || 0) - (d.capital || 0),
        livre: (r.livre || 0) - (d.livre || 0),
      }),
    },
    adicionarValorPorTipo: (acc, p, v) => {
      acc[p.tipo_aplicacao.toLowerCase()] += v;
    },
    identificarRecursoPrioridade: (p) => p.recurso,
    adicionarLinhaTotal: (linhas) => {
      linhas.push({ key: "TOTAL", isTotal: true });
    },
  },
}));

const { useGetTodos } = require(
  "../../../../ElaborarNovoPlano/ReceitasPrevistas/hooks/useGetReceitasPrevistasOutrosRecursosPeriodo"
);


describe("SessaoOutrosRecursos", () => {
  beforeEach(() => {
    useGetTodos.mockReturnValue({
      data: [
        {
          outro_recurso_objeto: { uuid: "1", nome: "Convênio A" },
          receitas_previstas: [
            {
              saldo_custeio: 10,
              previsao_valor_custeio: 5,
              saldo_capital: 0,
              previsao_valor_capital: 20,
              saldo_livre: 0,
              previsao_valor_livre: 0,
            },
          ],
        },
      ],
    });
  });

  it("agrupa recurso próprio e outros recursos corretamente", () => {
    render(
      <SessaoOutrosRecursos
        prioridades={[
          {
            recurso: "RECURSO_PROPRIO",
            tipo_aplicacao: "CUSTEIO",
            valor_total: 100,
          },
          {
            recurso: "OUTRO_RECURSO",
            outro_recurso: "1",
            tipo_aplicacao: "CAPITAL",
            valor_total: 50,
          },
        ]}
        totalRecursosProprios={300}
        handleIrParaPrioridades={jest.fn()}
        handleIrParaReceitas={jest.fn()}
        colunas={[]}
      />
    );

    const data = JSON.parse(screen.getByTestId("data").textContent);

    // Recurso próprio
    expect(data[0].nome).toBe("Recursos Próprios");
    expect(data[0].receitas.livre).toBe(300);
    expect(data[0].despesas.custeio).toBe(100);

    // Outro recurso
    expect(data[1].nome).toBe("Convênio A");
    expect(data[1].receitas.custeio).toBe(15);
    expect(data[1].receitas.capital).toBe(20);
    expect(data[1].despesas.capital).toBe(50);

    // TOTAL
    expect(data[data.length - 1].isTotal).toBe(true);
  });
});
