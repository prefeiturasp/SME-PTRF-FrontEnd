import api from "../api";
import { ASSOCIACAO_UUID, TOKEN_ALIAS } from "../auth.service.js";

const authHeader = () => ({
  headers: {
    Authorization: `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
    "Content-Type": "application/json",
  },
});

export const postBemProduzido = async (payload) => {
  return (
    await api.post(
      `api/bens-produzidos/`,
      { ...payload, associacao: localStorage.getItem(ASSOCIACAO_UUID) },
      authHeader()
    )
  ).data;
};
