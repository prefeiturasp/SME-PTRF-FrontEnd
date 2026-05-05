import api from '../api/index.js'
import { TOKEN_ALIAS } from '../auth.service.js';
import {visoesService} from "../visoes.service.js";

const authHeader = (uuidRecursoSelecionado)=>({
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json',
        'x-recurso-selecionado': uuidRecursoSelecionado
    }
});

export const getTabelaPaaDre = async (uuidRecursoSelecionado) => {
    const dreUuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid')

    return (await api.get(`/api/paa-dre/${dreUuid}/tabelas/`, authHeader(uuidRecursoSelecionado))).data
}

export const getPaaPorDre = async (campos, uuidRecursoSelecionado) => {
    const dreUuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid')

    const config = {
        ...authHeader(uuidRecursoSelecionado),
        params: campos
    }

    return (await api.get(`/api/paa-dre/${dreUuid}/`, config)).data
}