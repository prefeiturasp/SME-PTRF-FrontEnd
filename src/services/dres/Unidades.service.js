import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';
import {visoesService} from "../visoes.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getUnidade = async () => {
    return (await api.get(`api/unidades/${visoesService.getItemUsuarioLogado('unidade_selecionada.uuid')}`, authHeader)).data
};

export const salvaDadosDiretoria = async (uuid_unidade, payload) => {
    return (await api.patch(`api/unidades/${uuid_unidade}/`, payload, authHeader)).data
};