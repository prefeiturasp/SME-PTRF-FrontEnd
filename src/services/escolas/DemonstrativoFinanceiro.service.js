import api from "../api";

import {TOKEN_ALIAS} from "../auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json',
    }
};

export const getAcoes = async (associacao_uuid, periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/demonstrativo-financeiro/acoes/?associacao_uuid=${associacao_uuid}&periodo_uuid=${periodo_uuid}&conta-associacao=${conta_uuid}`, authHeader)).data
};

export const ___getDemonstrativoInfo = async (acao_associacao_uuid, conta_associacao_uuid, periodo_uuid) => {
    return (await api.get(`/api/demonstrativo-financeiro/demonstrativo-info/?acao-associacao=${acao_associacao_uuid}&conta-associacao=${conta_associacao_uuid}&periodo=${periodo_uuid}`, authHeader)).data
};

export const getDemonstrativoInfo = async (conta_associacao, periodo) => {
    return (await api.get(`/api/demonstrativo-financeiro/demonstrativo-info/?conta-associacao=${conta_associacao}&periodo=${periodo}`, authHeader)).data
};

export const previa = async (conta_associacao, periodo, data_inicio, data_fim) => {
    return (await api.get(`/api/demonstrativo-financeiro/previa/?conta-associacao=${conta_associacao}&periodo=${periodo}&data_inicio=${data_inicio}&data_fim=${data_fim}`, authHeader)).data
};

export const documentoFinal = async (conta_associacao, periodo, formato) => {
    let extensao = formato.toLowerCase();
    return api
            .get(`/api/demonstrativo-financeiro/documento-final/?conta-associacao=${conta_associacao}&periodo=${periodo}&formato_arquivo=${formato}`, {
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
                link.setAttribute('download', `demonstrativo_financeiro.${extensao}`);
                document.body.appendChild(link);
                link.click();
            }).catch(error => {
                return error.response;
            });
};

export const documentoPrevia = async (conta_associacao, periodo, formato) => {
    let extensao = formato.toLowerCase();
    return api
            .get(`/api/demonstrativo-financeiro/documento-previa/?conta-associacao=${conta_associacao}&periodo=${periodo}&formato_arquivo=${formato}`, {
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
                link.setAttribute('download', `demonstrativo_financeiro.${extensao}`);
                document.body.appendChild(link);
                link.click();
            }).catch(error => {
                return error.response;
            });
};
