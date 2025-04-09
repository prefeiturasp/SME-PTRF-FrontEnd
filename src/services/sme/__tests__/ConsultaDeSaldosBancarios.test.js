import api from '../../api';
import { 
    getPeriodos,
    getTiposDeConta,
    getSaldosPorTipoDeUnidade,
    getSaldosPorDre,
    getSaldosPorUeDre,
    getDres,
    getSaldosDetalhesAssociacoes,
    getSaldosDetalhesAssociacoesExportar
 } from '../ConsultaDeSaldosBancarios.service.js';
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

    test('getPeriodos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getPeriodos();
        const url = `/api/periodos/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTiposDeConta deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTiposDeConta();
        const url = `/api/tipos-conta/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getDres deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getDres();
        const url = `/api/dres/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getSaldosPorTipoDeUnidade deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const periodo_uuid = '1234'
        const conta_uuid = '1234'
        const result = await getSaldosPorTipoDeUnidade(periodo_uuid, conta_uuid);
        const url = `/api/saldos-bancarios-sme/saldo-por-tipo-unidade/?periodo=${periodo_uuid}&conta=${conta_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getSaldosPorDre deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const periodo_uuid = '1234'
        const conta_uuid = '1234'
        const result = await getSaldosPorDre(periodo_uuid, conta_uuid);
        const url = `/api/saldos-bancarios-sme/saldo-por-dre/?periodo=${periodo_uuid}&conta=${conta_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getSaldosPorUeDre deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const periodo_uuid = '1234'
        const conta_uuid = '1234'
        const result = await getSaldosPorUeDre(periodo_uuid, conta_uuid);
        const url = `/api/saldos-bancarios-sme/saldo-por-ue-dre/?periodo=${periodo_uuid}&conta=${conta_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getSaldosDetalhesAssociacoesExportar deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const periodo_uuid = '1234'
        const conta_uuid = '1234'
        const result = await getSaldosDetalhesAssociacoesExportar(periodo_uuid, conta_uuid);
        const url = `/api/saldos-bancarios-sme-detalhes/exporta_xlsx_dres/?periodo=${periodo_uuid}&conta=${conta_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getSaldosDetalhesAssociacoes deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const periodo_uuid = '1234'
        const conta_uuid = '1234'
        const dre_uuid = '1234'
        const filtrar_por_unidade = 'teste'
        const filtrar_por_tipo_ue = 'teste'
        const result = await getSaldosDetalhesAssociacoes(periodo_uuid, conta_uuid, dre_uuid, filtrar_por_unidade, filtrar_por_tipo_ue);
        const url = `/api/saldos-bancarios-sme-detalhes/saldos-detalhes-associacoes/?periodo=${periodo_uuid}&conta=${conta_uuid}&dre=${dre_uuid}${filtrar_por_unidade ? '&unidade='+filtrar_por_unidade : ''}${filtrar_por_tipo_ue ? '&tipo_ue='+filtrar_por_tipo_ue : ''}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

});
