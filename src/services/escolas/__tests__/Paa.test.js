import api from '../../api';
import { 
    getSaldoAtualPorAcaoAssociacao,
    postReceitasPrevistasPaa,
    patchReceitasPrevistasPaa,
    downloadPdfLevantamentoPrioridades
 } from '../Paa.service.js';
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

    test('getSaldoAtualPorAcaoAssociacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const acaoAssociacaoUUID = '1234'
        const result = await getSaldoAtualPorAcaoAssociacao(acaoAssociacaoUUID);

        expect(api.get).toHaveBeenCalledWith(
            `api/acoes-associacoes/${acaoAssociacaoUUID}/obter-saldo-atual/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('postReceitasPrevistasPaa deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const payload = { teste: 'testes'}
        const result = await postReceitasPrevistasPaa(payload);

        expect(api.post).toHaveBeenCalledWith(
            `api/receitas-previstas-paa/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('patchReceitasPrevistasPaa deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const payload = { teste: 'testes'}
        const uuid = '1234'
        const result = await patchReceitasPrevistasPaa(uuid, payload);

        expect(api.patch).toHaveBeenCalledWith(
            `api/receitas-previstas-paa/${uuid}/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    it('downloadPdfLevantamentoPrioridades deve baixar o arquivo corretamente na API', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponse = { data: mockBlob };
        const associacao_uuid = '1234'
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

        await downloadPdfLevantamentoPrioridades(associacao_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `/api/paa/download-pdf-levantamento-prioridades/`,
            expect.objectContaining({
            responseType: 'blob',
            timeout: 30000,
            ...getAuthHeader(),
            params: {
                associacao_uuid : associacao_uuid
            }
        }));

        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockCreateElement).toHaveBeenCalledWith('a');

        mockCreateObjectURL.mockRestore();
        mockCreateElement.mockRestore();
    });

});
