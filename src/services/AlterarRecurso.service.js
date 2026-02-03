import api from './api'
import { TOKEN_ALIAS } from './auth.service.js';

const authHeader = () => ({
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
});

export const getRecursosDisponiveis = async () => {
  const { data } = await api.get('/api/recursos/disponiveis', authHeader());
  return data;
}