import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getMembrosComissao = async (dreUuid) => {
    return (await api.get(`api/membros-comissoes/?dre__uuid=${dreUuid}`, authHeader)).data
};

export const getComissoes = async () => {
    return (await api.get(`api/comissoes/`, authHeader)).data
};

export const getMembrosComissaoFiltro = async (dreUuid, comissaoUuid, nomeOuRf) => {
    if(comissaoUuid){
        return (await api.get(`api/membros-comissoes/?dre__uuid=${dreUuid}&comissao_uuid=${comissaoUuid}&nome_ou_rf=${nomeOuRf}`, authHeader)).data
    }
    else{
        return (await api.get(`api/membros-comissoes/?dre__uuid=${dreUuid}&nome_ou_rf=${nomeOuRf}`, authHeader)).data
    }
};

export const postMembroComissao = async (payload) => {
    return (await api.post(`/api/membros-comissoes/`, payload, authHeader))
};

export const patchMembroComissao = async (membro_comissao_uuid, payload) => {
    return (await api.patch(`/api/membros-comissoes/${membro_comissao_uuid}/`, payload, authHeader)).data
};

export const deleteMembroComissao  = async (membro_comissao_uuid) => {
    return (await api.delete(`/api/membros-comissoes/${membro_comissao_uuid}/`, authHeader)).data
}