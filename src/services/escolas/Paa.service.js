import api from "../api/index.js";
import { TOKEN_ALIAS } from "../auth.service.js";

const authHeader = {
  headers: {
    Authorization: `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
    "Content-Type": "application/json",
  },
};

export const getSaldoAtualPorAcaoAssociacao = async (acaoAssociacaoUUID) => {
  return (
    await api.get(
      `api/acoes-associacoes/${acaoAssociacaoUUID}/obter-saldo-atual/`,
      authHeader
    )
  ).data;
};

export const postReceitasPrevistasPaa = async (payload) => {
  return (await api.post(`api/receitas-previstas-paa/`, payload, authHeader))
    .data;
};

export const patchReceitasPrevistasPaa = async (uuid, payload) => {
  return (
    await api.patch(`api/receitas-previstas-paa/${uuid}/`, payload, authHeader)
  ).data;
};
