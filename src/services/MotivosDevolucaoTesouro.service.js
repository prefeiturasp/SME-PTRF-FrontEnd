import api from './api';
import {TOKEN_ALIAS} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getMotivosDevolucaoTesouro = async (filter, currentPage) => {
    const {nome} = filter;
    return (await api.get(`/api/motivos-devolucao-ao-tesouro/`,{
        ...authHeader,
        params: {
            nome: nome,
            page: currentPage,
        }
    })).data
}

export const postMotivosDevolucaoTesouro = async (payload) => {
    return (await api.post(`api/motivos-devolucao-ao-tesouro/`, {
            ...payload
        },
        authHeader,
    ))
};

export const patchMotivosDevolucaoTesouro = async (uuidMotivoDevolucaoTesouro, payload) => {
    return (await api.patch(`api/motivos-devolucao-ao-tesouro/${uuidMotivoDevolucaoTesouro}/`, {
            ...payload
        },
        authHeader,
    ))
};

export const deleteMotivoDevolucaoTesouro = async (uuidMotivoDevolucaoTesouro) => {
    return (await api.delete(`api/motivos-devolucao-ao-tesouro/${uuidMotivoDevolucaoTesouro}/`, authHeader));
};
