import api from '../../api';
import { 
    getRateioPorUuid,
    getListaRateiosDespesas,
    filtroPorPalavraRateios,
    filtrosAvancadosRateios,
    getVerificarSaldo,
    getSomaDosTotais
 } from '../RateiosDespesas.service.js';
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
const rateio_uuid = '1234'

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

    test('getRateioPorUuid deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_rateio = rateio_uuid
        const result = await getRateioPorUuid(uuid_rateio);
        expect(api.get).toHaveBeenCalledWith(
            `api/rateios-despesas/${uuid_rateio}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('getListaRateiosDespesas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_rateio = rateio_uuid
        const result = await getListaRateiosDespesas();
        expect(api.get).toHaveBeenCalledWith(
            `api/rateios-despesas/?associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('filtroPorPalavraRateios deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const palavra = ''
        const result = await filtroPorPalavraRateios(palavra);
        expect(api.get).toHaveBeenCalledWith(
            `api/rateios-despesas/?search=${palavra}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('filtrosAvancadosRateios deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const palavra = ''
        const aplicacao_recurso = ''
        const acao_associacao__uuid = ''
        const despesa__status = ''
        const fornecedor = ''
        const data_inicio = ''
        const data_fim = ''
        const conta_associacao__uuid = ''
        
        const result = await filtrosAvancadosRateios(palavra, aplicacao_recurso, acao_associacao__uuid, despesa__status, fornecedor, data_inicio, data_fim, conta_associacao__uuid);
        expect(api.get).toHaveBeenCalledWith(
            `api/rateios-despesas/?search=${palavra}&aplicacao_recurso=${aplicacao_recurso}&acao_associacao__uuid=${acao_associacao__uuid}&despesa__status=${despesa__status}&fornecedor=${fornecedor}${data_inicio ? '&data_inicio='+data_inicio : ""}${data_fim ? '&data_fim='+data_fim : ""}&conta_associacao__uuid=${conta_associacao__uuid}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('getVerificarSaldo deve chamar a API corretamente passando Despesa UUID', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const payload = { teste: 'testes'}
        const despesa_uuid = '1234'
        const result = await getVerificarSaldo(payload, despesa_uuid);
        expect(api.post).toHaveBeenCalledWith(
            `/api/rateios-despesas/verificar-saldos/?despesa_uuid=${despesa_uuid}`,
            payload,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('getVerificarSaldo deve chamar a API corretamente SEM passar Despesa UUID', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const payload = { teste: 'testes'}
        const result = await getVerificarSaldo(payload);
        expect(api.post).toHaveBeenCalledWith(
            `/api/rateios-despesas/verificar-saldos/`,
            payload,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('getSomaDosTotais deve chamar a API corretamente passando Despesa UUID', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const aplicacao_recurso = ''
        const palavra = ''
        const acao_associacao__uuid = ''
        const despesa__status = ''
        const fornecedor = ''
        const data_inicio = ''
        const data_fim = ''
        const conta_associacao__uuid = ''
        const filtro_vinculo_atividades = ''
        const filtro_informacoes = ''
        const result = await getSomaDosTotais(palavra, aplicacao_recurso, acao_associacao__uuid, despesa__status, fornecedor, data_inicio, data_fim, conta_associacao__uuid, filtro_vinculo_atividades, filtro_informacoes);
        expect(api.get).toHaveBeenCalledWith(
            `api/rateios-despesas/totais/?search=${palavra}&aplicacao_recurso=${aplicacao_recurso}&acao_associacao__uuid=${acao_associacao__uuid}&despesa__status=${despesa__status}&fornecedor=${fornecedor}${data_inicio ? '&data_inicio='+data_inicio : ""}${data_fim ? '&data_fim='+data_fim : ""}&conta_associacao__uuid=${conta_associacao__uuid}&filtro_vinculo_atividades=${filtro_vinculo_atividades}&filtro_informacoes=${filtro_informacoes}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
});
