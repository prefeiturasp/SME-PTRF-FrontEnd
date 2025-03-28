import api from '../../api';
import { 
    atualizarInfoAta,
    getTabelasAtas,
    getAtas,
    getPreviaAta,
    getGerarAtaPdf,
    getDownloadAtaPdf,
    getRepassesPendentes,
    getDespesasComPagamentoAntecipado,
 } from '../AtasAssociacao.service.js';
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
    
    test('atualizarInfoAta deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const payload = { teste: 'testes'}
        const result = await atualizarInfoAta(ata_uuid, payload);

        expect(api.patch).toHaveBeenCalledWith(
            `api/atas-associacao/${ata_uuid}/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual({ data: mockData });
    });
    
    test('getTabelasAtas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getTabelasAtas();

        expect(api.get).toHaveBeenCalledWith(
            `api/atas-associacao/tabelas/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getAtas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getAtas(ata_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `api/atas-associacao/${ata_uuid}/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getPreviaAta deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        
        const result = await getPreviaAta(associacao_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `api/previas-atas-associacao/${associacao_uuid}/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getGerarAtaPdf deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const prestacao_conta_uuid = '1234'
        const result = await getGerarAtaPdf(prestacao_conta_uuid, ata_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `api/atas-associacao/gerar-arquivo-ata/?prestacao-de-conta-uuid=${prestacao_conta_uuid}&ata-uuid=${ata_uuid}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    it('getDownloadAtaPdf deve baixar o arquivo corretamente na API', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponse = { data: mockBlob };
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

        await getDownloadAtaPdf(ata_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `api/atas-associacao/download-arquivo-ata/?ata-uuid=${ata_uuid}`,
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

    test('getRepassesPendentes deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        
        const result = await getRepassesPendentes(associacao_uuid, periodo_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `/api/associacoes/${associacao_uuid}/repasses-pendentes-por-periodo/?periodo_uuid=${periodo_uuid}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });
    
    test('getDespesasComPagamentoAntecipado deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        
        const result = await getDespesasComPagamentoAntecipado(ata_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `/api/atas-associacao/ata-despesas-com-pagamento-antecipado/?ata-uuid=${ata_uuid}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

});
