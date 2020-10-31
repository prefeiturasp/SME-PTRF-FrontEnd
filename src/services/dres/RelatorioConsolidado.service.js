import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getFiqueDeOlho = async () => {
    return (await api.get(`/api/relatorios-consolidados-dre/fique-de-olho/`, authHeader)).data
};