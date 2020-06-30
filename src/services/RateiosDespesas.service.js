import api from './Api'
import {ASSOCIACAO_UUID} from "./auth.service";
import { TOKEN_ALIAS } from './auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,  
        'Content-Type': 'application/json'
    }
}

export const getListaRateiosDespesas = async uuid => {
    return (await api.get( `api/rateios-despesas/?associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
}


export const filtroPorPalavraRateios = async (palavra) => {
    return (await api.get(`api/rateios-despesas/?search=${palavra}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
}

export const filtrosAvancadosRateios = async (palavra, aplicacao_recurso, acao_associacao__uuid, despesa__status, fornecedor, data_inicio, data_fim) => {
    return (await api.get(`api/rateios-despesas/?search=${palavra}&aplicacao_recurso=${aplicacao_recurso}&acao_associacao__uuid=${acao_associacao__uuid}&despesa__status=${despesa__status}&fornecedor=${fornecedor}${data_inicio ? '&data_inicio='+data_inicio : ""}${data_fim ? '&data_fim='+data_fim : ""}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
}

export const getVerificarSaldo = async (payload, despesa_uuid="") => {
    if (despesa_uuid){
        return (await api.post(`/api/rateios-despesas/verificar-saldos/?despesa_uuid=${despesa_uuid}`, payload, authHeader)).data
    }else {
        return (await api.post(`/api/rateios-despesas/verificar-saldos/`, payload, authHeader)).data
    }
}

export const getSomaDosTotais = async (palavra, aplicacao_recurso, acao_associacao__uuid, despesa__status) => {
    return (await api.get(`api/rateios-despesas/totais/?search=${palavra}&aplicacao_recurso=${aplicacao_recurso}&acao_associacao__uuid=${acao_associacao__uuid}&despesa__status=${despesa__status}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
}