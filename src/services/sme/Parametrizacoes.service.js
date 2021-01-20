import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';
import {ASSOCIACAO_UUID} from "../auth.service";


const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getTodasAcoesDasAssociacoes = async () => {
    return (await api.get(`/api/acoes-associacoes/`, authHeader)).data
};

export const getListaDeAcoes = async () => {
    return (await api.get(`/api/acoes/`, authHeader)).data
};

export const getFiltros = async (nome='', acao__uuid, status) => {
    return (await api.get(`/api/acoes-associacoes/?nome=${nome}${acao__uuid ? '&acao__uuid='+acao__uuid : ''}${status ? '&status='+status : ''}`, authHeader)).data
};

export const postAddAcaoAssociacao = async (payload) => {
    return (await api.post(`/api/acoes-associacoes/`, payload, authHeader)).data
};

export const putAtualizarAcaoAssociacao = async (acao_associacao_uuid, payload) => {
    return (await api.put(`/api/acoes-associacoes/${acao_associacao_uuid}/`, payload, authHeader)).data
};

export const deleteAcaoAssociacao = async (acao_associacao_uuid) => {
    return (await api.delete(`/api/acoes-associacoes/${acao_associacao_uuid}/`, authHeader))
};

export const getRateiosAcao = async (acao_associacao_uuid, associacao_uuid) => {
    return (await api.get(`api/rateios-despesas/?acao_associacao__uuid=${acao_associacao_uuid}&associacao__uuid=${associacao_uuid}`, authHeader)).data
};

export const getReceitasAcao = async (associacao_uuid, acao_associacao_uuid) => {
    return (await api.get(`api/receitas/?associacao__uuid=${associacao_uuid}&acao_associacao__uuid=${acao_associacao_uuid}`, authHeader)).data
};

export const getAcoesFiltradas = async (nome='') => {
    return (await api.get(`/api/acoes/?nome=${nome}`, authHeader)).data
};

export const postAddAcao = async (payload) => {
    return (await api.post(`/api/acoes/`, payload, authHeader)).data
};

export const putAtualizarAcao = async (acao_uuid, payload) => {
    return (await api.put(`/api/acoes/${acao_uuid}/`, payload, authHeader)).data
};

export const deleteAcao = async (acao_uuid) => {
    return (await api.delete(`/api/acoes/${acao_uuid}/`, authHeader))
};

export const getRateiosPorTipoAcao = async (acao_uuid) => {
    return (await api.get(`api/rateios-despesas/?acao_associacao__acao__uuid=${acao_uuid}`, authHeader)).data
};

export const getReceitasPoTipoAcao = async (acao_uuid) => {
    return (await api.get(`api/receitas/?acao_associacao__acao__uuid=${acao_uuid}`, authHeader)).data
};
