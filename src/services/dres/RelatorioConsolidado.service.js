import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';
import {ASSOCIACAO_UUID} from "../auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getFiqueDeOlhoRelatoriosConsolidados = async () => {
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

export const getListaPrestacaoDeContasDaDreFiltros = async (dre_uuid, periodo_uuid, conta_uuid, nome, tipo_unidade, status) => {
    return (await api.get(`/api/relatorios-consolidados-dre/info-execucao-financeira-unidades/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}${nome ? '&nome='+nome : ''}${tipo_unidade ? '&tipo_unidade='+tipo_unidade : ''}${status ? '&status='+status : ''}`, authHeader)).data
};

export const putCriarEditarDeletarObservacaoDevolucaoContaPtrf = async (dre_uuid, periodo_uuid, conta_uuid, tipo_devolucao_uuid, payload) =>{
    return (await api.put(`/api/relatorios-consolidados-dre/update-observacao-devolucoes-a-conta/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}&tipo_devolucao=${tipo_devolucao_uuid}`, payload, authHeader)).data
};

export const putCriarEditarDeletarObservacaoDevolucaoTesouro = async (dre_uuid, periodo_uuid, conta_uuid, tipo_devolucao_uuid, payload) =>{
    return (await api.put(`/api/relatorios-consolidados-dre/update-observacao-devolucoes-ao-tesouro/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}&tipo_devolucao=${tipo_devolucao_uuid}`, payload, authHeader)).data
};

export const postGerarRelatorio = async (payload) => {
    return (await api.post(`/api/relatorios-consolidados-dre/gerar-relatorio/`, payload, authHeader)).data
};

export const getDownloadRelatorio = async (dre_uuid, periodo_uuid, conta_uuid) => {
    return api
    .get(`/api/relatorios-consolidados-dre/download/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}`, {
        responseType: 'blob',
        timeout: 30000,
        headers: {
            'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
            'Content-Type': 'application/json',
        }
    })
    .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'relatorio_dre.xlsx');
        document.body.appendChild(link);
        link.click();
    }).catch(error => {
        return error.response;
    });
};

export const getDownloadPreviaRelatorio = async (payload) => {
    return api
    .post(`/api/relatorios-consolidados-dre/previa/`, payload, {
        responseType: 'blob',
        timeout: 3600000,
        headers: {
            'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
            'Content-Type': 'application/json',
        }
    })
    .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'relatorio_consolidado_dre.xlsx');
        document.body.appendChild(link);
        link.click();
    }).catch(error => {
        return error.response;
    });
};

export const getListaAssociacoesNaoRegularizadas = async (dre_uuid) => {
    return (await api.get(`/api/associacoes/?unidade__dre__uuid=${dre_uuid}&status_regularidade=PENDENTE`, authHeader)).data
};



