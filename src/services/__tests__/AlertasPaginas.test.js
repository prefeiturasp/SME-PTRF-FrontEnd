import api from '../api';
import { getAlertaVigente } from '../AlertasPaginas.service';
import { TOKEN_ALIAS } from '../auth.service';

jest.mock('../api', () => ({ get: jest.fn(), registerUnauthorizedHandler: jest.fn() }));

describe('AlertasPaginas.service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.setItem(TOKEN_ALIAS, 'token-teste');
    });

    it('consulta o alerta vigente com recurso, unidade e cabeçalho de autenticação', async () => {
        api.get.mockResolvedValue({ data: { alerta: null } });

        const resultado = await getAlertaVigente('rec-1', 'uni-1');

        expect(api.get).toHaveBeenCalledWith('/api/alertas-paginas/vigente/', {
            headers: { Authorization: 'JWT token-teste', 'Content-Type': 'application/json' },
            params: { recurso: 'rec-1', unidade: 'uni-1' },
        });
        expect(resultado).toEqual({ alerta: null });
    });

    it('propaga o erro da API', async () => {
        api.get.mockRejectedValue(new Error('falha'));

        await expect(getAlertaVigente('rec-1', 'uni-1')).rejects.toThrow('falha');
    });
});