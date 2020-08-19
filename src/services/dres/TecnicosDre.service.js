import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

const url = window.location.href;

export const getTecnicosDre = async (uuid_dre) => {
    return (await api.get(`api/tecnicos-dre/?dre__uuid=${uuid_dre}`, authHeader)).data
};


export const createTecnicoDre = async (payload) => {
    return api.post(`api/tecnicos-dre/`, payload, authHeader).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};

export const deleteTecnicoDre = async (uuid_tecnico) => {
    return api.delete(`api/tecnicos-dre/${uuid_tecnico}/`, authHeader).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};

export const getTecnicoDre = async (uuid_tecnico) => {
    return (await api.get(`api/tecnicos-dre/${uuid_tecnico}/`, authHeader)).data
};

export const getTecnicoDrePorRf = async (rf) => {
    return (await api.get(`api/tecnicos-dre/?rf=${rf}`, authHeader)).data
};
