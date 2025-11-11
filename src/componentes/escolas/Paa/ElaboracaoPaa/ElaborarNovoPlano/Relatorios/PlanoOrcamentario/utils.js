import { formatMoneyBRL } from "../../../../../../../utils/money";

const numero = (valor) => {
  if (typeof valor === "string") {
    const trimmed = valor.trim();
    if (!trimmed) return 0;

    const temVirgula = trimmed.includes(",");
    const temPonto = trimmed.includes(".");
    let normalizado = trimmed;

    if (temVirgula && temPonto) {
      normalizado = normalizado.replace(/\./g, "").replace(",", ".");
    } else if (temVirgula) {
      normalizado = normalizado.replace(",", ".");
    } else {
      normalizado = normalizado.replace(/[^0-9.\-]/g, "");
    }

    const parsed = Number(normalizado);
    if (Number.isFinite(parsed)) return parsed;
  }

  const resultado = Number(valor);
  return Number.isFinite(resultado) ? resultado : 0;
};

const valoresCategorias = {
  empty: () => ({
    custeio: 0,
    capital: 0,
    livre: 0,
  }),
  normalize: (valores = {}) => {
    const resultado = {
      custeio: numero(valores.custeio),
      capital: numero(valores.capital),
      livre: numero(valores.livre),
    };
    resultado.total = resultado.custeio + resultado.capital + resultado.livre;
    return resultado;
  },
  sum: (destino, origem = {}) => {
    destino.custeio += numero(origem.custeio);
    destino.capital += numero(origem.capital);
    destino.livre += numero(origem.livre);
    return destino;
  },
  saldo: (receitas, despesas) =>
    valoresCategorias.normalize({
      custeio: numero(receitas.custeio) - numero(despesas.custeio),
      capital: numero(receitas.capital) - numero(despesas.capital),
      livre: numero(receitas.livre) - numero(despesas.livre),
    }),
};

const saldo = {
  base: (congelado, atual) =>
    congelado !== null && congelado !== undefined ? congelado : atual,
};

const categoriaPorTipo = (prioridade) => {
  const tipo =
    (prioridade?.tipo_aplicacao ||
      prioridade?.tipo_aplicacao_objeto?.name ||
      "").toUpperCase();

  if (tipo.includes("CUSTEIO")) return "custeio";
  if (tipo.includes("CAPITAL")) return "capital";
  return "livre";
};

const adicionarValorPorTipo = (destino, prioridade, valor) => {
  const categoria = categoriaPorTipo(prioridade);
  destino[categoria] = (destino[categoria] || 0) + valor;
};

const identificarRecursoPrioridade = (prioridade) => {
  if (prioridade?.acao_associacao_objeto?.e_recursos_proprios) {
    return "RECURSO_PROPRIO";
  }
  const recursoRaw = prioridade?.recurso || "";
  const recursoUpper = recursoRaw.toUpperCase();
  if (recursoUpper.includes("RECURSO")) return "RECURSO_PROPRIO";
  if (recursoUpper.includes("PDDE")) return "PDDE";
  if (recursoUpper.includes("PTRF")) return "PTRF";
  return prioridade?.recurso;
};

const agruparPrioridadesPTRF = (prioridadesLista) =>
  prioridadesLista.reduce((acc, prioridade) => {
    const recurso = identificarRecursoPrioridade(prioridade);
    if (recurso !== "PTRF" || !prioridade.acao_associacao) {
      return acc;
    }
    const valor = numero(prioridade.valor_total);
    if (!valor) return acc;

    const chave = prioridade.acao_associacao;
    const registro = acc.get(chave) || valoresCategorias.empty();
    adicionarValorPorTipo(registro, prioridade, valor);
    acc.set(chave, registro);
    return acc;
  }, new Map());

const agruparPrioridadesPDDE = (prioridadesLista) =>
  prioridadesLista.reduce((acc, prioridade) => {
    const recurso = identificarRecursoPrioridade(prioridade);
    if (recurso !== "PDDE") return acc;

    const valor = numero(prioridade.valor_total);
    if (!valor) return acc;

    const programaUuid =
      prioridade?.programa_pdde || prioridade?.programa_pdde_objeto?.uuid;
    const programaNome =
      prioridade?.programa_pdde_objeto?.nome ||
      prioridade?.acao_pdde_objeto?.nome;
    const chavePrincipal =
      programaUuid || programaNome || prioridade.recurso;

    const registro = acc.get(chavePrincipal) || valoresCategorias.empty();
    adicionarValorPorTipo(registro, prioridade, valor);

    acc.set(chavePrincipal, registro);
    if (programaUuid) acc.set(programaUuid, registro);
    if (programaNome) acc.set(programaNome, registro);
    return acc;
  }, new Map());

const somarPrioridadesRecursosProprios = (prioridadesLista) =>
  prioridadesLista.reduce((total, prioridade) => {
    const recurso = identificarRecursoPrioridade(prioridade);
    if (recurso !== "RECURSO_PROPRIO") return total;
    return total + numero(prioridade.valor_total);
  }, 0);

const agruparPrioridadesPorRecurso = (prioridadesLista) => ({
  PTRF: agruparPrioridadesPTRF(prioridadesLista),
  PDDE: agruparPrioridadesPDDE(prioridadesLista),
  RECURSO_PROPRIO: {
    livre: somarPrioridadesRecursosProprios(prioridadesLista),
  },
});

const prioridades = {
  agruparPTRF: agruparPrioridadesPTRF,
  agruparPDDE: agruparPrioridadesPDDE,
  somarRecursosProprios: somarPrioridadesRecursosProprios,
  agruparPorRecurso: agruparPrioridadesPorRecurso,
};

const formatResumo = (
  valores,
  classeBase,
  { useStrong = true, hideCusteioCapital = false } = {}
) => {
  const Wrapper = useStrong ? "strong" : "span";
  const formatCategoria = (valor, categoria) =>
    hideCusteioCapital && (categoria === "custeio" || categoria === "capital")
      ? "-"
      : formatMoneyBRL(valor);

  return (
    <div className={classeBase}>
      <Wrapper>{formatCategoria(valores.custeio, "custeio")}</Wrapper>
      <Wrapper>{formatCategoria(valores.capital, "capital")}</Wrapper>
      <Wrapper>{formatMoneyBRL(valores.livre)}</Wrapper>
    </div>
  );
};

const formatResumoTotal = (valores, classeBase) => (
  <div className={`${classeBase} ${classeBase}--total`}>
    <span>{formatMoneyBRL(valores.total)}</span>
  </div>
);

const identificarGrupo = (acao) => {
  if (acao?.e_recursos_proprios) return "RECURSO_PROPRIO";
  const nome = acao?.nome?.toUpperCase() || "";
  if (nome.includes("PDDE")) return "PDDE";
  return "PTRF";
};

const construirSecoes = (
  receitas,
  prioridadesAgrupadas,
  totalRecursosProprios = null,
  programasPdde = []
) => {
  const agruparReceitasPorGrupo = () =>
    receitas.reduce(
      (acc, item) => {
        const grupo = identificarGrupo(item.acao);
        acc[grupo] = acc[grupo] || [];
        acc[grupo].push(item);
        return acc;
      },
      { PTRF: [], PDDE: [], RECURSO_PROPRIO: [] }
    );

  const calcularReceitaBase = (item) => {
    const receitaPrevista = item?.receitas_previstas_paa?.[0] || {};
    const saldosBase = {
      custeio: saldo.base(
        receitaPrevista.saldo_congelado_custeio,
        item?.saldos?.saldo_atual_custeio
      ),
      capital: saldo.base(
        receitaPrevista.saldo_congelado_capital,
        item?.saldos?.saldo_atual_capital
      ),
      livre: saldo.base(
        receitaPrevista.saldo_congelado_livre,
        item?.saldos?.saldo_atual_livre
      ),
    };

    return valoresCategorias.normalize({
      custeio:
        numero(receitaPrevista.previsao_valor_custeio) +
        numero(saldosBase.custeio),
      capital:
        numero(receitaPrevista.previsao_valor_capital) +
        numero(saldosBase.capital),
      livre:
        numero(receitaPrevista.previsao_valor_livre) + numero(saldosBase.livre),
    });
  };

  const calcularSecaoPTRF = (receitasPTRF, prioridadesPTRF) => {
    if (!receitasPTRF.length) return null;

    const linhas = receitasPTRF.map((item) => {
      const receita = calcularReceitaBase(item);
      const despesas = valoresCategorias.normalize(
        prioridadesPTRF.get(item.uuid)
      );
      const saldo = valoresCategorias.saldo(receita, despesas);

      return {
        key: item.uuid,
        nome: item.acao?.nome || "-",
        receitas: receita,
        despesas,
        saldos: saldo,
      };
    });

    const totais = linhas.reduce(
      (acc, linha) => ({
        receitas: valoresCategorias.sum(acc.receitas, linha.receitas),
        despesas: valoresCategorias.sum(acc.despesas, linha.despesas),
        saldos: valoresCategorias.sum(acc.saldos, linha.saldos),
      }),
      {
        receitas: valoresCategorias.empty(),
        despesas: valoresCategorias.empty(),
        saldos: valoresCategorias.empty(),
      }
    );

    linhas.push({
      key: "ptrf-total",
      nome: "TOTAL",
      receitas: valoresCategorias.normalize(totais.receitas),
      despesas: valoresCategorias.normalize(totais.despesas),
      saldos: valoresCategorias.normalize(totais.saldos),
      isTotal: true,
    });

    return { key: "ptrf", titulo: "PTRF", linhas };
  };

  const calcularSecaoPDDE = (programasPdde = []) => {
    if (!programasPdde.length) return null;

    const linhas = programasPdde.map((programa) => {
      const receitas = valoresCategorias.normalize({
        custeio: programa.total_valor_custeio,
        capital: programa.total_valor_capital,
        livre: programa.total_valor_livre_aplicacao,
      });

      const despesas = valoresCategorias.normalize(
        prioridadesAgrupadas.PDDE.get(programa.uuid) ||
          prioridadesAgrupadas.PDDE.get(programa.nome) ||
          {}
      );

      const saldos = valoresCategorias.saldo(receitas, despesas);

      return {
        key: programa.uuid || programa.nome,
        nome: programa.nome,
        receitas,
        despesas,
        saldos,
      };
    });

    if (!linhas.length) return null;

    const totais = linhas.reduce(
      (acc, linha) => ({
        receitas: valoresCategorias.sum(acc.receitas, linha.receitas),
        despesas: valoresCategorias.sum(acc.despesas, linha.despesas),
        saldos: valoresCategorias.sum(acc.saldos, linha.saldos),
      }),
      {
        receitas: valoresCategorias.empty(),
        despesas: valoresCategorias.empty(),
        saldos: valoresCategorias.empty(),
      }
    );

    linhas.push({
      key: "pdde-total",
      nome: "TOTAL",
      receitas: valoresCategorias.normalize(totais.receitas),
      despesas: valoresCategorias.normalize(totais.despesas),
      saldos: valoresCategorias.normalize(totais.saldos),
      isTotal: true,
    });

    return { key: "pdde", titulo: "PDDE", linhas };
  };

  const calcularSecaoRecursosProprios = (
    receitasRecursosProprios,
    totalRecursosProprios,
    totalDespesasRecursosProprios
  ) => {
    if (!receitasRecursosProprios.length) return null;

    const linhas = receitasRecursosProprios.map((item) => {
      const receita = valoresCategorias.normalize({
        livre:
          totalRecursosProprios !== null
            ? totalRecursosProprios
            : calcularReceitaBase(item).livre,
      });

      const despesas = valoresCategorias.normalize({
        livre: totalDespesasRecursosProprios,
      });

      const saldo = valoresCategorias.saldo(receita, despesas);

      return {
        key: item.uuid,
        nome: item.acao?.nome || "-",
        receitas: receita,
        despesas,
        saldos: saldo,
        ocultarCusteioCapital: true,
      };
    });

    const totais = linhas.reduce(
      (acc, linha) => ({
        receitas: valoresCategorias.sum(acc.receitas, linha.receitas),
        despesas: valoresCategorias.sum(acc.despesas, linha.despesas),
        saldos: valoresCategorias.sum(acc.saldos, linha.saldos),
      }),
      {
        receitas: valoresCategorias.empty(),
        despesas: valoresCategorias.empty(),
        saldos: valoresCategorias.empty(),
      }
    );

    linhas.push({
      key: "recurso_proprio-total",
      nome: "TOTAL",
      receitas: valoresCategorias.normalize(totais.receitas),
      despesas: valoresCategorias.normalize(totais.despesas),
      saldos: valoresCategorias.normalize(totais.saldos),
      isTotal: true,
      ocultarCusteioCapital: true,
    });

    return {
      key: "recurso_proprio",
      titulo: "RECURSOS PRÓPRIOS",
      linhas,
    };
  };

  const receitasAgrupadas = agruparReceitasPorGrupo();

  const secaoPTRF = calcularSecaoPTRF(
    receitasAgrupadas.PTRF,
    prioridadesAgrupadas.PTRF
  );
  const secaoPDDE = calcularSecaoPDDE(programasPdde);
  const totalDespesasRecursosProprios =
    prioridadesAgrupadas.RECURSO_PROPRIO?.livre || 0;
  const secaoRecursosProprios = calcularSecaoRecursosProprios(
    receitasAgrupadas.RECURSO_PROPRIO,
    totalRecursosProprios,
    totalDespesasRecursosProprios
  );

  return [secaoPTRF, secaoPDDE, secaoRecursosProprios].filter(Boolean);
};

export const planoOrcamentarioUtils = {
  numero,
  valoresCategorias,
  prioridades,
  saldo,
  identificarRecursoPrioridade,
  format: {
    resumo: formatResumo,
    total: formatResumoTotal,
  },
  identificarGrupo,
  construirSecoes,
};

