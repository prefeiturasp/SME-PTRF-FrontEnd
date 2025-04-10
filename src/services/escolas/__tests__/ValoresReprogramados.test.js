import api from '../../api';
import { 
    getBotaoValoresReprogramados,
    getSaldosValoresReprogramados,
    criarValoresReprogramados
 } from '../ValoresReprogramados.service.js';
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
const periodo_uuid = '1234';

describe('Testes para funções de análise', () => {
    
    beforeEach(() => {
        localStorage.setItem(ASSOCIACAO_UUID, associacao_uuid);
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

    test('getBotaoValoresReprogramados deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getBotaoValoresReprogramados();
        expect(api.get).toHaveBeenCalledWith(
            `/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/permite-implantacao-saldos/`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('getSaldosValoresReprogramados deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getSaldosValoresReprogramados();
        expect(api.get).toHaveBeenCalledWith(
            `/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/implantacao-saldos/`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('criarValoresReprogramados deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const payload = { teste: 'testes'}
        const result = await criarValoresReprogramados(payload);
        expect(api.post).toHaveBeenCalledWith(
            `/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/implanta-saldos/`,
            payload,
            getAuthHeader()
        )
        expect(result).toEqual({ data: mockData });
    });

    test('criarValoresReprogramados deve chamar a API com error', async () => {
        api.post.mockRejectedValue(new Error("Erro na API"))
        const payload = { teste: 'testes'}
        await criarValoresReprogramados(payload);
        expect(api.post).toHaveBeenCalledWith(
            `/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/implanta-saldos/`,
            payload,
            getAuthHeader()
        )
        expect(api.post).rejects.toThrow("Erro na API")
    });

});
