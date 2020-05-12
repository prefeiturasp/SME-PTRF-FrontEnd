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
    return (await api.get('api/rateios-despesas/', authHeader)).data
}


export const filtroPorPalavraRateios = async (palavra) => {
    return (await api.get(`api/rateios-despesas/?search=${palavra}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
}

export const filtrosAvancadosRateios = async (palavra, aplicacao_recurso, acao_associacao__uuid, despesa__status) => {
    return (await api.get(`api/rateios-despesas/?search=${palavra}&aplicacao_recurso=${aplicacao_recurso}&acao_associacao__uuid=${acao_associacao__uuid}&despesa__status=${despesa__status}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
}

