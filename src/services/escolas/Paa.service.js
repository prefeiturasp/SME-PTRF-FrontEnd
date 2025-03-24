import api from "../api";
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
