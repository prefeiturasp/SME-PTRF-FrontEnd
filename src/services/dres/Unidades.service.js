import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getUnidade = async (uuid_unidade) => {
    return (await api.get(`api/unidades/00188676-7465-4270-87d8-1ebc3ed1fbda`, authHeader)).data
};

export const salvaDadosDiretoria = async (uuid_unidade, payload) => {
    return (await api.patch(`api/unidades/${uuid_unidade}/`, payload, authHeader)).data
};