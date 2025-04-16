import api from '../../api';
import { 
    previa,
    documentoFinal,
    documentoPrevia,
    getRelacaoBensInfo
 } from '../RelacaoDeBens.service.js';
import { TOKEN_ALIAS } from '../../auth.service.js';

jest.mock('../../api', () => ({
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
}));


const mockToken = 'fake-token';
const mockData = [{ id: 1, nome: 'Teste 1' }];
const periodo_uuid = '1234';

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

    test('previa deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const conta_associacao = '1234'
        const periodo = '1234'
        const data_inicio = '2025-04-07'
        const data_fim = '2025-0407'
        const result = await previa(conta_associacao, periodo, data_inicio, data_fim);
        expect(api.get).toHaveBeenCalledWith(
            `/api/relacao-bens/previa/?conta-associacao=${conta_associacao}&periodo=${periodo}&data_inicio=${data_inicio}&data_fim=${data_fim}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('getRelacaoBensInfo deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const conta_associacao = '1234'
        const periodo = '1234'
        const result = await getRelacaoBensInfo(conta_associacao, periodo);
        expect(api.get).toHaveBeenCalledWith(
            `/api/relacao-bens/relacao-bens-info/?conta-associacao=${conta_associacao}&periodo=${periodo}`,
            getAuthHeader()
        )
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
            `/api/relacao-bens/documento-final/?conta-associacao=${conta_associacao}&periodo=${periodo}&formato_arquivo=${formato}`,
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
            `/api/relacao-bens/documento-previa/?conta-associacao=${conta_associacao}&periodo=${periodo}&formato_arquivo=${formato}`,
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
