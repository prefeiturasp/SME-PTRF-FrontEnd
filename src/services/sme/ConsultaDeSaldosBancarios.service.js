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

export const getTiposDeConta = async () => {
    return (await api.get(`/api/tipos-conta/`, authHeader)).data
};

export const getSaldosPorTipoDeUnidade = async (periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/saldos-bancarios-sme/saldo-por-tipo-unidade/?periodo=${periodo_uuid}&conta=${conta_uuid}`, authHeader)).data
};

export const getSaldosPorDre = async (periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/saldos-bancarios-sme/saldo-por-dre/?periodo=${periodo_uuid}&conta=${conta_uuid}`, authHeader)).data
};

export const getSaldosPorUeDre = async (periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/saldos-bancarios-sme/saldo-por-ue-dre/?periodo=${periodo_uuid}&conta=${conta_uuid}`, authHeader)).data
};