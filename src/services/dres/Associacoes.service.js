import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getTabelaAssociacoes = async () => {
    return (await api.get(`/api/associacoes/tabelas`, authHeader)).data
};

export const getAssociacoesPorUnidade = async () => {
    return (await api.get(`api/associacoes/?unidade__dre__uuid=82b460c6-7b6a-4de6-9376-d66a47f8d6b1`, authHeader)).data // DEV
    //return (await api.get(`api/associacoes/?unidade__dre__uuid=a3867d38-4b3d-4b5a-8fbd-c0cfb1625ebb`, authHeader)).data // Local
};

export const filtrosAssociacoes = async (nome=null, status_regularidade=null, unidade__tipo_unidade=null) => {
    return (await api.get(`api/associacoes/?unidade__dre__uuid=82b460c6-7b6a-4de6-9376-d66a47f8d6b1&nome=${nome}&status_regularidade=${status_regularidade}&unidade__tipo_unidade=${unidade__tipo_unidade}`, authHeader)).data // DEV
    //return (await api.get(`api/associacoes/?unidade__dre__uuid=a3867d38-4b3d-4b5a-8fbd-c0cfb1625ebb&nome=${nome}&status_regularidade=${status_regularidade}&unidade__tipo_unidade=${unidade__tipo_unidade}`, authHeader)).data // Local
};

export const getAssociacao = async (uuid_associacao) => {
    return (await api.get(`api/associacoes/${uuid_associacao}`, authHeader)).data
};

export const getContasAssociacao = async (uuid_associacao) => {
    return (await api.get(`api/associacoes/${uuid_associacao}/contas`, authHeader)).data
};
