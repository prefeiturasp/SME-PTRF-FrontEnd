import api from './Api'
import {ASSOCIACAO_UUID} from "./auth.service";

const authHeader = {
  'Content-Type': 'application/json'
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
    return api.get('api/receitas/', authHeader)
        .then(response => {
            return response;
        })
        .catch(error => {
            return error.response
        });
}

export const filtroPorPalavraReceitas = async (palavra) => {
    return (await api.get(`api/receitas/?search=${palavra}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
}

