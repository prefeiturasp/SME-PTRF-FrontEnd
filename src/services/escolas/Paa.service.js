import api from "../api/index.js";
import { TOKEN_ALIAS } from "../auth.service.js";
import { addFiltersToQueryString } from "../../utils/Api.js";


const authHeader = () => ({
  headers: {
    Authorization: `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
    "Content-Type": "application/json",
  },
});

export const getSaldoAtualPorAcaoAssociacao = async (acaoAssociacaoUUID) => {
  return (
    await api.get(
      `api/acoes-associacoes/${acaoAssociacaoUUID}/obter-saldo-atual/`,
      authHeader()
    )
  ).data;
};

export const getPaa = async (uuid) => {
  return (await api.get(`api/paa/${uuid}/`, authHeader())).data;
};

export const patchPaa = async (uuid, payload) => {
  return (await api.patch(`api/paa/${uuid}/`, payload, authHeader())).data;
};

export const postReceitasPrevistasPaa = async (payload) => {
  return (await api.post(`api/receitas-previstas-paa/`, payload, authHeader()))
    .data;
};

export const patchReceitasPrevistasPaa = async (uuid, payload) => {
  return (
    await api.patch(
      `api/receitas-previstas-paa/${uuid}/`,
      payload,
      authHeader()
    )
  ).data;
};

export const downloadPdfLevantamentoPrioridades = async (associacao_uuid) => {
  try {
    const response = await api.get(
      `/api/paa/download-pdf-levantamento-prioridades/`,
      {
        params: {
          associacao_uuid,
        },
        responseType: "blob",
        timeout: 30000,
        ...authHeader(),
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `levantamento_prioridades_paa.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro no download do PDF:", error);
    return error.response;
  }
};

// Recursos Próprios
export const getRecursosProprios = async (associacaoUUID, page = 1) => {
  return (
    await api.get(
      `api/recursos-proprios-paa/?associacao__uuid=${associacaoUUID}&page=${page}&page_size=20`,
      authHeader()
    )
  ).data;
};

export const postRecursoProprioPaa = async (payload) => {
  return (await api.post(`api/recursos-proprios-paa/`, payload, authHeader()))
    .data;
};

export const patchRecursoProprioPaa = async (uuid, payload) => {
  return (
    await api.patch(`api/recursos-proprios-paa/${uuid}/`, payload, authHeader())
  ).data;
};

export const deleteRecursoProprioPaa = async (uuid) => {
  return (await api.delete(`api/recursos-proprios-paa/${uuid}/`, authHeader()))
    .data;
};

export const getTotalizadorRecursoProprio = async (associacaoUUID) => {
  return (
    await api.get(
      `api/recursos-proprios-paa/total/?associacao__uuid=${associacaoUUID}`,
      authHeader()
    )
  ).data;
};

// Fonte Recurso
export const getFontesRecursos = async () => {
  return (await api.get(`api/fontes-recursos-paa/`, authHeader())).data;
};
export const getAcoesPDDE = async (currentPage = 1, rowsPerPage = 20) => {
  return (
    await api.get(
      `/api/acoes-pdde/receitas-previstas-pdde/?page=${currentPage}&page_size=${rowsPerPage}&paa_uuid=${localStorage.getItem("PAA")}`,
      authHeader()
    )
  ).data;
};

// PDDE
export const getProgramasPddeTotais = async (rowsPerPage = 1000) => {
  return (await api.get(`api/programas-pdde/totais/?paa_uuid=${localStorage.getItem("PAA")}&page_size=${rowsPerPage}`, authHeader())).data;
};

export const postReceitaPrevistaPDDE = async (payload) => {
  return (await api.post(`api/receitas-previstas-pdde/`, payload, authHeader())).data;
};

export const patchReceitaPrevistaPDDE = async (uuid, payload) => {
  return (
    await api.patch(`api/receitas-previstas-pdde/${uuid}/`, payload, authHeader())
  ).data;
};

export const getPaaReceitasPrevistas = async (uuid) => {
  return (
    await api.get(`api/paa/${uuid}/receitas-previstas/`, authHeader())
  ).data;
};

export const postDesativarAtualizacaoSaldoPAA = async (uuid) => {
  return (
    await api.post(`api/paa/${uuid}/desativar-atualizacao-saldo/`, {}, authHeader())
  ).data;
};

export const postAtivarAtualizacaoSaldoPAA = async (uuid) => {
  return (
    await api.post(`api/paa/${uuid}/ativar-atualizacao-saldo/`, {}, authHeader())
  ).data;
};

export const postImportarPrioridades = async (uuid_paa_atual, uuid_paa_anterior, confirmar=0) => {
  return (await api.post(
    `api/paa/${uuid_paa_atual}/importar-prioridades/${uuid_paa_anterior}/?confirmar=${confirmar}`,
    {}, authHeader())).data;
}

// Prioridades
export const getPrioridadesTabelas = async () => {
  return (await api.get(`api/prioridades-paa/tabelas/`, authHeader())).data;
};

export const getPrioridades = async (filtros, page=1, page_size=20) => {
  let queryString = `?paa__uuid=${localStorage.getItem(
    "PAA"
  )}&page=${page}&page_size=${page_size}`;
  queryString = addFiltersToQueryString(queryString, filtros);
  return (await api.get(`api/prioridades-paa/${queryString}`, authHeader())).data;
};

export const getPrioridadesRelatorio = async (filtros = {}) => {
  let queryString = `?paa__uuid=${localStorage.getItem("PAA")}`;
  queryString = addFiltersToQueryString(queryString, filtros);
  return (await api.get(`api/prioridades-paa-relatorio/${queryString}`, authHeader())).data;
};

export const postPrioridade = async (payload) => {
  return (await api.post(`api/prioridades-paa/`, payload, authHeader())).data;
}

export const postDuplicarPrioridade = async (uuid) => {
  return (await api.post(`api/prioridades-paa/${uuid}/duplicar/`, {}, authHeader())).data;
}

export const getResumoPrioridades = async () => {
  return (await api.get(`api/paa/${localStorage.getItem("PAA")}/resumo-prioridades/`, authHeader())).data;
}

export const getAtividadesEstatutariasPrevistas = async (paaUuid) => {
  if (!paaUuid) {
    return { results: [] };
  }

  return (
    await api.get(`api/paa/${paaUuid}/atividades-estatutarias-previstas/`, authHeader())
  ).data;
};

export const getPaaVigenteEAnteriores = async (associacaoUuid) => {
  return (
    await api.get(
      `api/paa/paa-vigente-e-anteriores/?associacao_uuid=${associacaoUuid}`,
      authHeader()
    )
  ).data;
};

export const getAtividadesEstatutariasDisponiveis = async (paaUuid) => {
  if (!paaUuid) {
    return { results: [] };
  }

  return (
    await api.get(`api/paa/${paaUuid}/atividades-estatutarias-disponiveis/`, authHeader())
  ).data;
};

const patchAtividadesEstatutarias = async (paaUuid, atividades = []) => {
  if (!paaUuid) {
    throw new Error("PAA UUID é obrigatório para atualizar atividades estatutárias.");
  }

  return (
    await api.patch(
      `api/paa/${paaUuid}/`,
      { atividades_estatutarias: atividades },
      authHeader()
    )
  ).data;
};

export const createAtividadeEstatutariaPaa = async (paaUuid, atividade) => {
  return patchAtividadesEstatutarias(paaUuid, [
    {
      nome: atividade?.nome,
      tipo: atividade?.tipo,
      data: atividade?.data,
    },
  ]);
};

export const linkAtividadeEstatutariaExistentePaa = async (paaUuid, atividade) => {
  return patchAtividadesEstatutarias(paaUuid, [
    {
      atividade_estatutaria: atividade?.atividade_estatutaria,
      data: atividade?.data,
    },
  ]);
};

export const updateAtividadeEstatutariaPaa = async (paaUuid, atividade) => {
  return patchAtividadesEstatutarias(paaUuid, [
    {
      atividade_estatutaria: atividade?.atividade_estatutaria,
      nome: atividade?.nome,
      tipo: atividade?.tipo,
      data: atividade?.data,
    },
  ]);
};

export const deleteAtividadeEstatutariaPaa = async (paaUuid, atividadeUuid) => {
  return patchAtividadesEstatutarias(paaUuid, [
    {
      atividade_estatutaria: atividadeUuid,
      _destroy: true,
    },
  ]);
};

export const getRecursosPropriosPrevistos = async (paaUuid) => {
  if (!paaUuid) {
    return [];
  }

  return (
    await api.get(`api/paa/${paaUuid}/recursos-proprios-previstos/`, authHeader())
  ).data;
};

export const patchPrioridade = async (uuid, payload) => {
  return (await api.patch(`api/prioridades-paa/${uuid}/`, payload, authHeader())).data;
}

export const deletePrioridade = async (uuid) => {
  return (await api.delete(`api/prioridades-paa/${uuid}/`, authHeader())).data;
}

export const deletePrioridadesEmLote = async (payload) => {
  return (await api.post(`api/prioridades-paa/excluir-lote/`, payload, authHeader())).data;
}

export const getObjetivosPaa = async () => {
  return (await api.get(`api/paa/${localStorage.getItem("PAA")}/objetivos/`, authHeader())).data;
}
