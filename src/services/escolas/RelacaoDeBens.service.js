import api from "../api";

import {TOKEN_ALIAS} from "../auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json',
    }
}

export const previa = async (conta_associacao, periodo) => {
    return api
            .get(`/api/relacao-bens/previa/?conta-associacao=${conta_associacao}&periodo=${periodo}`, {
                responseType: 'blob',
                timeout: 30000,
              })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'relacao-bens.xlsx');
                document.body.appendChild(link);
                link.click();
            }).catch(error => {
                return error.response;
            });
}

export const documentoFinal = async (conta_associacao, periodo) => {
    return api
            .get(`/api/relacao-bens/documento-final/?conta-associacao=${conta_associacao}&periodo=${periodo}`, {
                responseType: 'blob',
                timeout: 30000,
              })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'relacao-bens.xlsx');
                document.body.appendChild(link);
                link.click();
            }).catch(error => {
                return error.response;
            });
}

export const getRelacaoBensInfo = async (conta_associacao, periodo) => {
    return (await api.get(`/api/relacao-bens/relacao-bens-info/?conta-associacao=${conta_associacao}&periodo=${periodo}`, authHeader)).data
}