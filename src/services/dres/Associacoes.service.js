import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';
import {visoesService} from "../visoes.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getTabelaAssociacoes = async () => {
    return (await api.get(`/api/associacoes/tabelas`, authHeader)).data
};

export const getAnosAnaliseRegularidade = async () => {
    return (await api.get(`/api/anos-analise-regularidade/`, authHeader)).data
};


export const getAssociacoesPorUnidade = async () => {
    return (await api.get(`api/associacoes/?unidade__dre__uuid=${visoesService.getItemUsuarioLogado('associacao_selecionada.uuid')}`, authHeader)).data // DEV
};

export const getRegularidadeAssociacoesAno = async () => {
    const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid')
    const ano = new Date().getFullYear()
    const url = `api/associacoes/lista-regularidade-ano/?dre_uuid=${dre_uuid}&ano=${ano}`
    return (await api.get(url, authHeader)).data
};

export const filtrosRegularidadeAssociacoes = async (nome=null, status_regularidade=null, tipo_unidade=null, ano=null) => {
    const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid')
    const url = `api/associacoes/lista-regularidade-ano/?dre_uuid=${dre_uuid}&ano=${ano}&nome=${nome}&status_regularidade=${status_regularidade}&tipo_unidade=${tipo_unidade}`
    return (await api.get(url, authHeader)).data
};

export const filtrosAssociacoes = async (nome=null, status_regularidade=null, unidade__tipo_unidade=null) => {
    return (await api.get(`api/associacoes/?unidade__dre__uuid=${visoesService.getItemUsuarioLogado('associacao_selecionada.uuid')}&nome=${nome}&status_regularidade=${status_regularidade}&unidade__tipo_unidade=${unidade__tipo_unidade}`, authHeader)).data // DEV
};

export const getAssociacao = async (uuid_associacao) => {
    return (await api.get(`api/associacoes/${uuid_associacao}`, authHeader)).data
};

export const getContasAssociacao = async (uuid_associacao) => {
    return (await api.get(`api/associacoes/${uuid_associacao}/contas`, authHeader)).data
};

export const updateAssociacao = async (uuid_associacao, payload) => {
    return api.patch(`api/associacoes/${uuid_associacao}/`, payload, authHeader).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};

export const getProcessosAssociacao = async (uuid_associacao) => {
    return (await api.get(`api/associacoes/${uuid_associacao}/processos`, authHeader)).data
};
