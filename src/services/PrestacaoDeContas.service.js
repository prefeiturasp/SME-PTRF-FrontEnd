import api from "./Api";
import {TOKEN_ALIAS} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
}


export const getPeriodos = async () => {
    return (await api.get(`/api/periodos/lookup/`, authHeader)).data
}

export const getStatus = async (periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/prestacoes-contas/por-conta-e-periodo/?conta_associacao_uuid=${conta_uuid}&periodo_uuid=${periodo_uuid}`, authHeader)).data
}

export const getIniciarPrestacaoDeContas = async (conta_uuid, periodo_uuid) => {
    return (await api.post(`/api/prestacoes-contas/iniciar/?conta_associacao_uuid=${conta_uuid}&periodo_uuid=${periodo_uuid}`, authHeader)).data
}

export const getReabrirPeriodo = async (uuid, payload) => {
    return (await api.patch(`/api/prestacoes-contas/${uuid}/revisar/`, payload, authHeader))
}

export const getDespesasPrestacaoDeContas = async (uuidPrestacaoDeContas, acao_associacao__uuid, conferido) => {
    return (await api.get(`/api/prestacoes-contas/${uuidPrestacaoDeContas}/despesas/?acao_associacao_uuid=${acao_associacao__uuid}&conferido=${conferido}`, authHeader)).data
}

export const getReceitasPrestacaoDeContas = async (uuidPrestacaoDeContas, acao_associacao__uuid, conferido) => {
    return (await api.get(`/api/prestacoes-contas/${uuidPrestacaoDeContas}/receitas/?acao_associacao_uuid=${acao_associacao__uuid}&conferido=${conferido}`, authHeader)).data
}