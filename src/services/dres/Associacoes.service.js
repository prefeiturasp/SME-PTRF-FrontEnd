import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

const url = window.location.href;

const getUuidPorUrl = () => {
    if (url === "http://localhost:3000/dre-associacoes"){
        // Ollyver return "a3867d38-4b3d-4b5a-8fbd-c0cfb1625ebb"
        return "934ee9d4-7320-4ecf-9932-7c6aca952e86"
    }else if (url === "https://dev-sig.escola.sme.prefeitura.sp.gov.br/dre-associacoes"){
        return "82b460c6-7b6a-4de6-9376-d66a47f8d6b1"
    }else if (url === "https://hom-sig.escola.sme.prefeitura.sp.gov.br/dre-associacoes"){
        return "707e5ccb-5937-4ea7-9140-94a7039fcd73"
    }
};

export const getTabelaAssociacoes = async () => {
    return (await api.get(`/api/associacoes/tabelas`, authHeader)).data
};

export const getAssociacoesPorUnidade = async () => {
    return (await api.get(`api/associacoes/?unidade__dre__uuid=${getUuidPorUrl()}`, authHeader)).data // DEV
};

export const filtrosAssociacoes = async (nome=null, status_regularidade=null, unidade__tipo_unidade=null) => {
    return (await api.get(`api/associacoes/?unidade__dre__uuid=${getUuidPorUrl()}&nome=${nome}&status_regularidade=${status_regularidade}&unidade__tipo_unidade=${unidade__tipo_unidade}`, authHeader)).data // DEV
};

export const getAssociacao = async (uuid_associacao) => {
    return (await api.get(`api/associacoes/${uuid_associacao}`, authHeader)).data
};

export const getContasAssociacao = async (uuid_associacao) => {
    return (await api.get(`api/associacoes/${uuid_associacao}/contas`, authHeader)).data
};

export const updateAssociacao = async (uuid_associacao, payload) => {
    return api.patch(`api/associacoes/${uuid_associacao}/`, payload, authHeader).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};