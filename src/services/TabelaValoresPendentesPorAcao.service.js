import api from "./Api";

import {TOKEN_ALIAS} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json',
    }
}


export const tabelaValoresPendentes = async (prestacaoContaUuid) => {
    return (await api.get(`/api/prestacoes-contas/${prestacaoContaUuid}/tabela-valores-pendentes/`, authHeader)).data
}