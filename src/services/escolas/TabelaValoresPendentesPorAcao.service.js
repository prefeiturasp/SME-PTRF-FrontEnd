import api from "../api";

import {TOKEN_ALIAS} from "../auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json',
    }
}


export const tabelaValoresPendentes = async (periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/conciliacoes/tabela-valores-pendentes/?periodo=${periodo_uuid}&conta_associacao=${conta_uuid}`, authHeader)).data
}