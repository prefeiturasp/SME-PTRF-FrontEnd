import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getTodasAcoesDasAssociacoes = async () => {
    return (await api.get(`/api/acoes-associacoes/`, authHeader)).data
};