import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';
import {ASSOCIACAO_UUID} from "../auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,  
        'Content-Type': 'application/json'
    }
};

export const getTabelasReceita = async () => {
    return api
        .get(`api/receitas/tabelas/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)
        .then(response => {
            return response;
        })
        .catch(error => {
            return error.response;
        });
};

export const getTabelasReceitaReceita = async (associacao=null) => {
    let associacao_uuid = associacao ? associacao : localStorage.getItem(ASSOCIACAO_UUID);
    return (await api.get(`api/receitas/tabelas/?associacao_uuid=${associacao_uuid}`, authHeader)).data
};


export const criarReceita = async payload => {
    return api
        .post(`api/receitas/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, payload, authHeader)
        .then(response => {
            return response;
        })
        .catch(error => {
            return error.response;
        });
};

export const getReceita = async (uuid, associacao=null) => {
    let associacao_uuid = associacao ? associacao : localStorage.getItem(ASSOCIACAO_UUID)

    return api
        .get(`api/receitas/${uuid}/?associacao_uuid=${associacao_uuid}`, authHeader)
        .then(response => {
            return response;
        })
        .catch(error => {
            return error.response;
        });
};

export const atualizaReceita = async (uuid, payload) => {
    return api
        .put(`api/receitas/${uuid}/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, payload, authHeader)
        .then(response => {
            return response;
        })
        .catch(error => {
            return error.response;
        });
};

export const deletarReceita = async uuid => {
    return (await api.delete(`api/receitas/${uuid}/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
};

export const getListaReceitas = async () => {
    return (await api.get(`api/receitas/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
};

export const getTotaisReceitas = async (tipo_receita, acao_associacao__uuid, conta_associacao__uuid, data_inicio, data_fim) => {
    return (await api.get(`api/receitas/totais/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&tipo_receita=${tipo_receita}&acao_associacao__uuid=${acao_associacao__uuid}&conta_associacao__uuid=${conta_associacao__uuid}${data_inicio ? '&data_inicio='+data_inicio : ""}${data_fim ? '&data_fim='+data_fim : ""}`, authHeader)).data
};

export const filtroPorPalavraReceitas = async (palavra) => {
    return (await api.get(`api/receitas/?search=${palavra}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
};

export const filtrosAvancadosReceitas = async (palavra, tipo_receita, acao_associacao__uuid, conta_associacao__uuid, data_inicio, data_fim) => {
    return (await api.get(`api/receitas/?search=${palavra}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&tipo_receita=${tipo_receita}&acao_associacao__uuid=${acao_associacao__uuid}&conta_associacao__uuid=${conta_associacao__uuid}${data_inicio ? '&data_inicio='+data_inicio : ""}${data_fim ? '&data_fim='+data_fim : ""}`, authHeader)).data
};

export const getRepasse = async (acao_associacao_uuid, data_receita, uuid="") => {
    return (await api.get(`/api/repasses/pendentes/?acao-associacao=${acao_associacao_uuid}&data=${data_receita}&uuid-receita=${uuid}`, authHeader)).data
};

export const getRepasses = async () => {
    return (await api.get(`/api/repasses/pendentes/?associacao=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
};

export const getPeriodoFechadoReceita = async (palavra, aplicacao_recurso, acao_associacao__uuid, despesa__status) => {
    return (await api.get(`api/rateios-despesas/totais/?search=${palavra}&aplicacao_recurso=${aplicacao_recurso}&acao_associacao__uuid=${acao_associacao__uuid}&despesa__status=${despesa__status}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
};

export const getListaMotivosEstorno = async () => {
    return (await api.get(`/api/motivos-estorno/`, authHeader)).data
};

export const marcarLancamentoExcluido = async (uuid_analise_lancamento) => {
    return (await api.post(`/api/analises-lancamento-prestacao-conta/${uuid_analise_lancamento}/marcar-lancamento-excluido/`, {}, authHeader)).data
};