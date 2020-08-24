import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const verificacaoRegularidade = async (associacao_uuid) => {
    return api
        .get(`/api/associacoes/${associacao_uuid}/verificacao-regularidade/`, authHeader)
        .then(response => {
            return response;
        })
        .catch(error => {
            return error.response;
        });
};


export const salvarItensRegularidade = async (associacao_uuid, itens) => {
    return api
        .post(`/api/associacoes/${associacao_uuid}/atualiza-itens-verificacao/`, itens, authHeader)
        .then(response => {
            return response
        })
        .catch(error => {
            console.log(error.response);
        })
}