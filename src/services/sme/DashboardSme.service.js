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


export const getCardRelatorios = async (uuid_periodo) => {
    return (await api.get(`/api/consolidados-dre/acompanhamento-de-relatorios-consolidados-sme/?periodo=${uuid_periodo}`, authHeader)).data
}

export const getListaRelatoriosConsolidados = async (uuid_periodo, status_sme, uuid_dre=null, tipo_relatorio=null) => {
    return (await api.get(`/api/consolidados-dre/listagem-de-relatorios-consolidados-sme-por-status/?periodo=${uuid_periodo}${uuid_dre ? '&dre='+uuid_dre : ''}${tipo_relatorio ? '&tipo_relatorio='+tipo_relatorio : ''}${status_sme ? '&status_sme='+status_sme : ''}`, authHeader)).data
};
