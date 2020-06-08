import api from "./Api";

import {TOKEN_ALIAS} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json',
    }
}

export const getAcoes = async (associacao_uuid, periodo_uuid) => {
    return (await api.get(`/api/demonstrativo-financeiro/acoes/?associacao_uuid=${associacao_uuid}&periodo_uuid=${periodo_uuid}`, authHeader)).data
}

export const getDemonstrativoInfo = async (acao_associacao_uuid, conta_associacao_uuid, periodo_uuid) => {
    return (await api.get(`/api/demonstrativo-financeiro/demonstrativo-info/?acao-associacao=${acao_associacao_uuid}&conta-associacao=${conta_associacao_uuid}&periodo=${periodo_uuid}`, authHeader)).data
}

export const previa = async (acao_associacao, conta_associacao, periodo) => {
    return api
            .get(`/api/demonstrativo-financeiro/previa/?acao-associacao=${acao_associacao}&conta-associacao=${conta_associacao}&periodo=${periodo}`, {
                responseType: 'blob',
                timeout: 30000,
              })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'demonstrativo_financeiro.xlsx');
                document.body.appendChild(link);
                link.click();
            }).catch(error => {
                return error.response;
            });
}

export const documentoFinal = async (acao_associacao, conta_associacao, periodo) => {
    return api
            .get(`/api/demonstrativo-financeiro/documento-final/?acao-associacao=${acao_associacao}&conta-associacao=${conta_associacao}&periodo=${periodo}`, {
                responseType: 'blob',
                timeout: 30000,
              })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'demonstrativo_financeiro.xlsx');
                document.body.appendChild(link);
                link.click();
            }).catch(error => {
                return error.response;
            });
}