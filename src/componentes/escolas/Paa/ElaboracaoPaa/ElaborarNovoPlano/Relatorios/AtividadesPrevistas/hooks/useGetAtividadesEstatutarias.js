import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  getAtividadesEstatutariasDisponiveis,
  getAtividadesEstatutariasPrevistas,
} from "../../../../../../../../services/escolas/Paa.service";

const getPaaUuid = () => localStorage.getItem("PAA");

const toArray = (payload) => {
  if (Array.isArray(payload?.results)) {
    return payload.results;
  }
  if (Array.isArray(payload)) {
    return payload;
  }
  return [];
};

const montarMesAno = (mesLabel, data) => {
  if (mesLabel && data) {
    const ano = new Date(data).getFullYear();
    return Number.isNaN(ano) ? mesLabel : `${mesLabel}/${ano}`;
  }
  return mesLabel || "";
};

const normalizaDisponivel = (item) => ({
  uuid: item.uuid,
  atividadeEstatutariaUuid: item.uuid,
  descricao: item.nome || "",
  tipoAtividade: item.tipo_label || "",
  tipoAtividadeKey: item.tipo || "",
  mes: item.mes ?? "",
  mesLabel: item.mes_label || "",
  status: item.status ?? null,
  statusLabel: item.status_label || "",
  isGlobal: !item.paa,
  origem: item.paa ? "local" : "global",
  data: "",
  mesAno: item.mes_label || "",
  vinculoUuid: null,
  isNovo: false,
  emEdicao: false,
});

const normalizaPrevista = (item) => {
  const atividadeUuid =
    item?.atividade_estatutaria?.uuid ||
    item?.atividade_estatutaria ||
    item.uuid;

  const data =
    item?.data ?? item?.data_prevista ?? item?.dataPrevista ?? "";

  const mesLabel =
    item?.mes_label ?? item?.atividade_estatutaria?.mes_label ?? "";

  return {
    uuid: atividadeUuid || item.uuid,
    atividadeEstatutariaUuid: atividadeUuid,
    vinculoUuid: item?.uuid,
    descricao:
      item?.descricao ??
      item?.nome ??
      item?.descricao_atividade ??
      item?.atividade_estatutaria?.nome ??
      "",
    tipoAtividade:
      item?.tipo_label ??
      item?.tipoAtividade ??
      item?.atividade_estatutaria?.tipo_label ??
      "",
    tipoAtividadeKey:
      item?.tipo ??
      item?.tipoAtividadeKey ??
      item?.atividade_estatutaria?.tipo ??
      "",
    mes: item?.mes ?? item?.atividade_estatutaria?.mes ?? "",
    mesLabel,
    status: item?.status ?? item?.atividade_estatutaria?.status ?? null,
    statusLabel:
      item?.status_label ?? item?.atividade_estatutaria?.status_label ?? "",
    data,
    isGlobal: item?.atividade_estatutaria
      ? !item?.atividade_estatutaria?.paa
      : false,
    origem: item?.atividade_estatutaria?.paa ? "local" : "global",
    isNovo: false,
    emEdicao: false,
  };
};

const mergeAtividades = (disponiveisPayload, previstasPayload) => {
  const disponiveis = toArray(disponiveisPayload).map(normalizaDisponivel);
  const previstas = toArray(previstasPayload).map(normalizaPrevista);

  const previstasMap = new Map();
  previstas.forEach((p) => {
    const key = p.atividadeEstatutariaUuid || p.uuid;
    previstasMap.set(key, p);
  });

  const resultado = [];
  const usados = new Set();

  disponiveis.forEach((disp) => {
    const key = disp.uuid;
    const prevista = previstasMap.get(key);

    if (prevista) {
      usados.add(key);

      resultado.push({
        ...disp,
        descricao: prevista.descricao || disp.descricao,
        tipoAtividade: prevista.tipoAtividade || disp.tipoAtividade,
        tipoAtividadeKey:
          prevista.tipoAtividadeKey || disp.tipoAtividadeKey,
        mes: prevista.mes ?? disp.mes,
        mesLabel: prevista.mesLabel || disp.mesLabel,
        status: prevista.status ?? disp.status,
        statusLabel: prevista.statusLabel || disp.statusLabel,
        data: prevista.data || disp.data,
        vinculoUuid: prevista.vinculoUuid || disp.vinculoUuid,
        mesAno: montarMesAno(
          prevista.mesLabel || disp.mesLabel,
          prevista.data || disp.data
        ),
      });
    } else {
      resultado.push({
        ...disp,
        mesAno: montarMesAno(disp.mesLabel, disp.data),
      });
    }
  });

  previstas.forEach((prevista) => {
    const key = prevista.atividadeEstatutariaUuid || prevista.uuid;

    if (!usados.has(key)) {
      resultado.push({
        ...prevista,
        mesAno: montarMesAno(prevista.mesLabel, prevista.data),
      });
    }
  });

  return resultado;
};


export const useGetAtividadesEstatutarias = (filtros = {}) => {
  const filtrosMemo = useMemo(() => ({ ...filtros }), [filtros]);
  const paaUuid = getPaaUuid();

  const query = useQuery({
    queryKey: ["atividades-estatutarias", paaUuid, filtrosMemo],
    queryFn: async () => {
      const [disponiveisResp, previstasResp] = await Promise.all([
        getAtividadesEstatutariasDisponiveis(paaUuid),
        getAtividadesEstatutariasPrevistas(paaUuid),
      ]);
      return mergeAtividades(disponiveisResp, previstasResp);
    },
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: true,
    enabled: Boolean(paaUuid),
  });

  const atividades = query.data ?? [];
  const quantidade = atividades.length;

  return {
    ...query,
    atividades,
    quantidade,
  };
};
