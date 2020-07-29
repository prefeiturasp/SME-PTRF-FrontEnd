import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';
import {ASSOCIACAO_UUID} from "../auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,  
        'Content-Type': 'application/json'
    }
};

export const deleteDespesa = async uuid => {
    return (await api.delete(`api/despesas/${uuid}/`, authHeader)).data
};

export const getDespesasTabelas = async () => {
    return (await api.get(`api/despesas/tabelas/`, authHeader)).data
};

export const getEspecificacoesCapital = async () => {
    return (await api.get(`api/especificacoes/?aplicacao_recurso=CAPITAL`, authHeader)).data
};

export const getEspecificacoesCusteio = async (id_tipo_custeio) => {
    return (await api.get(`api/especificacoes/?aplicacao_recurso=CUSTEIO&tipo_custeio=${id_tipo_custeio}`, authHeader)).data
};

export const getDespesa = async (idDespesa) => {
    return (await api.get(`api/despesas/${idDespesa}`, authHeader)).data
};

export const criarDespesa = async (payload) => {
    return api.post('api/despesas/', payload, authHeader).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};

export const alterarDespesa = async (payload, idDespesa) => {
    return api.put(`api/despesas/${idDespesa}/`, payload, authHeader).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};

export const getNomeRazaoSocial = async (cpf_cnpj) => {
    if (cpf_cnpj){
        return (await api.get(`/api/fornecedores/?uuid=&cpf_cnpj=${cpf_cnpj}`, authHeader)).data
    }else {
        return ""
    }
};

export const getPeriodoFechadoDespesa = async (palavra, aplicacao_recurso, acao_associacao__uuid, despesa__status) => {
    return (await api.get(`api/rateios-despesas/totais/?search=${palavra}&aplicacao_recurso=${aplicacao_recurso}&acao_associacao__uuid=${acao_associacao__uuid}&despesa__status=${despesa__status}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
};

export const getDespesaCadastrada = async (tipo_documento, numero_documento, cpf_cnpj_fornecedor, despesa_uuid=null) => {
    return (await api.get(`api/despesas/ja-lancada/?tipo_documento=${tipo_documento}&numero_documento=${numero_documento}&cpf_cnpj_fornecedor=${cpf_cnpj_fornecedor}${despesa_uuid ? '&despesa_uuid='+despesa_uuid : ''}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
};


