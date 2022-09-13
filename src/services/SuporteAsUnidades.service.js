import api from './api'
import { TOKEN_ALIAS } from './auth.service.js';

const authHeader = {
  headers: {
    'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
    'Content-Type': 'application/json'
  }
};

export const geTextoExplicativoSuporteUnidades = async (visao) => {
  if (visao === "DRE") {
    return (await api.get(`/api/parametros-dre/texto-pagina-suporte/`, authHeader)).data
  }

  if (visao === "SME") {
    return (await api.get(`/api/parametros-sme/texto-pagina-suporte/`, authHeader)).data
  }

  return {detail: "Erro. Visão não definida, esperado DRE ou SME."}
}
