import api from '../../api';
import { getExportaCreditos } from '../ExtracaoDados.service.js';
import { TOKEN_ALIAS, ASSOCIACAO_UUID } from '../../auth.service.js';

jest.mock('../../api', () => ({
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
}));


const mockToken = 'fake-token';
const mockData = [{ id: 1, nome: 'Teste 1' }];
const associacao_uuid = '1234'
const payload = { teste: 'teste' }

describe('Testes para funções de análise', () => {
    
    beforeEach(() => {
        localStorage.setItem(ASSOCIACAO_UUID, associacao_uuid);
        localStorage.setItem(TOKEN_ALIAS, mockToken);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    const authHeader = () => {
        return {
            headers: {
                'Authorization': `JWT ${mockToken}`,
                'Content-Type': 'application/json'
            }
        };
    };

    test('getExportaCreditos  deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const dataInicio= '2025-04-08'
        const dataFinal= '2025-04-08'
        const dre_uuid = '1234'
        const url = `http://localhost`
        const result = await getExportaCreditos(url, dataInicio, dataFinal, dre_uuid);
        const full_url = `${url}?data_inicio=${dataInicio}&data_final=${dataFinal}&dre_uuid=${dre_uuid}`
        expect(api.get).toHaveBeenCalledWith(full_url, authHeader())
        expect(result).toEqual(mockData);
    });

});
