import api from './api'
import { TOKEN_ALIAS, RECURSO_SELECIONADO } from './auth.service.js';

const authHeader = () => ({
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
});

export const getAcoesAssociacao = async (associacao_uuid) =>{
    return (await api.get(`/api/associacoes/${associacao_uuid}/painel-acoes`, authHeader())).data
};

export const getAcoesAssociacaoPorPeriodoConta = async (associacao_uuid, periodo_uuid, conta_associacao_uuid) =>{
    return (await api.get(`/api/associacoes/${associacao_uuid}/painel-acoes/?periodo_uuid=${periodo_uuid}${conta_associacao_uuid ? '&conta='+ conta_associacao_uuid : ''}`, authHeader())).data
};

export const getTabelas = async (associacao_uuid) =>{
    let url = `api/receitas/tabelas/?associacao_uuid=${associacao_uuid}`;
    if (localStorage.getItem(RECURSO_SELECIONADO)) {
        const recurso_uuid = JSON.parse(localStorage.getItem(RECURSO_SELECIONADO)).uuid
        url += `&recurso_uuid=${recurso_uuid}`;
    }
    return (await api.get(url, authHeader())).data
};

export const getContas = async (associacao_uuid, periodo_uuid = '') => {
    return (await api.get(`/api/associacoes/${associacao_uuid}/contas/?periodo_uuid=${periodo_uuid}`, authHeader())).data
};