import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getTodasAcoesDasAssociacoes = async () => {
    return (await api.get(`/api/acoes-associacoes/`, authHeader)).data
};

export const getListaDeAcoes = async () => {
    return (await api.get(`/api/acoes/`, authHeader)).data
};

export const getFiltros = async (nome='', acao__uuid, status) => {
    return (await api.get(`/api/acoes-associacoes/?nome=${nome}${acao__uuid ? '&acao__uuid='+acao__uuid : ''}${status ? '&status='+status : ''}`, authHeader)).data
};

export const postAddAcaoAssociacao = async (payload) => {
    return (await api.post(`/api/acoes-associacoes/`, payload, authHeader)).data
};