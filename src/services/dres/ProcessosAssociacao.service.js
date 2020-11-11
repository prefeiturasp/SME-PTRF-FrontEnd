import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const updateProcessoAssociacao = async (uuid_processo, payload) => {
    return api.patch(`api/processos-associacao/${uuid_processo}/`, payload, authHeader).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};


export const createProcessoAssociacao = async (payload) => {
    return api.post(`api/processos-associacao/`, payload, authHeader).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};

export const deleteProcessoAssociacao = async (uuid_processo) => {
    return api.delete(`api/processos-associacao/${uuid_processo}/`, authHeader).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};
