import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getFaqCategorias = async () => {
    return (await api.get(`/api/faq-categorias/`, authHeader)).data
};

export const getFaqPorCategoria = async (categoria__uuid) => {
    return (await api.get(`/api/faqs/?categoria__uuid=${categoria__uuid}`, authHeader)).data
};