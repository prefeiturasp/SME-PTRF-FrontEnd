import api from '../api';
import {
    geTextoExplicativoSuporteUnidades
} from '../SuporteAsUnidades.service.js';
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

    test('geTextoExplicativoSuporteUnidades deve chamar a API corretamente visão = DRE', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await geTextoExplicativoSuporteUnidades("DRE");
        const url = `/api/parametros-dre/texto-pagina-suporte/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('geTextoExplicativoSuporteUnidades deve chamar a API corretamente visão = SME', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await geTextoExplicativoSuporteUnidades("SME");
        const url = `/api/parametros-sme/texto-pagina-suporte/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('geTextoExplicativoSuporteUnidades deve chamar a API corretamente visão diferente de SME/DRE', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await geTextoExplicativoSuporteUnidades("Teste");
        expect(result).toEqual({detail: "Erro. Visão não definida, esperado DRE ou SME."});
    });

});
