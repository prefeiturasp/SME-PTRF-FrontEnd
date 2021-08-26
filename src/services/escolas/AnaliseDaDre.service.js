import api from '../api'
import {TOKEN_ALIAS} from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getListaDeAnalises = async (associacao_uuid) => {
    return (await api.get(`api/associacoes/${associacao_uuid}/status-prestacoes/`, authHeader)).data
};

export const getListaDeAnalisesFiltros = async (associacao_uuid, periodo_uuid, status_pc) => {
    return (await api.get(`api/associacoes/${associacao_uuid}/status-prestacoes/?periodo_uuid=${periodo_uuid}&status_pc=${status_pc}`, authHeader)).data
};