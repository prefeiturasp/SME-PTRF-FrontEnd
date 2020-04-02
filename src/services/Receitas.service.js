import api from './Api';

const authHeader = {
  'Content-Type': 'application/json'
}

export const getTabelasReceita = async () => {
    return (await api.get('api/receitas/tabelas/', authHeader)).data
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
export const getListaReceitas = async () => {
    return (await api.get('api/receitas/', authHeader)).data
}

