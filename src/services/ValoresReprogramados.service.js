import api from './api';
import {TOKEN_ALIAS} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getValoresReprogramados = async(associacao_uuid) => {
    return (await api.get(`/api/valores-reprogramados/get-valores-reprogramados/?associacao_uuid=${associacao_uuid}`, authHeader)).data
}

export const patchSalvarValoresReprogramados = async (payload) => {
    return (await api.patch(`/api/valores-reprogramados/salvar-valores-reprogramados/`, payload, authHeader)).data
};

export const patchConcluirValoresReprogramados = async (payload) => {
    return (await api.patch(`/api/valores-reprogramados/concluir-valores-reprogramados/`, payload, authHeader)).data
};

export const getStatusValoresReprogramados = async(associacao_uuid) => {
    return (await api.get(`/api/valores-reprogramados/get-status-valores-reprogramados/?associacao_uuid=${associacao_uuid}`, authHeader)).data
}