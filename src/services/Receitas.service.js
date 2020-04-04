import axios from 'axios';
import API_URL from './constantes';

const authHeader = {
  'Content-Type': 'application/json'
}

export const getTabelasReceita = async () => {
    console.log(API_URL);
    return axios
        .get(`${API_URL}/api/receitas/tabelas/`, authHeader)
        .then(response => {
            return response;
        })
        .catch(error => {
            return error.response;
        });
}

export const criarReceita = async payload => {
    return axios
        .post(`${API_URL}/api/receitas/`, payload, authHeader)
        .then(response => {
            return response;
        })
        .catch(error => {
            return error.response;
        });
}

export const getReceita = async (uuid) => {
    return axios
        .get(`${API_URL}/api/receitas/${uuid}/`, authHeader)
        .then(response => {
            return response;
        })
        .catch(error => {
            return error.response;
        });
}

export const atualizaReceita = async (uuid, payload) => {
    return axios
        .put(`${API_URL}/api/receitas/${uuid}/`, payload, authHeader)
        .then(response => {
            return response;
        })
        .catch(error => {
            return error.response;
        });
}
