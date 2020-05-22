import api from './Api'
import { TOKEN_ALIAS } from './auth.service.js';
import {ASSOCIACAO_UUID} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,  
        'Content-Type': 'application/json'
    }
}

export const getTabelasReceita = async () => {
    return api
        .get('api/receitas/tabelas/', authHeader)
        .then(response => {
            return response;
        })
        .catch(error => {
            return error.response;
        });
}

export const criarReceita = async payload => {
    return api
        .post('api/receitas/', payload, authHeader)
        .then(response => {
            return response;
        })
        .catch(error => {
            return error.response;
        });
}

export const getReceita = async (uuid) => {
    return api
        .get(`api/receitas/${uuid}/`, authHeader)
        .then(response => {
            return response;
        })
        .catch(error => {
            return error.response;
        });
}

export const atualizaReceita = async (uuid, payload) => {
    return api
        .put(`api/receitas/${uuid}/`, payload, authHeader)
        .then(response => {
            return response;
        })
        .catch(error => {
            return error.response;
        });
}

export const deletarReceita = async uuid => {
    return api
        .delete(`api/receitas/${uuid}/`, authHeader)
        .then(response => {
            return response;
        })
        .catch(error => {
            return error.response;
        });
}

export const getListaReceitas = async () => {
    return (await api.get(`api/receitas/`, authHeader)).data
}

export const filtroPorPalavraReceitas = async (palavra) => {
    return (await api.get(`api/receitas/?search=${palavra}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
}

export const filtrosAvancadosReceitas = async (palavra, tipo_receita, acao_associacao__uuid, conta_associacao__uuid) => {
    return (await api.get(`api/receitas/?search=${palavra}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&tipo_receita=${tipo_receita}&acao_associacao__uuid=${acao_associacao__uuid}&conta_associacao__uuid=${conta_associacao__uuid}`, authHeader)).data
}

export const getRepasse = async (acao_associacao_uuid, eAtualizacao=false) => {
    return (await api.get(`api/repasses/pendentes/?acao-associacao=${acao_associacao_uuid}${eAtualizacao ? "&edit=True": ""}`, authHeader)).data
}

export const getPeriodoFechadoReceita = async (palavra, aplicacao_recurso, acao_associacao__uuid, despesa__status) => {
    return (await api.get(`api/rateios-despesas/totais/?search=${palavra}&aplicacao_recurso=${aplicacao_recurso}&acao_associacao__uuid=${acao_associacao__uuid}&despesa__status=${despesa__status}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
}

