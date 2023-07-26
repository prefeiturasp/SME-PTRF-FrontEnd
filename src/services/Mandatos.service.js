import api from './api';
import {TOKEN_ALIAS} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getMandatos = async (filter, currentPage) => {
    const {referencia} = filter;
    return (await api.get(`/api/mandatos/`,{
        ...authHeader,
        params: {
            referencia: referencia,
            page: currentPage,
        }
    })).data
}

export const postMandato = async (payload) => {
    return (await api.post(`api/mandatos/`, {
            ...payload
        },
        authHeader,
    ))
};

export const patchMandato = async (uuidMandato, payload) => {
    return (await api.patch(`api/mandatos/${uuidMandato}/`, {
            ...payload
        },
        authHeader,
    ))
};
