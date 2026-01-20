import React, { useCallback, useMemo } from "react";
import { Button } from "antd";
import { RelatorioTabelaGrupo } from "../components/RelatorioTabelaGrupo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useGetTodos } from "../../../ElaborarNovoPlano/ReceitasPrevistas/hooks/useGetReceitasPrevistasOutrosRecursosPeriodo";
import { planoOrcamentarioUtils } from "./utils";

const {
  numero,
  valoresCategorias,
  adicionarValorPorTipo,
  identificarRecursoPrioridade,
  adicionarLinhaTotal,
} = planoOrcamentarioUtils;

const SessaoOutrosRecursos = ({
  prioridades = [],
  totalRecursosProprios,
  handleIrParaPrioridades,
  handleIrParaReceitas,
  colunas,
}) => {
  const { data: receitasOutrosRecursos } = useGetTodos();

  const agruparRecursos = useCallback(
    (receitasLista = [], prioridadesLista = [], _totalRecursosProprios = 0) => {
      const recursoProprio = prioridadesLista.reduce((acc, prioridade) => {
        const recurso = identificarRecursoPrioridade(prioridade);
        if (recurso !== "RECURSO_PROPRIO") return acc;

        const valor = numero(prioridade.valor_total);
        if (!valor) return acc;

        adicionarValorPorTipo(acc, prioridade, valor);
        return acc;
      }, valoresCategorias.empty());

      const despesasOutrosRecursos = prioridadesLista.filter(
        (p) => p.recurso === "OUTRO_RECURSO"
      );

      const outrosRecursosMap = receitasLista.reduce((acc, outroRecurso) => {
        const uuid = outroRecurso.outro_recurso_objeto.uuid;
        const nome = outroRecurso.outro_recurso_objeto.nome;

        let registro = acc.get(uuid) || {
          uuid,
          nome,
          receitas: valoresCategorias.empty(),
          despesas: valoresCategorias.empty(),
        };

        // Verifica as receitas
        if (outroRecurso.receitas_previstas) {
          const receitas = outroRecurso.receitas_previstas.reduce(
            (acc, current) => {
              acc.custeio +=
                numero(current.saldo_custeio) +
                numero(current.previsao_valor_custeio);

              acc.capital +=
                numero(current.saldo_capital) +
                numero(current.previsao_valor_capital);

              acc.livre +=
                numero(current.saldo_livre) +
                numero(current.previsao_valor_livre);

              return acc;
            },
            { custeio: 0, capital: 0, livre: 0 }
          );
          registro = { ...registro, receitas };
        }

        // Verifica as Despesas
        const despesasDoRecurso = despesasOutrosRecursos.filter(
          (d) => d.outro_recurso === uuid
        );

        if (despesasDoRecurso.length) {
          const despesas = despesasDoRecurso.reduce(
            (acc, curr) => {
              const valorTotal = numero(curr.valor_total);
              if (curr.tipo_aplicacao === "CUSTEIO") {
                return { ...acc, custeio: acc.custeio + valorTotal };
              }
              if (curr.tipo_aplicacao === "CAPITAL") {
                return { ...acc, capital: acc.capital + valorTotal };
              }
              if (curr.tipo_aplicacao === "LIVRE") {
                return { ...acc, livre: acc.livre + valorTotal };
              }
            },
            { custeio: 0, capital: 0, livre: 0 }
          );

          registro = { ...registro, despesas };
        }

        acc.set(uuid, registro);

        return acc;
      }, new Map());

      const outrosRecursosOrdenados = Array.from(
        outrosRecursosMap.values()
      ).sort((a, b) =>
        a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
      );

      const resultado = [];

      resultado.push({
        tipo: "RECURSO_PROPRIO",
        nome: "Recurso Próprio",
        ...recursoProprio,
      });

      outrosRecursosOrdenados.forEach((recurso) => {
        resultado.push({
          tipo: "OUTRO_RECURSO",
          uuid: recurso.uuid,
          nome: recurso.nome,
          ...recurso,
        });
      });

      const linhas = resultado.map((linha) => {
        if (linha.tipo === "RECURSO_PROPRIO") {
          const despesasNormalizadas = valoresCategorias.normalizeDespesas(
            linha || valoresCategorias.empty()
          );

          const receita = valoresCategorias.normalize({
            livre: _totalRecursosProprios !== null ? _totalRecursosProprios : 0,
          });

          const despesas = valoresCategorias.normalizeDespesas({
            custeio: despesasNormalizadas.custeio,
            capital: despesasNormalizadas.capital,
          });

          const saldo = valoresCategorias.saldo(receita, despesas);
          return {
            key: linha.uuid,
            nome: "Recursos Próprios",
            receitas: receita,
            despesas,
            saldos: saldo,
            ocultarCusteioCapital: true,
          };
        }

        // OUTROS RECURSOS
        const despesas = valoresCategorias.normalizeDespesas(linha.despesas);
        const receitas = valoresCategorias.normalize(linha.receitas);
        const saldo = valoresCategorias.saldo(receitas, despesas);

        return {
          key: linha.uuid,
          nome: linha.nome || "-",
          receitas: receitas,
          despesas: despesas,
          saldos: saldo,
          ocultarCusteioCapital: false,
        };
      });

      adicionarLinhaTotal(linhas, "recurso_proprio-total", "TOTAL", true);

      return linhas;
    },
    []
  );

  const linhas = useMemo(() => {
    return agruparRecursos(
      receitasOutrosRecursos,
      prioridades,
      totalRecursosProprios
    );
  }, [
    agruparRecursos,
    receitasOutrosRecursos,
    prioridades,
    totalRecursosProprios,
  ]);

  const render = useCallback(() => {
    const destinoReceitas = "recursos-proprios";

    return (
      <div className="relatorio-visualizacao__sections">
        <RelatorioTabelaGrupo
          title="Outros Recursos"
          dataSource={linhas}
          columns={colunas}
          rowKey={(linha) => linha?.key}
          headerExtra={
            <div className="relatorio-plano-orcamentario__actions">
              {destinoReceitas && (
                <Button
                  className="btn btn-success"
                  onClick={() => handleIrParaReceitas(destinoReceitas)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                  Editar receitas
                </Button>
              )}
              <Button
                className="btn btn-success"
                onClick={handleIrParaPrioridades}
              >
                Editar prioridades
              </Button>
            </div>
          }
          tableProps={{
            className: "relatorio-plano-orcamentario__table",
            rowClassName: (linha) =>
              linha?.isTotal
                ? "relatorio-plano-orcamentario__table-total-row"
                : "",
          }}
        />
      </div>
    );
  }, [colunas, handleIrParaPrioridades, handleIrParaReceitas, linhas]);

  return <div>{render()}</div>;
};

export default SessaoOutrosRecursos;
