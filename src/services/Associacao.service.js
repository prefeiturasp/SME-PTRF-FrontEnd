import api from './Api'
import { TOKEN_ALIAS } from './auth.service.js';
import {ASSOCIACAO_UUID} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getAssociacao = async () => {
    return (await api.get(`api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
};

export const alterarAssociacao = async (payload) => {
    return api.put(`api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/`, payload, authHeader).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};

export const getPeriodoFechado = async (data_verificacao) => {
    return (await api.get(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/status-periodo/?data=${data_verificacao}`, authHeader)).data
};

export const getMembrosAssociacao = async () => {
    return (await api.get(`/api/membros-associacao/`, authHeader)).data
};

export const criarMembroAssociacao = async (payload) => {
    return (await api.post(`api/membros-associacao/`, payload, authHeader))
};

export const editarMembroAssociacao = async (payload, uuid) => {
    return (await api.put(`/api/membros-associacao/${uuid}`, payload, authHeader))
};

export const consultarRF = async (rf) => {
    return (await api.get(`/api/membros-associacao/codigo-identificacao/?rf=${rf}`, authHeader))
};

export const consultarCodEol = async (cod_eol) => {
    return (await api.get(`/api/membros-associacao/codigo-identificacao/?codigo-eol=${cod_eol}`, authHeader))
};

export const getContas = async () => {
    return (await api.get(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/contas/`, authHeader)).data
};

export const salvarContas = async (payload) => {
    return (await api.post(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/contas-update/`, payload, authHeader))
};
