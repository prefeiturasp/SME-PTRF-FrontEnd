import api from "./api";
import { TOKEN_ALIAS } from "./auth.service.js";

const authHeader = () => ({
  headers: {
    Authorization: `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
    "Content-Type": "application/json",
  },
});

export const getRecursos = async () => {
  const { data } = await api.get("/api/recursos", authHeader());
  return data;
};

export const getRecursosPorUnidade = async (unidade_uuid) => {
  const { data } = await api.get(`/api/recursos/por-unidade/?uuid_unidade=${unidade_uuid}`, authHeader());
  return data;
};
