import api from './Api'
import { TOKEN_ALIAS } from './auth.service.js';
import {ASSOCIACAO_UUID} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getAssociacao = async () => {
    return (await api.get(`api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
};

export const alterarAssociacao = async (payload) => {
    return api.put(`api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/`, payload, authHeader).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};

export const getPeriodoFechado = async (data_verificacao) => {
    return (await api.get(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/status-periodo/?data=${data_verificacao}`, authHeader)).data
};

export const getMembrosAssociacao = async () => {
    return (await api.get(`/api/membros-associacao/`, authHeader)).data
};

export const criarMembroAssociacao = async (payload) => {
    ///api/membros-associacao/
    return api.post(`api/membros-associacao/`, payload, authHeader)
    .then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};

export const editarMembroAssociacao = async (payload, uuid) => {
    ///api/membros-associacao/
    return api.put(`/api/membros-associacao/${uuid}`, payload, authHeader)
    .then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};
