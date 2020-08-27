import api from './api'
import { TOKEN_ALIAS } from './auth.service.js';
import {ASSOCIACAO_UUID} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getAcoesAssociacao = async () =>{
    return (await api.get(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/painel-acoes`, authHeader)).data
};

export const getAcoesAssociacaoPorPeriodo = async (uuid_periodo) =>{
    return (await api.get(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/painel-acoes/?periodo_uuid=${uuid_periodo}`, authHeader)).data
};

export const getAcoesAssociacaoPorConta = async (conta_associacao_uuid) =>{
    return (await api.get(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/painel-acoes/?conta=${conta_associacao_uuid}`, authHeader)).data
};