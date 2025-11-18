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
      normalizado = normalizado.replace(/[^0-9.-]/g, "");
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
  saldo: (receitas, despesas) => {
    // Calcula saldos brutos
    const saldo_custeio_bruto = numero(receitas.custeio) - numero(despesas.custeio);
    const saldo_capital_bruto = numero(receitas.capital) - numero(despesas.capital);
    const saldo_livre_bruto = numero(receitas.livre) - numero(despesas.livre);
    
    // Se custeio ficar negativo, deduz do saldo de livre aplicação
    let saldo_custeio_final = saldo_custeio_bruto;
    let saldo_livre_final = saldo_livre_bruto;
    
    if (saldo_custeio_bruto < 0) {
      saldo_livre_final += saldo_custeio_bruto; // Adiciona o valor negativo (subtrai)
      saldo_custeio_final = 0;
    }
    
    // Se capital ficar negativo, deduz do saldo de livre aplicação
    let saldo_capital_final = saldo_capital_bruto;
    
    if (saldo_capital_bruto < 0) {
      saldo_livre_final += saldo_capital_bruto; // Adiciona o valor negativo (subtrai)
      saldo_capital_final = 0;
    }
    
    return valoresCategorias.normalize({
      custeio: saldo_custeio_final,
      capital: saldo_capital_final,
      livre: saldo_livre_final,
    });
  },
  // Normaliza despesas garantindo que livre sempre seja 0
  normalizeDespesas: (valores = {}) => {
    const despesas = valoresCategorias.normalize(valores);
    despesas.livre = 0;
    return despesas;
  },
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
  return null;
};

const adicionarValorPorTipo = (destino, prioridade, valor) => {
  const categoria = categoriaPorTipo(prioridade);
  if (categoria === "custeio" || categoria === "capital") {
    destino[categoria] = (destino[categoria] || 0) + valor;
  }
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

const agruparPrioridadesRecursosProprios = (prioridadesLista) =>
  prioridadesLista.reduce((acc, prioridade) => {
    const recurso = identificarRecursoPrioridade(prioridade);
    if (recurso !== "RECURSO_PROPRIO") return acc;
    
    const valor = numero(prioridade.valor_total);
    if (!valor) return acc;
    
    const registro = acc || valoresCategorias.empty();
    adicionarValorPorTipo(registro, prioridade, valor);
    return registro;
  }, valoresCategorias.empty());

const agruparPrioridadesPorRecurso = (prioridadesLista) => ({
  PTRF: agruparPrioridadesPTRF(prioridadesLista),
  PDDE: agruparPrioridadesPDDE(prioridadesLista),
  RECURSO_PROPRIO: agruparPrioridadesRecursosProprios(prioridadesLista),
});

const prioridades = {
  agruparPTRF: agruparPrioridadesPTRF,
  agruparPDDE: agruparPrioridadesPDDE,
  agruparRecursosProprios: agruparPrioridadesRecursosProprios,
  agruparPorRecurso: agruparPrioridadesPorRecurso,
};

const formatResumo = (
  valores,
  classeBase,
  { useStrong = true, hideCusteioCapital = false, isDespesa = false } = {}
) => {
  const Wrapper = useStrong ? "strong" : "span";
  const formatCategoria = (valor, categoria) => {
    if (isDespesa) {
      return formatMoneyBRL(valor);
    }
    return hideCusteioCapital && (categoria === "custeio" || categoria === "capital")
      ? "-"
      : formatMoneyBRL(valor);
  };

  const valorLivre = isDespesa ? "-" : formatMoneyBRL(valores.livre);

  return (
    <div className={classeBase}>
      <Wrapper>{formatCategoria(valores.custeio, "custeio")}</Wrapper>
      <Wrapper>{formatCategoria(valores.capital, "capital")}</Wrapper>
      <Wrapper>{valorLivre}</Wrapper>
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

  const adicionarLinhaTotal = (linhas, chaveTotal, nomeTotal, ocultarCusteioCapital = false) => {
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
      key: chaveTotal,
      nome: nomeTotal,
      receitas: valoresCategorias.normalize(totais.receitas),
      despesas: valoresCategorias.normalizeDespesas(totais.despesas),
      saldos: valoresCategorias.normalize(totais.saldos),
      isTotal: true,
      ocultarCusteioCapital,
    });
  };

  const calcularSecaoPTRF = (receitasPTRF, prioridadesPTRF) => {
    if (!receitasPTRF.length) return null;

    const linhas = receitasPTRF.map((item) => {
      const receita = calcularReceitaBase(item);
      const despesas = valoresCategorias.normalizeDespesas(
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

    adicionarLinhaTotal(linhas, "ptrf-total", "TOTAL");
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

      const despesas = valoresCategorias.normalizeDespesas(
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

    adicionarLinhaTotal(linhas, "pdde-total", "TOTAL");
    return { key: "pdde", titulo: "PDDE", linhas };
  };

  const calcularSecaoRecursosProprios = (
    receitasRecursosProprios,
    totalRecursosProprios,
    despesasRecursosProprios
  ) => {
    if (!receitasRecursosProprios.length) return null;

    const despesasNormalizadas = valoresCategorias.normalizeDespesas(
      despesasRecursosProprios || valoresCategorias.empty()
    );

    const linhas = receitasRecursosProprios.map((item) => {
      const receita = valoresCategorias.normalize({
        livre:
          totalRecursosProprios !== null
            ? totalRecursosProprios
            : calcularReceitaBase(item).livre,
      });

      const despesas = valoresCategorias.normalizeDespesas({
        custeio: despesasNormalizadas.custeio,
        capital: despesasNormalizadas.capital,
      });

      const saldo = valoresCategorias.saldo(receita, despesas);

      // Para recursos próprios, sempre usar "Recursos Próprios" como nome
      const nome = item.acao?.e_recursos_proprios ? "Recursos Próprios" : (item.acao?.nome || "-");

      return {
        key: item.uuid,
        nome,
        receitas: receita,
        despesas,
        saldos: saldo,
        ocultarCusteioCapital: true,
      };
    });

    adicionarLinhaTotal(linhas, "recurso_proprio-total", "TOTAL", true);
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
  const despesasRecursosProprios = prioridadesAgrupadas.RECURSO_PROPRIO || valoresCategorias.empty();
  const secaoRecursosProprios = calcularSecaoRecursosProprios(
    receitasAgrupadas.RECURSO_PROPRIO,
    totalRecursosProprios,
    despesasRecursosProprios
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

