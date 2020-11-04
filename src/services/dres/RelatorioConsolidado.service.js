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

export const getConsultarStatus = async (dre_uuid, periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/relatorios-consolidados-dre/status-relatorio/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}`, authHeader)).data
};

export const getTiposConta = async () => {
    return (await api.get(`/api/tipos-conta/`, authHeader)).data
};

export const getExecucaoFinanceira = async (dre_uuid, periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/relatorios-consolidados-dre/info-execucao-financeira/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}`, authHeader)).data
};

export const getDevolucoesContaPtrf = async (dre_uuid, periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/relatorios-consolidados-dre/info-devolucoes-conta/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}`, authHeader)).data
};