import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
}

export const detalhamentoConsolidadoDRE = async (uuid_consolidado) => {
    return api.get(`/api/consolidados-dre/detalhamento/?uuid=${uuid_consolidado}`, authHeader)
}

export const detalhamentoConferenciaDocumentos = async (uuid_consolidado) => {
    return api.get(`/api/consolidados-dre/detalhamento-conferencia-documentos/?uuid=${uuid_consolidado}`, authHeader)
}

export const deleteReabreConsolidadoDRE = async (uuid_consolidado) => {
    return api.delete(`/api/consolidados-dre/reabrir-consolidado/?uuid=${uuid_consolidado}`, authHeader)
}
