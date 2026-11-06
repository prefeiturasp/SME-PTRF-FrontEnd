import api from './api';
import { TOKEN_ALIAS } from './auth.service';

const authHeader = () => ({
    headers: {
        Authorization: `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json',
    },
});

export const getAlertaVigente = async (recursoUuid, unidadeUuid) => {
    const resposta = await api.get('/api/alertas-paginas/vigente/', {
        ...authHeader(),
        params: { recurso: recursoUuid, unidade: unidadeUuid },
    });
    return resposta.data;
};
