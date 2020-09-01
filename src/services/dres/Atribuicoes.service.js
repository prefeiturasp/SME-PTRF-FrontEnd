import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getUnidadesParaAtribuir = async (dreUuid, periodo) => {
    return (await api.get(`api/unidades/para-atribuicao/?dre_uuid=${dreUuid}&periodo=${periodo}`, authHeader)).data
};

export const filtrosUnidadesParaAtribuir = async (dreUuid, periodo, tipo_unidade, termo, codigo_eol, tecnico) => {
    return (await api.get(`api/unidades/para-atribuicao/?dre_uuid=${dreUuid}&periodo=${periodo}&tipo_unidade=${tipo_unidade}&search=${termo}&codigo_eol=${codigo_eol}&tecnico=${tecnico}`, authHeader)).data
};

export const atribuirTecnicos = async (payload) => {
    return api.post('api/atribuicoes/lote/', payload, authHeader).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};

export const retirarAtribuicoes = async (payload) => {
    return api.post('api/atribuicoes/desfazer-lote/', payload, authHeader).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};

export const atribuirTecnico = async (payload) => {
    return api.post('api/atribuicoes/', payload, authHeader).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};
