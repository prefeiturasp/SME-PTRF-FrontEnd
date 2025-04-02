import api from '../../api';
import { getListaDeAnalises, getListaDeAnalisesFiltros } from '../AnaliseDaDre.service.js';
import { TOKEN_ALIAS } from '../../auth.service.js';

jest.mock('../../api', () => ({
    get: jest.fn()
}));


describe('Testes para funções de análise', () => {
    const associacao_uuid = '12345';
    const periodo_uuid = '67890';
    const status_pc = 'aprovado';
    const mockData = [{ id: 1, nome: 'Análise 1' }];
    const mockToken = 'fake-token';	

    beforeEach(() => {
        localStorage.setItem(TOKEN_ALIAS, mockToken);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    const getAuthHeader = () => {
        return {
            headers: {
                'Authorization': `JWT ${mockToken}`,
                'Content-Type': 'application/json'
            }
        };
    };

    test('getListaDeAnalises deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });

        const result = await getListaDeAnalises(associacao_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `api/associacoes/${associacao_uuid}/status-prestacoes/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getListaDeAnalisesFiltros deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });

        const result = await getListaDeAnalisesFiltros(associacao_uuid, periodo_uuid, status_pc);

        expect(api.get).toHaveBeenCalledWith(
            `api/associacoes/${associacao_uuid}/status-prestacoes/?periodo_uuid=${periodo_uuid}&status_pc=${status_pc}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });
});
