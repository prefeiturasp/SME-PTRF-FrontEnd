import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getPeriodos = async () => {
    return (await api.get(`/api/periodos/`, authHeader)).data
};

export const getItensDashboard = async (uuid_periodo) => {
    return (await api.get(`/api/prestacoes-contas/dashboard-sme/?periodo=${uuid_periodo}`, authHeader)).data
};