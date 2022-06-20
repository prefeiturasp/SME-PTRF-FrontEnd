import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getListaValoresReprogramados = async (dreUuid, status_padrao) => {
    return (
        await api.get(`api/valores-reprogramados/lista-associacoes/?dre_uuid=${dreUuid}&status=${status_padrao}`, authHeader)
    ).data
}

export const filtrosListaValoresReprogramados = async(dreUuid, search=null, tipo_unidade=null, status_valores=null) => {
    const url = `api/valores-reprogramados/lista-associacoes/?dre_uuid=${dreUuid}&search=${search}&tipo_unidade=${tipo_unidade}&status=${status_valores}`
    return (await api.get(url, authHeader)).data
}

export const getTabelaValoresReprogramados = async () => {
    return (await api.get(`/api/valores-reprogramados/tabelas`, authHeader)).data
};