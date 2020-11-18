import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';
import {ASSOCIACAO_UUID} from "../auth.service";

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

export const getJustificativa = async (dre_uuid, periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/justificativas-relatorios-consolidados-dre/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}`, authHeader)).data
};

export const postJustificativa = async (payload) => {
    return (await api.post(`/api/justificativas-relatorios-consolidados-dre/`, payload, authHeader)).data
};

export const patchJustificativa = async (justificativa_uuid, payload) => {
    return (await api.patch(`/api/justificativas-relatorios-consolidados-dre/${justificativa_uuid}/`, payload, authHeader)).data
};

export const getDevolucoesAoTesouro = async (dre_uuid, periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/relatorios-consolidados-dre/info-devolucoes-ao-tesouro/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}`, authHeader)).data
};

export const getItensDashboard = async (uuid_periodo) => {
    return (await api.get(`/api/prestacoes-contas/dashboard/?periodo=${uuid_periodo}&dre_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&add_aprovadas_ressalva=SIM`, authHeader)).data
};

export const getListaPrestacaoDeContasDaDre = async (dre_uuid, periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/relatorios-consolidados-dre/info-execucao-financeira-unidades/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}`, authHeader)).data
};

export const getTiposDeUnidade = async () => {
    return (await api.get(`/api/associacoes/tabelas/`, authHeader)).data
};

export const getStatusPc = async () => {
    return (await api.get(`/api/prestacoes-contas/tabelas/`, authHeader)).data
};