import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = ()=>({
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
});

export const getPeriodos = async (parameters = {}) => {
    const params = new URLSearchParams();

    if (parameters.solicitacao_sme) {
        params.append('solicitacao_sme', parameters.solicitacao_sme);
    }

    const paramsToString = params.toString();
    const url = paramsToString ? `/api/periodos/?${paramsToString}` : '/api/periodos/';
    return (await api.get(url, authHeader())).data;
}

export const getTiposDeConta = async (recurso_uuid = '') => {
    const params = new URLSearchParams();

    if (recurso_uuid) {
        params.append('recurso_uuid', recurso_uuid);
    }

    const query = params.toString() ? `?${params.toString()}` : '';

    return (await api.get(`/api/tipos-conta/${query}`, authHeader())).data
};

export const getSaldosPorTipoDeUnidade = async (periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/saldos-bancarios-sme/saldo-por-tipo-unidade/?periodo=${periodo_uuid}&conta=${conta_uuid}`, authHeader())).data
};

export const getSaldosPorDre = async (periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/saldos-bancarios-sme/saldo-por-dre/?periodo=${periodo_uuid}&conta=${conta_uuid}`, authHeader())).data
};

export const getSaldosPorUeDre = async (periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/saldos-bancarios-sme/saldo-por-ue-dre/?periodo=${periodo_uuid}&conta=${conta_uuid}`, authHeader())).data
};

export const getDres = async () => {
    return (await api.get(`/api/dres/`, authHeader())).data
};

export const getSaldosDetalhesAssociacoes = async (periodo_uuid, conta_uuid, dre_uuid, filtrar_por_unidade, filtrar_por_tipo_ue) => {
    return (await api.get(`/api/saldos-bancarios-sme-detalhes/saldos-detalhes-associacoes/?periodo=${periodo_uuid}&conta=${conta_uuid}&dre=${dre_uuid}${filtrar_por_unidade ? '&unidade='+filtrar_por_unidade : ''}${filtrar_por_tipo_ue ? '&tipo_ue='+filtrar_por_tipo_ue : ''}`, authHeader())).data
};

export const getSaldosDetalhesAssociacoesExportar = async (periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/saldos-bancarios-sme-detalhes/exporta_xlsx_dres/?periodo=${periodo_uuid}&conta=${conta_uuid}`, authHeader())).data
};