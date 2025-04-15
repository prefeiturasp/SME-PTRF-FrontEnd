import api from '../api';
import {
    getArquivosDownload,
    getArquivosDownloadFiltros,
    getStatus,
    getDownloadArquivo,
    deleteArquivo,
    putMarcarDesmarcarLido,
    getQuantidadeNaoLidas
} from '../CentralDeDownload.service.js';
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

    test('getArquivosDownload deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getArquivosDownload();
        const url = `/api/arquivos-download/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getArquivosDownloadFiltros deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const identificador = 'teste'
        const status = 'teste'
        const ultima_atualizacao = 'teste'
        const visto = 'teste'
        const result = await getArquivosDownloadFiltros(identificador, status, ultima_atualizacao, visto);
        const url = `/api/arquivos-download/?identificador=${identificador}&status=${status}&ultima_atualizacao=${ultima_atualizacao}&lido=${visto}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getStatus deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getStatus();
        const url = `/api/arquivos-download/status/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    it('getDownloadArquivo  deve baixar o arquivo corretamente na API', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponse = { data: mockBlob };
        const nome_do_arquivo_com_extensao = 'teste'
        const arquivo_download_uuid = 'teste'

        api.get.mockResolvedValue(mockResponse);
        const mockCreateObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.createObjectURL = mockCreateObjectURL;

        const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
            return { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        });

        await getDownloadArquivo(nome_do_arquivo_com_extensao, arquivo_download_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `/api/arquivos-download/download-arquivo/?arquivo_download_uuid=${arquivo_download_uuid}`,
            expect.objectContaining({
            responseType: 'blob',
            timeout: 30000,
            ...authHeader()
        }));

        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockCreateElement).toHaveBeenCalledWith('a');

        mockCreateObjectURL.mockRestore();
        mockCreateElement.mockRestore();
        
    });

    test('deleteArquivo deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData })
        const arquivo_download_uuid = 'teste'
        const result = await deleteArquivo(arquivo_download_uuid);
        const url = `/api/arquivos-download/${arquivo_download_uuid}`
        expect(api.delete).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('putMarcarDesmarcarLido deve chamar a API corretamente', async () => {
        api.put.mockResolvedValue({ data: mockData })
        const result = await putMarcarDesmarcarLido(payload);
        const url = `/api/arquivos-download/marcar-lido/`
        expect(api.put).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getQuantidadeNaoLidas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getQuantidadeNaoLidas();
        const url = `/api/arquivos-download/quantidade-nao-lidos/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

});
