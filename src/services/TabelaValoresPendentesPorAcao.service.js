import api from "./Api";

import {TOKEN_ALIAS} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json',
    }
}


export const tabelaValoresPendentes = async (periodo) => {
    return (await api.get(`/api/prestacoes-contas/tabela-valores-pendentes/?periodo=${periodo}`, authHeader)).data
}