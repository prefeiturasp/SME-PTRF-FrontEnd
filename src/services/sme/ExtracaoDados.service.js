import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getExportaCreditos = async (url, dataInicio, dataFinal, dre_uuid='') => {
    return (await api.get(
        `${url}?data_inicio=${dataInicio}&data_final=${dataFinal}&dre_uuid=${dre_uuid}`,
        authHeader
    )).data
};