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

export const getNotificacoesPaginacao = async (page) =>{
    return (await api.get(`/api/notificacoes/?page=${page}`, authHeader)).data
};

export const getNotificacoesLidasNaoLidas = async (lidas) =>{
    return (await api.get(`/api/notificacoes/?lido=${lidas}`, authHeader)).data
};

export const getNotificacoesLidasNaoLidasPaginacao = async (lidas, page) =>{
    return (await api.get(`/api/notificacoes/?lido=${lidas}&page=${page}`, authHeader)).data
};

export const getNotificacaoMarcarDesmarcarLida = async (payload) =>{
    return await api.put(`/api/notificacoes/marcar-lido/`,payload, authHeader).data
};

export const getNotificacoesTabela = async () =>{
    return (await api.get(`/api/notificacoes/tabelas/`, authHeader)).data
};

export const getNotificacoesFiltros = async (tipo=null, remetente=null, categoria=null, lido=null, data_inicio=null, data_fim=null) =>{
    return (await api.get(`/api/notificacoes/?${tipo ? 'tipo=' + tipo : ""}${remetente ? '&remetente='+remetente: ""}${categoria ? '&categoria='+categoria : ""}${lido ? '&lido='+lido : ""}${data_inicio ? '&data_inicio='+data_inicio : ""}${data_fim ? '&data_fim='+data_fim : ""}`, authHeader)).data
};

export const getNotificacoesFiltrosPaginacao = async (tipo=null, remetente=null, categoria=null, lido=null, data_inicio=null, data_fim=null, page) =>{
    return (await api.get(`/api/notificacoes/?${tipo ? 'tipo=' + tipo : ""}${remetente ? '&remetente='+remetente: ""}${categoria ? '&categoria='+categoria : ""}${lido ? '&lido='+lido : ""}${data_inicio ? '&data_inicio='+data_inicio : ""}${data_fim ? '&data_fim='+data_fim : ""}&page=${page}`, authHeader)).data
};