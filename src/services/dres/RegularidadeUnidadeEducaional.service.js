import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const verificacaoRegularidade = async (associacao_uuid, ano) => {
    if (!ano){
        ano = new Date().getFullYear()
    }
    return (await api.get(`/api/associacoes/${associacao_uuid}/verificacao-regularidade/?ano=${ano}`, authHeader)).data
};

export const salvarItensRegularidade = async (associacao_uuid, payload) => {
    return (await api.post(`/api/associacoes/${associacao_uuid}/atualiza-itens-verificacao/`, payload, authHeader)).data
};
