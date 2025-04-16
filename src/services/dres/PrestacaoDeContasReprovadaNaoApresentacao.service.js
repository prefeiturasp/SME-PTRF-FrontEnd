import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';
import {ASSOCIACAO_UUID} from "../auth.service";

const authHeader = ()=>({
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
});

export const postPrestacaoContaReprovadaNaoApresentacao = async (payload) => {
    return (await api.post(`api/prestacoes-contas-reprovadas-nao-apresentacao/`, {
            ...payload
        },
        authHeader(),
    ))
};

export const getPrestacaoContaReprovadaNaoApresentacao = async (prestacao_conta_uuid) => {
    return (await api.get(`api/prestacoes-contas-reprovadas-nao-apresentacao/${prestacao_conta_uuid}/`,{
        ...authHeader(),
    })).data
}

export const postNotificarPrestacaoContaReprovadaNaoApresentacao = async (payload) => {
    return (await api.post(`/api/notificacoes/notificar-prestacao-conta-reprovada-nao-apresentacao/`, {
            ...payload
        },
        authHeader(),
    ))
};