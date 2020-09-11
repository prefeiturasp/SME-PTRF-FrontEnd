import api from './api';
import {TOKEN_ALIAS} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getQuantidadeNaoLidas = async () =>{
    return (await api.get(`/api/notificacoes/quantidade-nao-lidos/`, authHeader)).data
};

export const getNotificacoes = async () =>{
    return (await api.get(`/api/notificacoes/`, authHeader)).data
};

export const getNotificacoesLidasNaoLidas = async (lidas) =>{
    return (await api.get(`/api/notificacoes/?lido=${lidas}`, authHeader)).data
};

export const getNotificacaoMarcarDesmarcarLida = async (payload) =>{
    return await api.put(`/api/notificacoes/marcar-lido/`,payload, authHeader).data
};

export const getFiltros = async (tipo, remetente, categoria, lido, data_inicio, data_fim) =>{
    return (await api.get(`/api/notificacoes/?tipo=2&remetente=1&categoria=1&lido=True&data_inicio=2020-08-09&data_fim=2020-09-01`, authHeader)).data
};