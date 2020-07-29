import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
}

export const atualizarInfoAta = async (payload) => {
    return (await api.patch(`api/atas-associacao/${localStorage.getItem("uuidAta")}/`, payload, authHeader))
}

export const getTabelasAtas = async () => {
    return (await api.get(`api/atas-associacao/tabelas/`, authHeader)).data
}

export const getAtas = async () => {
    return (await api.get(`api/atas-associacao/${localStorage.getItem("uuidAta")}/`, authHeader)).data
}
