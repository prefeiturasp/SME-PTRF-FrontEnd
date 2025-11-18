import { planoOrcamentarioUtils } from "../utils";

const {
  numero,
  prioridades,
  construirSecoes,
  valoresCategorias,
} = planoOrcamentarioUtils;

describe("planoOrcamentarioUtils.numero", () => {
  it("converte textos no formato brasileiro corretamente", () => {
    expect(numero("1.234,56")).toBeCloseTo(1234.56);
    expect(numero("  2,50  ")).toBeCloseTo(2.5);
    expect(numero("987")).toBe(987);
  });
});

describe("planoOrcamentarioUtils.prioridades", () => {
  const prioridadesMock = [
    {
      valor_total: "100,00",
      recurso: "PTRF",
      acao_associacao: "acao-1",
      tipo_aplicacao: "custeio",
    },
    {
      valor_total: 50,
      recurso: "PDDE",
      programa_pdde: "prog-1",
      tipo_aplicacao: "capital",
    },
    {
      valor_total: 30,
      recurso: "RECURSO_PROPRIO",
      tipo_aplicacao: "livre",
    },
  ];

  it("agrupa prioridades por recurso", () => {
    const agrupado = prioridades.agruparPorRecurso(prioridadesMock);

    const ptrf = agrupado.PTRF.get("acao-1");
    expect(ptrf).toEqual(
      expect.objectContaining({
        custeio: expect.any(Number),
        capital: 0,
        livre: 0,
      })
    );
    expect(ptrf.custeio).toBeCloseTo(100);

    const pdde = agrupado.PDDE.get("prog-1");
    expect(pdde.capital).toBeCloseTo(50);

    expect(agrupado.RECURSO_PROPRIO.livre).toBeCloseTo(30);
  });
});

describe("planoOrcamentarioUtils.construirSecoes", () => {
  const receitasMock = [
    {
      uuid: "receita-ptrf",
      acao: { nome: "Ação PTRF" },
      saldos: {
        saldo_atual_custeio: 0,
        saldo_atual_capital: 0,
        saldo_atual_livre: 0,
      },
      receitas_previstas_paa: [
        {
          previsao_valor_custeio: 100,
          previsao_valor_capital: 0,
          previsao_valor_livre: 0,
        },
      ],
    },
    {
      uuid: "receita-pdde",
      acao: { nome: "PDDE Programa" },
      saldos: {
        saldo_atual_custeio: 0,
        saldo_atual_capital: 0,
        saldo_atual_livre: 0,
      },
      receitas_previstas_paa: [
        {
          previsao_valor_custeio: 0,
          previsao_valor_capital: 0,
          previsao_valor_livre: 0,
        },
      ],
    },
    {
      uuid: "receita-rp",
      acao: { nome: "Recursos próprios", e_recursos_proprios: true },
      saldos: {
        saldo_atual_custeio: 0,
        saldo_atual_capital: 0,
        saldo_atual_livre: 0,
      },
      receitas_previstas_paa: [],
    },
  ];

  const prioridadesAgrupadasMock = {
    PTRF: new Map([
      [
        "receita-ptrf",
        valoresCategorias.normalize({ custeio: 80, capital: 0, livre: 0 }),
      ],
    ]),
    PDDE: new Map([["prog-uuid", valoresCategorias.normalize({ livre: 10 })]]),
    RECURSO_PROPRIO: { livre: 20 },
  };

  const programasPddeMock = [
    {
      uuid: "prog-uuid",
      nome: "Programa PDDE",
      total_valor_custeio: 0,
      total_valor_capital: 0,
      total_valor_livre_aplicacao: 15,
    },
  ];

  it("constrói seções para PTRF, PDDE e Recursos Próprios", () => {
    const secoes = construirSecoes(
      receitasMock,
      prioridadesAgrupadasMock,
      50,
      programasPddeMock
    );

    expect(secoes.map((secao) => secao.titulo)).toEqual([
      "PTRF",
      "PDDE",
      "RECURSOS PRÓPRIOS",
    ]);
    expect(secoes[0].linhas).toHaveLength(2); // item + total
    expect(secoes[1].linhas).toHaveLength(2);
    expect(secoes[2].linhas).toHaveLength(2);
  });
});

