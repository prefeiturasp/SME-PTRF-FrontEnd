import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
}

export const atualizarInfoAta = async (uuid_ata, payload) => {
    return (await api.patch(`api/atas-associacao/${uuid_ata}/`, payload, authHeader))
}

export const getTabelasAtas = async () => {
    return (await api.get(`api/atas-associacao/tabelas/`, authHeader)).data
}

export const getAtas = async (uuid_ata) => {
    return (await api.get(`api/atas-associacao/${uuid_ata}/`, authHeader)).data
}
