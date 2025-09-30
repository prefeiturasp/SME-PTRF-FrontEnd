import api from '../../api';
import { 
    getSaldoAtualPorAcaoAssociacao,
    postReceitasPrevistasPaa,
    patchReceitasPrevistasPaa,
    downloadPdfLevantamentoPrioridades,
    getRecursosProprios,
    getTotalizadorRecursoProprio,
    getFontesRecursos,
    getProgramasPddeTotais,
    getAcoesPDDE,
    postRecursoProprioPaa,
    patchRecursoProprioPaa,
    deleteRecursoProprioPaa,
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

    test('getRecursosProprios deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const associacaoUUID = '1234'
        const page = '1'
        const result = await getRecursosProprios(associacaoUUID);

        expect(api.get).toHaveBeenCalledWith(
            `api/recursos-proprios-paa/?associacao__uuid=${associacaoUUID}&page=${page}&page_size=20`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getTotalizadorRecursoProprio deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const associacaoUUID = '1234'
        const result = await getTotalizadorRecursoProprio(associacaoUUID);

        expect(api.get).toHaveBeenCalledWith(
            `api/recursos-proprios-paa/total/?associacao__uuid=${associacaoUUID}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getFontesRecursos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getFontesRecursos();

        expect(api.get).toHaveBeenCalledWith(`api/fontes-recursos-paa/`, getAuthHeader());
        expect(result).toEqual(mockData);
    });

    test('getCategoriasPddeTotais deve chamar a API corretamente', async () => {
        localStorage.setItem('PAA', '1234');
        api.get.mockResolvedValue({ data: mockData });
        const result = await getProgramasPddeTotais();

        expect(api.get).toHaveBeenCalledWith(
            `api/programas-pdde/totais/?paa_uuid=1234&page_size=1000`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getAcoesPDDE deve chamar a API corretamente', async () => {
        localStorage.setItem('PAA', '1234');
        api.get.mockResolvedValue({ data: mockData });
        const currentPage = 1;
        const rowsPerPage = 20;
        const result = await getAcoesPDDE();

        expect(api.get).toHaveBeenCalledWith(
            `/api/acoes-pdde/receitas-previstas-pdde/?page=${currentPage}&page_size=${rowsPerPage}&paa_uuid=1234`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('patchRecursoProprioPaa deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const payload = { teste: 'testes'}
        const uuid = '1234'
        const result = await patchRecursoProprioPaa(uuid, payload);

        expect(api.patch).toHaveBeenCalledWith(
            `api/recursos-proprios-paa/${uuid}/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('postRecursoProprioPaa deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const payload = { teste: 'testes'}
        const result = await postRecursoProprioPaa(payload);

        expect(api.post).toHaveBeenCalledWith(
            `api/recursos-proprios-paa/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('deleteRecursoProprioPaa deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData });
        const uuid = '1234'
        const result = await deleteRecursoProprioPaa(uuid);

        expect(api.delete).toHaveBeenCalledWith(
            `api/recursos-proprios-paa/${uuid}/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

});
