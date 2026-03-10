import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = ()=>({
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
});

export const updateProcessoAssociacao = async (uuid_processo, payload) => {
    return api.patch(`api/processos-associacao/${uuid_processo}/`, payload, authHeader()).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};


export const createProcessoAssociacao = async (payload) => {
    return api.post(`api/processos-associacao/`, payload, authHeader()).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};

export const deleteProcessoAssociacao = async (uuid_processo) => {
    return api.delete(`api/processos-associacao/${uuid_processo}/`, authHeader()).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};

export const getPeriodosDisponiveis = async (associacao_uuid, ano, processo_uuid='', recurso_uuid='') => {
    let url = `api/processos-associacao/periodos-disponiveis/?associacao_uuid=${associacao_uuid}&ano=${ano}`;
    if (processo_uuid) {
        url += `&processo_uuid=${processo_uuid}`;
    }
    if (recurso_uuid) {
        url += `&recurso_uuid=${recurso_uuid}`;
    }
    return (await api.get(url, authHeader())).data
};
