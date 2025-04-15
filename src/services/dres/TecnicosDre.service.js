import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = ()=>({
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
});

export const getTecnicosDre = async (uuid_dre) => {
    return (await api.get(`api/tecnicos-dre/?dre__uuid=${uuid_dre}`, authHeader())).data
};


export const createTecnicoDre = async (payload) => {
    return api.post(`api/tecnicos-dre/`, payload, authHeader()).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};

export const deleteTecnicoDre = async (uuid_tecnico, transferir_para = null) => {
    return (await api.delete(`api/tecnicos-dre/${uuid_tecnico}${transferir_para ? "?transferir_para="+transferir_para : ''}`, authHeader()))
};

export const getTecnicoDre = async (uuid_tecnico) => {
    return (await api.get(`api/tecnicos-dre/${uuid_tecnico}/`, authHeader())).data
};

export const getTecnicoDrePorRf = async (rf) => {
    return (await api.get(`api/tecnicos-dre/?rf=${rf}`, authHeader())).data
};

export const updateTecnicoDre = async (uuid_tecnico, payload) => {
    return (await api.patch(`api/tecnicos-dre/${uuid_tecnico}/`, payload, authHeader())).data
};
