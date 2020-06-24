import api from './Api'
import { TOKEN_ALIAS } from './auth.service.js';
import {ASSOCIACAO_UUID} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getBotaoValoresReprogramados = async () => {
    return (await api.get(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/permite-implantacao-saldos/`, authHeader)).data
};
