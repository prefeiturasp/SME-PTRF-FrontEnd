import api from './api';
import {TOKEN_ALIAS} from "./auth.service";

const authHeader = ()=>({
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
});

export const getMotivosRejeicaoEncerramentoConta = async (filter, currentPage) => {
    const {nome} = filter;
    return (await api.get(`/api/motivos-rejeicao-encerramento-conta/`,{
        ...authHeader(),
        params: {
            nome: nome,
            page: currentPage,
        }
    })).data
}

export const postMotivosRejeicaoEncerramentoConta = async (payload) => {
    return (await api.post(`api/motivos-rejeicao-encerramento-conta/`, {
            ...payload
        },
        authHeader(),
    ))
};

export const patchMotivosRejeicaoEncerramentoConta = async (uuidMotivoRejeicaoEncerramentoConta, payload) => {
    return (await api.patch(`api/motivos-rejeicao-encerramento-conta/${uuidMotivoRejeicaoEncerramentoConta}/`, {
            ...payload
        },
        authHeader(),
    ))
};

export const deleteMotivoRejeicaoEncerramentoConta = async (uuidMotivoRejeicaoEncerramentoConta) => {
    return (await api.delete(`api/motivos-rejeicao-encerramento-conta/${uuidMotivoRejeicaoEncerramentoConta}/`, authHeader()));
};
