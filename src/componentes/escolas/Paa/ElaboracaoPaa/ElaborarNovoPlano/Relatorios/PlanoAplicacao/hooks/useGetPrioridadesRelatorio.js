import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getPrioridadesRelatorio } from "../../../../../../../../services/escolas/Paa.service";
import { parseMoneyCentsBRL } from "../../../../../../../../utils/money";

const mapPrioridade = (item) => {
  const valorTotalNumber =
    item?.valor_total !== null && item?.valor_total !== undefined
      ? (() => {
          const parsed =
            typeof item.valor_total === "number"
              ? item.valor_total
              : parseMoneyCentsBRL(String(item.valor_total));
          return parsed !== null ? parsed : Number(item.valor_total);
        })()
      : null;
  const acao =
    item?.acao_associacao_objeto?.nome ||
    item?.acao_pdde_objeto?.nome ||
    (item?.recurso === "RECURSO_PROPRIO" ? "Recurso Próprio" : "");

  return {
    ...item,
    acao,
    valor_total: valorTotalNumber,
  };
};

export const useGetPrioridadesRelatorio = (filtros = {}) => {
  const filtrosDependencia = useMemo(() => ({ ...filtros }), [filtros]);

  const query = useQuery(
    ["prioridades-relatorio", filtrosDependencia],
    () => getPrioridadesRelatorio(filtrosDependencia),
    {
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: true,
    }
  );

  const prioridades = useMemo(() => {
    const lista = Array.isArray(query.data?.results)
      ? query.data.results
      : Array.isArray(query.data)
      ? query.data
      : [];

    return lista.map(mapPrioridade);
  }, [query.data]);

  const quantidade = query.data?.count ?? prioridades.length;

  return {
    ...query,
    prioridades,
    quantidade,
  };
};

