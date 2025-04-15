import api from '../api';
import {
    getAcoesAssociacao,
    getAcoesAssociacaoPorPeriodoConta,
    getTabelas,
    getContas
} from '../Dashboard.service.js';
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

    test('getAcoesAssociacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getAcoesAssociacao(associacao_uuid);
        const url = `/api/associacoes/${associacao_uuid}/painel-acoes`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getAcoesAssociacaoPorPeriodoConta deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const associacao_uuid = '1234'
        const periodo_uuid = '1234'
        const conta_associacao_uuid = '1234'
        const result = await getAcoesAssociacaoPorPeriodoConta(associacao_uuid, periodo_uuid, conta_associacao_uuid);
        const url = `/api/associacoes/${associacao_uuid}/painel-acoes/?periodo_uuid=${periodo_uuid}${conta_associacao_uuid ? '&conta='+ conta_associacao_uuid : ''}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getTabelas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTabelas(associacao_uuid);
        const url = `api/receitas/tabelas/?associacao_uuid=${associacao_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getContas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const periodo_uuid = '1234'
        const result = await getContas(associacao_uuid, periodo_uuid);
        const url = `/api/associacoes/${associacao_uuid}/contas/?periodo_uuid=${periodo_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

});
