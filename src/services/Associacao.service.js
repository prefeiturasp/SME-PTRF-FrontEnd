import api from './Api'
import { TOKEN_ALIAS } from './auth.service.js';
import {ASSOCIACAO_UUID} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
}

export const getAssociacao = async () => {
    console.log("getAssociacao ", ASSOCIACAO_UUID)
    return (await api.get(`api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
}

export const alterarAssociacao = async (payload) => {
    return api.put(`api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/`, payload, authHeader).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
}
