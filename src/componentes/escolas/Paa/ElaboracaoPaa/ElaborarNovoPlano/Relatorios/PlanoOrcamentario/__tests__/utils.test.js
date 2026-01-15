import { planoOrcamentarioUtils } from "../utils";

const {
  numero,
  prioridades,
  construirSecoes,
  valoresCategorias,
  saldo,
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
      tipo_aplicacao: "CUSTEIO",
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
    
  ];

  const prioridadesAgrupadasMock = {
    PTRF: new Map([
      [
        "receita-ptrf",
        valoresCategorias.normalize({ custeio: 80, capital: 0, livre: 0 }),
      ],
    ]),
    PDDE: new Map([["prog-uuid", valoresCategorias.normalize({ livre: 10 })]]),
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
    ]);
    expect(secoes[0].linhas).toHaveLength(2); // item + total
    expect(secoes[1].linhas).toHaveLength(2);
    
  });

  it("trata saldos negativos como zero ao calcular receitas", () => {
    const receitasComSaldosNegativos = [
      {
        uuid: "receita-ptrf-negativa",
        acao: { nome: "Ação PTRF" },
        saldos: {
          saldo_atual_custeio: -100.50,
          saldo_atual_capital: -200.75,
          saldo_atual_livre: -300.25,
        },
        receitas_previstas_paa: [
          {
            previsao_valor_custeio: 1000,
            previsao_valor_capital: 2000,
            previsao_valor_livre: 3000,
          },
        ],
      },
    ];

    const prioridadesVazias = {
      PTRF: new Map(),
      PDDE: new Map(),
      RECURSO_PROPRIO: {},
    };

    const secoes = construirSecoes(
      receitasComSaldosNegativos,
      prioridadesVazias,
      null,
      []
    );

    expect(secoes).toHaveLength(1);
    expect(secoes[0].titulo).toBe("PTRF");
    expect(secoes[0].linhas).toHaveLength(2); // item + total

    const linhaReceita = secoes[0].linhas[0];
    // Os saldos negativos devem ser tratados como 0, então:
    // receita = previsao_valor + saldo_tratado
    // custeio = 1000 + 0 = 1000
    // capital = 2000 + 0 = 2000
    // livre = 3000 + 0 = 3000
    expect(linhaReceita.receitas.custeio).toBe(1000);
    expect(linhaReceita.receitas.capital).toBe(2000);
    expect(linhaReceita.receitas.livre).toBe(3000);
  });

  it("mantém saldos positivos inalterados ao calcular receitas", () => {
    const receitasComSaldosPositivos = [
      {
        uuid: "receita-ptrf-positiva",
        acao: { nome: "Ação PTRF" },
        saldos: {
          saldo_atual_custeio: 100.50,
          saldo_atual_capital: 200.75,
          saldo_atual_livre: 300.25,
        },
        receitas_previstas_paa: [
          {
            previsao_valor_custeio: 1000,
            previsao_valor_capital: 2000,
            previsao_valor_livre: 3000,
          },
        ],
      },
    ];

    const prioridadesVazias = {
      PTRF: new Map(),
      PDDE: new Map(),
      RECURSO_PROPRIO: {},
    };

    const secoes = construirSecoes(
      receitasComSaldosPositivos,
      prioridadesVazias,
      null,
      []
    );

    expect(secoes).toHaveLength(1);
    const linhaReceita = secoes[0].linhas[0];
    // Os saldos positivos devem ser mantidos:
    // receita = previsao_valor + saldo_atual
    // custeio = 1000 + 100.50 = 1100.50
    // capital = 2000 + 200.75 = 2200.75
    // livre = 3000 + 300.25 = 3300.25
    expect(linhaReceita.receitas.custeio).toBeCloseTo(1100.50);
    expect(linhaReceita.receitas.capital).toBeCloseTo(2200.75);
    expect(linhaReceita.receitas.livre).toBeCloseTo(3300.25);
  });
});

describe("planoOrcamentarioUtils.saldo.tratarNegativo", () => {
  it("converte valores negativos para zero", () => {
    expect(saldo.tratarNegativo(-100.50)).toBe(0);
    expect(saldo.tratarNegativo(-200.75)).toBe(0);
    expect(saldo.tratarNegativo(-300.25)).toBe(0);
    expect(saldo.tratarNegativo(-0.01)).toBe(0);
  });

  it("mantém valores positivos inalterados", () => {
    expect(saldo.tratarNegativo(100.50)).toBe(100.50);
    expect(saldo.tratarNegativo(200.75)).toBe(200.75);
    expect(saldo.tratarNegativo(300.25)).toBe(300.25);
    expect(saldo.tratarNegativo(0)).toBe(0);
  });

  it("mantém valores nulos ou undefined inalterados", () => {
    expect(saldo.tratarNegativo(null)).toBe(null);
    expect(saldo.tratarNegativo(undefined)).toBe(undefined);
  });
});

