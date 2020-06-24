import api from './Api'
import { TOKEN_ALIAS } from './auth.service.js';
import {ASSOCIACAO_UUID} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getBotaoValoresReprogramados = async () => {
    return (await api.get(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/permite-implantacao-saldos/`, authHeader)).data
};

export const getSaldosValoresReprogramados = async () => {
    return (await api.get(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/implantacao-saldos/`, authHeader)).data
};

export const criarValoresReprogramados = async (payload) => {
    //return api.post('api/despesas/', payload, authHeader).then(response => {
    return api.post(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/implanta-saldos/`, payload, authHeader)
    .then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
}
