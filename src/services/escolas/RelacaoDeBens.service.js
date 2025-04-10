import api from "../api";

import {TOKEN_ALIAS} from "../auth.service";

const authHeader = ()=>({
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json',
    }
});

export const previa = async (conta_associacao, periodo, data_inicio, data_fim) => {
    return (await api.get(`/api/relacao-bens/previa/?conta-associacao=${conta_associacao}&periodo=${periodo}&data_inicio=${data_inicio}&data_fim=${data_fim}`, authHeader())).data

};

export const documentoFinal = async (conta_associacao, periodo, formato) => {
    let extensao = formato.toLowerCase();
    return api
            .get(`/api/relacao-bens/documento-final/?conta-associacao=${conta_associacao}&periodo=${periodo}&formato_arquivo=${formato}`, {
                responseType: 'blob',
                timeout: 30000,
                ...authHeader()
              })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `relacao-bens.${extensao}`);
                document.body.appendChild(link);
                link.click();
            }).catch(error => {
                return error.response;
            });
};

export const documentoPrevia = async (conta_associacao, periodo, formato) => {
    let extensao = formato.toLowerCase();
    return api
            .get(`/api/relacao-bens/documento-previa/?conta-associacao=${conta_associacao}&periodo=${periodo}&formato_arquivo=${formato}`, {
                responseType: 'blob',
                timeout: 30000,
                ...authHeader()
              })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `relacao-bens.${extensao}`);
                document.body.appendChild(link);
                link.click();
            }).catch(error => {
                return error.response;
            });
};

export const getRelacaoBensInfo = async (conta_associacao, periodo) => {
    return (await api.get(`/api/relacao-bens/relacao-bens-info/?conta-associacao=${conta_associacao}&periodo=${periodo}`, authHeader())).data
};