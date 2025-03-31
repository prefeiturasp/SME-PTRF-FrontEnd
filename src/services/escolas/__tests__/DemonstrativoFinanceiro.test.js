import api from '../../api';
import { 
    getAcoes,
    ___getDemonstrativoInfo,
    getDemonstrativoInfo,
    previa,
    documentoFinal,
    documentoPrevia
 } from '../DemonstrativoFinanceiro.service.js';
import { TOKEN_ALIAS } from '../../auth.service.js';

jest.mock('../../api', () => ({
    get: jest.fn()
}));

jest.mock('../../api', () => ({
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
}));


const mockToken = 'fake-token';
const associacao_uuid = '12345';
const ata_uuid = '12345';
const periodo_uuid = '67890';
const mockData = [{ id: 1, nome: 'Teste 1' }];

describe('Testes para funções de análise', () => {
    
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

    test('getAcoes deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const conta_uuid = '1234'
        const result = await getAcoes(associacao_uuid, periodo_uuid, conta_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `/api/demonstrativo-financeiro/acoes/?associacao_uuid=${associacao_uuid}&periodo_uuid=${periodo_uuid}&conta-associacao=${conta_uuid}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('___getDemonstrativoInfo deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const acao_associacao_uuid = '1234'
        const conta_associacao_uuid = '1234'
        const result = await ___getDemonstrativoInfo(acao_associacao_uuid, conta_associacao_uuid, periodo_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `/api/demonstrativo-financeiro/demonstrativo-info/?acao-associacao=${acao_associacao_uuid}&conta-associacao=${conta_associacao_uuid}&periodo=${periodo_uuid}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getDemonstrativoInfo deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const periodo = periodo_uuid
        const conta_associacao = '1234'
        const result = await getDemonstrativoInfo(conta_associacao, periodo);

        expect(api.get).toHaveBeenCalledWith(
            `/api/demonstrativo-financeiro/demonstrativo-info/?conta-associacao=${conta_associacao}&periodo=${periodo}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });
    
    test('previa deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const periodo = periodo_uuid
        const conta_associacao = '1234'
        const data_inicio = '2023-01-01'
        const data_fim = '2023-12-31'
        const result = await previa(conta_associacao, periodo, data_inicio, data_fim);

        expect(api.get).toHaveBeenCalledWith(
            `/api/demonstrativo-financeiro/previa/?conta-associacao=${conta_associacao}&periodo=${periodo}&data_inicio=${data_inicio}&data_fim=${data_fim}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    it('documentoFinal deve baixar o arquivo corretamente na API', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponse = { data: mockBlob };
        const conta_associacao = '1234'
        const periodo = periodo_uuid
        const formato = 'pdf'
        api.get.mockResolvedValue(mockResponse);
        const mockCreateObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.createObjectURL = mockCreateObjectURL;

        const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
            return {
                setAttribute: jest.fn(),
                click: jest.fn(),
                href: '',
            };
        });

        await documentoFinal(conta_associacao, periodo, formato);

        expect(api.get).toHaveBeenCalledWith(
            `/api/demonstrativo-financeiro/documento-final/?conta-associacao=${conta_associacao}&periodo=${periodo}&formato_arquivo=${formato}`,
            expect.objectContaining({
            responseType: 'blob',
            timeout: 30000,
            ...getAuthHeader()
        }));

        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockCreateElement).toHaveBeenCalledWith('a');

        mockCreateObjectURL.mockRestore();
        mockCreateElement.mockRestore();
    });

    it('documentoPrevia deve baixar o arquivo corretamente na API', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponse = { data: mockBlob };
        const conta_associacao = '1234'
        const periodo = periodo_uuid
        const formato = 'pdf'
        api.get.mockResolvedValue(mockResponse);
        const mockCreateObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.createObjectURL = mockCreateObjectURL;

        const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
            return {
                setAttribute: jest.fn(),
                click: jest.fn(),
                href: '',
            };
        });

        await documentoPrevia(conta_associacao, periodo, formato);

        expect(api.get).toHaveBeenCalledWith(
            `/api/demonstrativo-financeiro/documento-previa/?conta-associacao=${conta_associacao}&periodo=${periodo}&formato_arquivo=${formato}`,
            expect.objectContaining({
            responseType: 'blob',
            timeout: 30000,
            ...getAuthHeader()
        }));

        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockCreateElement).toHaveBeenCalledWith('a');

        mockCreateObjectURL.mockRestore();
        mockCreateElement.mockRestore();
    });

});
