import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getAtividadesEstatutariasPrevistas } from "../../../../../../../../services/escolas/Paa.service";

const getPaaUuid = () => localStorage.getItem("PAA");

export const useGetAtividadesEstatutarias = (filtros = {}) => {
  const filtrosMemo = useMemo(() => ({ ...filtros }), [filtros]);
  const paaUuid = getPaaUuid();

  const query = useQuery(
    ["atividades-estatutarias-previstas", paaUuid, filtrosMemo],
    () => getAtividadesEstatutariasPrevistas(paaUuid),
    {
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: true,
      enabled: Boolean(paaUuid),
    }
  );

  const atividades = useMemo(() => {
    const lista = Array.isArray(query.data?.results)
      ? query.data.results
      : Array.isArray(query.data)
      ? query.data
      : [];

    return lista.map((item) => {
      const data = item.data ?? item.data_prevista ?? item.dataPrevista ?? "";
      const ano = data ? new Date(data).getFullYear() : "";
      const mesLabel =
        item.mesAno ??
        item.mes_ano ??
        item?.atividade_estatutaria?.mes_label ??
        "";
      const tipoLabel =
        item.tipoAtividade ??
        item.tipo_atividade ??
        item?.atividade_estatutaria?.tipo_label ??
        "";

      return {
        ...item,
        uuid: item.uuid,
        tipoAtividade: tipoLabel,
        tipoAtividadeKey:
          item.tipoAtividadeKey ??
          item.tipo ??
          item?.atividade_estatutaria?.tipo ??
          "",
        data,
        descricao:
          item.descricao ??
          item.descricao_atividade ??
          item?.atividade_estatutaria?.nome ??
          "",
        mes: item.mes ?? item?.atividade_estatutaria?.mes ?? "",
        mesLabel,
        mesAno: data && mesLabel ? `${mesLabel}/${ano}` : mesLabel || "",
      };
    });
  }, [query.data]);

  const quantidade = query.data?.count ?? atividades.length;

  return {
    ...query,
    atividades,
    quantidade,
  };
};
