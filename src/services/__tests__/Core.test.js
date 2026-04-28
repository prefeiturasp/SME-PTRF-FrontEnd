import api from '../api';
import {
    getVersaoApi,
    getAmbientes,
    getFeatureFlags,
} from '../Core.service.js';
import { TOKEN_ALIAS, ASSOCIACAO_UUID } from '../auth.service.js';

jest.mock('../api', () => ({
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
}));


const mockToken = 'fake-token';
const mockData = [{ id: 1, nome: 'Teste 1' }];
const mockFeatureFlags = [{ "flag-teste": true }];
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

    test('getVersaoApi deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getVersaoApi();
        const url = `api/versao`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getAmbientes deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getAmbientes();
        const url = `api/ambientes/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getFeatureFlags deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockFeatureFlags })
        const result = await getFeatureFlags();
        const url = `api/feature-flags`
        expect(api.get).toHaveBeenCalledWith(url, {headers: { 'Content-Type': 'application/json' }})
        expect(result).toEqual(mockFeatureFlags);
    });

});
