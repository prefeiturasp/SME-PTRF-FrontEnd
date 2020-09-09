import api from './api'
import { TOKEN_ALIAS } from './auth.service.js';
import {ASSOCIACAO_UUID} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getAcoesAssociacao = async (associacao_uuid) =>{
    return (await api.get(`/api/associacoes/${associacao_uuid}/painel-acoes`, authHeader)).data
};

export const getAcoesAssociacaoPorPeriodo = async (associacao_uuid, uuid_periodo) =>{
    return (await api.get(`/api/associacoes/${associacao_uuid}/painel-acoes/?periodo_uuid=${uuid_periodo}`, authHeader)).data
};

export const getAcoesAssociacaoPorConta = async (associacao_uuid, conta_associacao_uuid) =>{
    return (await api.get(`/api/associacoes/${associacao_uuid}/painel-acoes/?conta=${conta_associacao_uuid}`, authHeader)).data
};

export const getTabelas = async (associacao_uuid) =>{
    return (await api.get(`api/receitas/tabelas/?associacao_uuid=${associacao_uuid}`, authHeader)).data
};
