import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';
import {ASSOCIACAO_UUID} from "../auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getTabelaAssociacoes = async () => {
    return (await api.get(`/api/associacoes/tabelas `, authHeader)).data
};

export const getAssociacoes = async () => {
    return (await api.get(`api/associacoes/`, authHeader)).data
};