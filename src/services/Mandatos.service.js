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

export const getMandatoVigente = async (associacao_uuid) => {
    return (await api.get(`/api/mandatos/mandato-vigente/`,{
        ...authHeader,
        params: {
            associacao_uuid: associacao_uuid,
        }
    })).data
}

export const getCargosDaComposicao = async (composicao_uuid) => {
    return (await api.get(`/api/cargos-composicao/cargos-da-composicao/`,{
        ...authHeader,
        params: {
            composicao_uuid: composicao_uuid,
        }
    })).data
}

export const getComposicao = async (composicao_uuid) => {
    return (await api.get(`/api/composicoes/${composicao_uuid}/`,{
        ...authHeader,
    })).data
}
