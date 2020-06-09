import api from './Api'
import { TOKEN_ALIAS } from './auth.service.js';
import {ASSOCIACAO_UUID} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
}

export const atualizarInfoAta = async (uuid_ata, payload) => {
    return (await api.patch(`/atas-associacao/${uuid_ata}/`, payload, authHeader))
}

export const getTabelasAtas = async () => {
    return (await api.get(`/api/atas-associacao/tabelas/`, authHeader)).data
}