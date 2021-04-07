import api from './api'
import { TOKEN_ALIAS } from './auth.service.js';

const authHeader = {
  headers: {
    'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
    'Content-Type': 'application/json'
  }
};

export const getVersaoApi = async () => {
  return (await api.get(`api/versao`, authHeader)).data['versao']
}

export const getAmbientes = async () => {
  return (await api.get(`api/ambientes/`, authHeader)).data
}
