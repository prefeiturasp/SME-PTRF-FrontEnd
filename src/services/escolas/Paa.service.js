import api from "../api/index.js";
import { TOKEN_ALIAS } from "../auth.service.js";

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

export const postReceitasPrevistasPaa = async (payload) => {
  return (await api.post(`api/receitas-previstas-paa/`, payload, authHeader()))
    .data;
};

export const patchReceitasPrevistasPaa = async (uuid, payload) => {
  return (
    await api.patch(`api/receitas-previstas-paa/${uuid}/`, payload, authHeader())
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
        responseType: 'blob',
        timeout: 30000,
        ...authHeader(),
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `levantamento_prioridades_paa.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro no download do PDF:", error);
    return error.response;
  }
};