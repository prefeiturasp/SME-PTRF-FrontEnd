import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';
import {ASSOCIACAO_UUID} from "../auth.service";

const authHeader = ()=>({
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
});

export const getPeriodos = async (dre_uuid = "", solicitacao_sme = false) => {
    const params = new URLSearchParams();

    if (dre_uuid) {
        params.append('dre_uuid', dre_uuid);
    }
    if (solicitacao_sme) {
        params.append('solicitacao_sme', solicitacao_sme);
    }

    const queryParams = params.toString() ? `?${params.toString()}` : '';

    return (await api.get(`/api/periodos/${queryParams}`, authHeader())).data
}

export const getItensDashboard = async (uuid_periodo) => {
    return (await api.get(`/api/prestacoes-contas/dashboard/?periodo=${uuid_periodo}&dre_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&add_reprovadas_nao_apresentacao=SIM`, authHeader())).data
};