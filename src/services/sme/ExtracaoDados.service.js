import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getExportaCreditos = async (dataInicio, dataFinal) => {
    return (await api.get(
        `/api/exportacoes-dados/creditos/?data_inicio=${dataInicio}&data_final=${dataFinal}`,
        authHeader
    )).data
};